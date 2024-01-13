import { Injectable } from '@nestjs/common';
import { Message, Recent } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

// Chat service class
@Injectable()
export class MsgService {
  constructor(private readonly prisma: PrismaService) {}

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
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
    });
    if (!chatRoomMember) throw new Error('User not in chat room');
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

  // start user recent message
  async getRecentMessages(userId: number): Promise<Recent[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    return await this.prisma.recent.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        userId: true,
        updatedAt: true,
        showMessage: true,
        chatRoomId: true,
        createdAt: true,
        recentUser: {
          select: {
            id: true,
            username: true,
            image: true,
          }
        }
      }
    });
  }
  // add user recent message
  async addRecentMessage(recentData: Recent, userId: number): Promise<Recent> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      where: { id: recentData.id },
    });
    if (recent) {
      return await this.prisma.recent.update({
        where: { id: recentData.id },
        data: recentData,
      });
    }
    return await this.prisma.recent.create({
      data: recentData,
    });
  }
  // delete user recent message
  async deleteRecentMessage(id: number): Promise<Recent | null> {
    return await this.prisma.recent.delete({
      where: { id },
    });
  }
  // end user recent message
}
