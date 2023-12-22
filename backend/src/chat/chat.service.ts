import { Injectable, Inject } from '@nestjs/common';
import { ChatRoom, Message, PrismaClient, UserChatRoom } from '@prisma/client';

// Chat service class
// const prismaClient = new PrismaClient();
@Injectable()
export class ChatService {
  constructor(
    @Inject('PrismaClient') private readonly prismaClient: PrismaClient,
  ) {}

  // start chat room
  // get all chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    return await this.prismaClient.chatRoom.findMany();
  }
  // get chat room by id
  async getChatRoom(id: number): Promise<ChatRoom | null> {
    return await this.prismaClient.chatRoom.findUnique({
      where: { id: id },
    });
  }
  // create chat room
  async createChatRoom(chatRoomData: ChatRoom): Promise<ChatRoom> {
    return await this.prismaClient.chatRoom.create({
      data: chatRoomData,
    });
  }
  // update chat room
  async updateChatRoom(
    id: number,
    chatRoomData: ChatRoom,
  ): Promise<ChatRoom | null> {
    return await this.prismaClient.chatRoom.update({
      where: { id },
      data: {
        name: chatRoomData.name,
        visibility: chatRoomData.visibility,
      },
    });
  }
  // delete chat room
  async deleteChatRoom(id: number): Promise<ChatRoom | null> {
    try {
      const existingChatRoom = await this.prismaClient.chatRoom.findUnique({
        where: { id },
      });

      if (!existingChatRoom) throw new Error('Chat room not found');

      return await this.prismaClient.chatRoom.delete({
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
  async getUserChatRooms(): Promise<UserChatRoom[]> {
    return await this.prismaClient.userChatRoom.findMany();
  }

  // get user chat room by id
  async getUserChatRoom(
    userId: number,
    chatRoomId: number,
  ): Promise<UserChatRoom | null> {
    return await this.prismaClient.userChatRoom.findUnique({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });
  }

  // create user chat room
  async createUserChatRoom(
    userChatRoomData: UserChatRoom,
  ): Promise<UserChatRoom> {
    return await this.prismaClient.userChatRoom.create({
      data: userChatRoomData,
    });
  }

  // update user chat room
  async updateUserChatRoom(
    userId: number,
    chatRoomId: number,
    userChatRoomData: UserChatRoom,
  ): Promise<UserChatRoom | null> {
    return await this.prismaClient.userChatRoom.update({
      where: { userId_chatRoomId: { userId, chatRoomId } },
      data: userChatRoomData,
    });
  }

  // delete user chat room
  async deleteUserChatRoom(
    userId: number,
    chatRoomId: number,
  ): Promise<UserChatRoom | null> {
    return await this.prismaClient.userChatRoom.delete({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });
  }
  // end user chat room

  // start user message
  // get all messages of specific users
  async getUserMessages(
    senderId: number,
    receiverId: number,
  ): Promise<Message[]> {
    return await this.prismaClient.message.findMany({
      where: {
        senderId: senderId,
        receiverId: receiverId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // add user message
  async addUserMessage(messageData: Message): Promise<Message> {
    return await this.prismaClient.message.create({
      data: messageData,
    });
  }

  // delete user message
  async deleteUserMessage(id: number): Promise<Message | null> {
    return await this.prismaClient.message.delete({
      where: { id },
    });
  }
}
