import { Injectable } from '@nestjs/common';
import { Message, Recent } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FriendshipService } from 'src/notification/friendship.service';

// Chat service class
@Injectable()
export class MsgService {
  constructor(private readonly prisma: PrismaService, private readonly Friends: FriendshipService) {}

  // get all messages of room
  async getChatRoomMessages(
    chatRoomId: number,
    userId: number,
  ): Promise<Message[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });
    if (!chatRoom) throw new Error('Chat room not found');
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
    });
    if (!chatRoomMember) throw new Error('User not in chat room');
    return await this.prisma.message.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        senderId: true,
        chatRoomId: true,
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
            status: true,
          }
        }
      }
    });
  }
  // add user message
  async addMessage(messageData: Message, userId: number): Promise<Message> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: messageData.chatRoomId },
    });
    if (!chatRoom) throw new Error('Chat room not found');
    const chatRoomMembers = await this.prisma.chatRoomMember.findMany({
      where: { chatRoomId: chatRoom.id },
    });
    console.log(chatRoomMembers);
    const specificMember = chatRoomMembers.find((member) => member.userId === user.id);
    if (!specificMember) throw new Error('User not in chat room');
    // const friends = await this.Friends.getFriendListByUserId(userId);
    // if (!/[a-zA-Z]/.test(chatRoom.name.charAt(0))) {
    //   const roomMember = chatRoomMembers.find((member) => member.userId !== user.id);
    //   if (roomMember){
    //     const tmp = friends.find((friend) => friend.id === roomMember.userId);
    //     tmp.block
    //   }
    // }
    const roomMember = chatRoomMembers.find((member) => member.userId !== user.id);
    const tmp = await this.Friends.getFriendship(userId, roomMember.userId);
    if (tmp.block) throw new Error('User blocked');
    const msg = await this.prisma.message.create({
      data: messageData,
    });
    return await this.prisma.message.findUnique({
      where: { id: msg.id },
      select: {
        id: true,
        text: true,
        createdAt: true,
        senderId: true,
        chatRoomId: true,
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          }
        }
      }
    });
  }
  // update user message
  async updateMessage(messageData: Message, userId: number): Promise<Message> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: messageData.chatRoomId },
    });
    if (!chatRoom) throw new Error('Chat room not found');
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
    });
    if (!chatRoomMember) throw new Error('User not in chat room');
    return await this.prisma.message.update({
      where: { id: messageData.id },
      data: messageData,
    });
  }
  // delete user message
  async deleteMessage(id: number): Promise<Message | null> {
    return await this.prisma.message.delete({
      where: { id },
    });
  }
  // end user message

  // get recent for user
  async getRecent(userId: number): Promise<Recent[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const recent = await this.prisma.recent.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          userId: true,
          chatRoomId: true,
          createdAt: true,
          updatedAt: true,
          lastMessage: true,
          link: true,
          senderId: true,
          chatRoom: {
            select: {
              id: true,
              name: true,
              users: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });
  
      const userDetails = await Promise.all(
        recent.map((r) =>
          this.prisma.user.findMany({
            where: {
              id: {
                in: r.chatRoom.users.map((u) => u.userId),
                not: userId,
              },
            },
            select: {
              id: true,
              username: true,
              image: true,
            },
          })
        )
      );
  
      // Merge userDetails with recent
      const result = recent.map((r, i) => ({
        ...r,
        chatRoom: {
          ...r.chatRoom,
          users: userDetails[i],
        },
      }));
  
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  // add or update recent for user
  async addRecent(recentData: Recent): Promise<Recent> {
    const user = await this.prisma.user.findUnique({
      where: { id: recentData.userId },
    });
    if (!user) throw new Error('User not found');
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: recentData.chatRoomId },
    });
    if (!chatRoom) throw new Error('Chat room not found');
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
    });
    if (!chatRoomMember) throw new Error('User not in chat room');
    const recent = await this.prisma.recent.findUnique({
      where: {
          userId_chatRoomId: { userId: recentData.userId, chatRoomId: recentData.chatRoomId },
      }
    });
    if (recent) {
      return await this.prisma.recent.update({
        where: {
          userId_chatRoomId: { userId: recentData.userId, chatRoomId: recentData.chatRoomId },
        },
        data: recentData,
      });
    } else {
      return await this.prisma.recent.create({
        data: recentData,
      });
    }
  }
  // delete recent for user
  async deleteRecent(userId: number, chatRoomId: number): Promise<Recent | null> {
    return await this.prisma.recent.delete({
      where: {
        userId_chatRoomId: { userId: userId, chatRoomId: chatRoomId },
      }
    });
  }
}
