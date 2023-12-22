import { Injectable } from '@nestjs/common';
import { ChatRoom, Message, PrismaClient, UserChatRoom } from '@prisma/client';

// Chat service class
const prismaClient = new PrismaClient();
@Injectable()
export class ChatService {
  // constructor(private readonly prismaClient: PrismaClient) {}

  // start chat room
  // get all chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    return await prismaClient.chatRoom.findMany();
  }
  // get chat room by id
  async getChatRoom(id: number): Promise<ChatRoom | null> {
    return await prismaClient.chatRoom.findUnique({
      where: { id: id },
    });
  }
  // create chat room
  async createChatRoom(chatRoomData: ChatRoom): Promise<ChatRoom> {
    return await prismaClient.chatRoom.create({
      data: chatRoomData,
    });
  }
  // update chat room
  async updateChatRoom(
    id: number,
    chatRoomData: ChatRoom,
  ): Promise<ChatRoom | null> {
    return await prismaClient.chatRoom.update({
      where: { id },
      data: chatRoomData,
    });
  }
  // delete chat room
  async deleteChatRoom(id: number): Promise<ChatRoom | null> {
    return await prismaClient.chatRoom.delete({
      where: { id: id },
    });
  }
  // end chat room

  // start user chat room
  // get all user chat rooms
  async getUserChatRooms(): Promise<UserChatRoom[]> {
    return await prismaClient.userChatRoom.findMany();
  }

  // get user chat room by id
  async getUserChatRoom(
    userId: number,
    chatRoomId: number,
  ): Promise<UserChatRoom | null> {
    return await prismaClient.userChatRoom.findUnique({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });
  }

  // create user chat room
  async createUserChatRoom(
    userChatRoomData: UserChatRoom,
  ): Promise<UserChatRoom> {
    return await prismaClient.userChatRoom.create({
      data: userChatRoomData,
    });
  }

  // update user chat room
  async updateUserChatRoom(
    userId: number,
    chatRoomId: number,
    userChatRoomData: UserChatRoom,
  ): Promise<UserChatRoom | null> {
    return await prismaClient.userChatRoom.update({
      where: { userId_chatRoomId: { userId, chatRoomId } },
      data: userChatRoomData,
    });
  }

  // delete user chat room
  async deleteUserChatRoom(
    userId: number,
    chatRoomId: number,
  ): Promise<UserChatRoom | null> {
    return await prismaClient.userChatRoom.delete({
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
    return await prismaClient.message.findMany({
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
    return await prismaClient.message.create({
      data: messageData,
    });
  }

  // delete user message
  async deleteUserMessage(id: number): Promise<Message | null> {
    return await prismaClient.message.delete({
      where: { id },
    });
  }
}
