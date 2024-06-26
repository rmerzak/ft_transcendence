import { Injectable } from '@nestjs/common';
import { Message, Recent, RoomStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FriendshipService } from 'src/notification/friendship.service';

// Chat service class
@Injectable()
export class MsgService {
  constructor(private readonly prisma: PrismaService, private readonly Friends: FriendshipService) { }

  // get all messages of room
  async getChatRoomMessages(
    chatRoomId: number,
    userId: number,
    from: string
  ): Promise<Message[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });
    if (!chatRoom) throw new Error('Chat room not found');
    if (from === 'room' && !/[a-zA-Z]/.test(chatRoom.name.charAt(0)))
      throw new Error('Invalid chat room');
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
    });
    if (!chatRoomMember) throw new Error('User not in chat room');
    if (chatRoomMember.status === RoomStatus.BANNED) throw new Error('Your are banned from this room');
    const Friends = await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });
    const msgs = await this.prisma.message.findMany({
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
        type: true,
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
    if (from === 'user')
      return msgs;
    const filteredMsgs = msgs.filter((msg) => {
      if (msg.senderId === userId || msg.type === 'ANNOUCEMENT') return true;
      return !Friends.some((friend) => friend.block && (friend.senderId === msg.senderId || friend.receiverId === msg.senderId));
    });

    return filteredMsgs;
  }
  // add user message
  async addMessage(messageData: Message, userId: number): Promise<Message> {
    if (messageData.type === 'ANNOUCEMENT') {
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: messageData.chatRoomId },
      });
      if (!chatRoom) throw new Error('Chat room not found');
      if (/[a-zA-Z]/.test(chatRoom.name.charAt(0))) {
        const msg = await this.prisma.message.create({
          data: messageData,
        });
        if (!msg) throw new Error('Message not created');
        return msg;
      }
    }
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
    const specificMember = chatRoomMembers.find((member) => member.userId === user.id);
    if (!specificMember) throw new Error('User not in chat room');
    if (!/[a-zA-Z]/.test(chatRoom.name.charAt(0))) {
      const roomMember = chatRoomMembers.find((member) => member.userId !== user.id);
      try {
        const tmp = await this.Friends.getFriendship(userId, roomMember.userId);
        if (tmp.status !== 'ACCEPTED') throw new Error('You have to be friend with this user to send message');
        if (tmp.block) throw new Error('User blocked');
      } catch (error) {
        throw new Error('You have to be friend with this user to send message');
      }
    } else {
      if (specificMember.status === RoomStatus.BANNED) throw new Error('Your are banned from this room');
      else if (specificMember.status === RoomStatus.MUTED) {
        const result = compareDateWithCurrent(addDates(specificMember.mutedDate, Number(specificMember.mutedDuration)));
        if (result) throw new Error('Your are muted from this room');
        await this.prisma.chatRoomMember.update({
          where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
          data: {
            status: RoomStatus.NORMAL,
            mutedDuration: null,
          }
        });
      }
    }
    const msg = await this.prisma.message.create({
      data: messageData,
    });
    if (!msg) throw new Error('Message not created');
    return await this.prisma.message.findUnique({
      where: { id: msg.id },
      select: {
        id: true,
        text: true,
        createdAt: true,
        senderId: true,
        chatRoomId: true,
        type: true,
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

      const recents = await this.prisma.recent.findMany({
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
        recents.map((r) =>
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
      const result = recents.map((r, i) => ({
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
// add two dates

function addDates(date: Date, duration: number): number {
  return date.getTime() + duration;
}

function compareDateWithCurrent(date1: number): boolean {
  const date2 = new Date();
  return date1 > date2.getTime();
}
