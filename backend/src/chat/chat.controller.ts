import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom, Message } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // get chat room by id using query string
  @Get()
  async getChatRooms(
    @Query('id') id?: number,
  ): Promise<ChatRoom[] | ChatRoom | null> {
    if (id !== undefined) return await this.chatService.getChatRoom(Number(id));
    else return await this.chatService.getChatRooms();
  }

  // get chat room by id
  @Get(':id')
  async getChatRoom(@Param('id') id: string): Promise<ChatRoom | null> {
    return await this.chatService.getChatRoom(Number(id));
  }

  // create chat room
  @Post()
  async createChatRoom(@Body() chatRoomData: ChatRoom): Promise<ChatRoom> {
    if (isEmpty(chatRoomData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.chatService.createChatRoom(chatRoomData);
  }

  // update chat room
  @Put(':id')
  async updateChatRoom(
    @Param('id') id: number,
    @Body() chatRoomData: ChatRoom,
  ): Promise<ChatRoom | null> {
    return await this.chatService.updateChatRoom(id, chatRoomData);
  }

  // delete chat room
  @Delete(':id')
  async deleteChatRoom(@Param('id') id: number): Promise<ChatRoom | null> {
    return await this.chatService.deleteChatRoom(id);
  }

  // get all messages of specific users
  @Get()
  async getUserMessages(
    @Query('sdId') sdId: number,
    @Query('rcId') rcId: number,
  ): Promise<Message[]> {
    return await this.chatService.getUserMessages(sdId, rcId);
  }

  // add message
  @Post()
  async addUserMessage(@Body() messageData: Message): Promise<Message> {
    return await this.chatService.addUserMessage(messageData);
  }

  // delete user message
  @Delete()
  async deleteUserMessage(@Query('id') id: number): Promise<Message | null> {
    return await this.chatService.deleteUserMessage(id);
  }
}

const isEmpty = (obj: any): boolean => {
  return Object.getOwnPropertyNames(obj).length === 0;
};
