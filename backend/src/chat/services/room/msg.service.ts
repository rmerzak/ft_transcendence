import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

// Chat service class
@Injectable()
export class MsgService {
  constructor(private readonly prisma: PrismaService) {}
  
  // start user message
  // get all messages of specific users
  // async getUserMessages(
  //   userId: number,
  // ): Promise<Message[]> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //   });
  //   if (!user) throw new Error('User not found');
  //   return await this.prisma.message.findMany({
  //     where: {
  //       senderId: userId,
  //       OR: {
  //         receiverId: userId,
  //       },
  //     },
  //     orderBy: {
  //       createdAt: 'asc',
  //     },
  //   });
  // }

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
    return await this.prisma.message.create({
      data: messageData,
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
}
