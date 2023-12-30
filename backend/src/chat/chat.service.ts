import { Injectable } from '@nestjs/common';
import { ChatRoom, Message, ChatRoomMember } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Chat service class
@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // start chat room
  // get all chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    return await this.prisma.chatRoom.findMany();
  }
  // get chat room by id
  async getChatRoom(id: number): Promise<ChatRoom | null> {
    return await this.prisma.chatRoom.findUnique({
      where: { id: id },
    });
  }
  // create chat room
  async createChatRoom(chatRoomData: ChatRoom): Promise<ChatRoom> {
    const existingChatRoom = await this.prisma.chatRoom.findUnique({
      where: { name: chatRoomData.name },
    });

    if (existingChatRoom) throw new Error('Chat room already exists');

    return await this.prisma.chatRoom.create({
      data: chatRoomData,
    });
  }
  // update chat room
  async updateChatRoom(
    id: number,
    chatRoomData: ChatRoom,
  ): Promise<ChatRoom | null> {
    return await this.prisma.chatRoom.update({
      where: { id },
      data: {
        name: chatRoomData.name,
        passwordHash: chatRoomData.passwordHash,
        visibility: chatRoomData.visibility,
      },
    });
  }
  // delete chat room
  async deleteChatRoom(id: number): Promise<ChatRoom | null> {
    try {
      const existingChatRoom = await this.prisma.chatRoom.findUnique({
        where: { id },
      });

      if (!existingChatRoom) throw new Error('Chat room not found');

      return await this.prisma.chatRoom.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting chat room:', error.message);
      return null;
    }
  }
  // end chat room

  // start user chat room
  // get all user chat rooms
  async getChatRoomMembers(): Promise<ChatRoomMember[]> {
    return await this.prisma.chatRoomMember.findMany();
  }

  // get user chat room by id
  async getChatRoomMember(
    userId: number,
    chatRoomId: number,
  ): Promise<ChatRoomMember | null> {
    return await this.prisma.chatRoomMember.findUnique({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });
  }

  // create user chat room
  async createchatRoomMember(
    chatRoomMemData: ChatRoomMember,
  ): Promise<ChatRoomMember> {
    return await this.prisma.chatRoomMember.create({
      data: chatRoomMemData,
    });
  }

  // update user chat room
  async updatechatRoomMember(
    userId: number,
    chatRoomId: number,
    chatRoomMemData: ChatRoomMember,
  ): Promise<ChatRoomMember | null> {
    return await this.prisma.chatRoomMember.update({
      where: { userId_chatRoomId: { userId, chatRoomId } },
      data: chatRoomMemData,
    });
  }

  // delete user chat room
  async deletechatRoomMember(
    userId: number,
    chatRoomId: number,
  ): Promise<ChatRoomMember | null> {
    return await this.prisma.chatRoomMember.delete({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });
  }
  // end user chat room

  // start user message
  // get all messages of specific users
  async getUserMessages(
    senderId: number,
    chatRoomId: number,
  ): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        senderId: senderId,
        ChatRoomId: chatRoomId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // add user message
  async addMessage(messageData: Message): Promise<Message> {
    return await this.prisma.message.create({
      data: messageData,
    });
  }
  // update user message
  async updateMessage(messageData: Message): Promise<Message> {
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
