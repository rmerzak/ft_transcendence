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
import { $Enums, ChatRoom, Message } from '@prisma/client';
import { isAlpha } from 'class-validator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // get chat room by id using query string
  @Get()
  async getChatRooms(
    @Query('id') id?: number,
  ): Promise<ChatRoom[] | ChatRoom | null> {
    if (id !== undefined) {
      checkIfNumber(id.toString(), 'Chat room id must be a number');
      return await this.chatService.getChatRoom(Number(id));
    } else return await this.chatService.getChatRooms();
  }

  // get chat room by id
  @Get(':id')
  async getChatRoom(@Param('id') id: number): Promise<ChatRoom | null> {
    checkIfNumber(id.toString(), 'Chat room id must be a number');
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
    if (
      chatRoomData.name === '' ||
      !(chatRoomData.visibility in $Enums.RoomVisibility)
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room name or visibility not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.chatService.createChatRoom(chatRoomData);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // update chat room
  @Put()
  async updateChatRoom(
    @Body() chatRoomData: ChatRoom,
  ): Promise<ChatRoom | null> {
    checkIfNumber(chatRoomData.id.toString(), 'Chat room id must be a number');
    if (isEmpty(chatRoomData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      chatRoomData.name === '' ||
      $Enums.RoomVisibility[chatRoomData.visibility] === undefined
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room name or visibility not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chatService.updateChatRoom(chatRoomData.id, chatRoomData);
  }

  // delete chat room
  @Delete()
  async deleteChatRoom(@Body() body: { id: number }): Promise<ChatRoom | null> {
    if (isEmpty(body)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room id not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // checkIfNumber(body.id.toString(), 'Chat room id must be a number');
    return await this.chatService.deleteChatRoom(body.id);
  }

  // get all messages of specific users
  @Get()
  async getUserMessages(
    @Query('sdId') sdId: number,
    @Query('rcId') rcId: number,
  ): Promise<Message[]> {
    checkIfNumber(sdId.toString(), 'Sender id must be a number');
    checkIfNumber(rcId.toString(), 'Receiver id must be a number');
    return await this.chatService.getUserMessages(Number(sdId), Number(rcId));
  }

  // add message
  @Post()
  async addUserMessage(@Body() messageData: Message): Promise<Message> {
    if (isEmpty(messageData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chatService.addUserMessage(messageData);
  }
  // update message
  @Put()
  async updateUserMessage(@Body() messageData: Message): Promise<Message> {
    if (isEmpty(messageData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chatService.updateUserMessage(messageData);
  }
  // delete user message
  @Delete()
  async deleteUserMessage(@Query('id') id: number): Promise<Message | null> {
    checkIfNumber(id.toString(), 'Message id must be a number');
    return await this.chatService.deleteUserMessage(Number(id));
  }
}

// helper functions
const isEmpty = (obj: any): boolean => {
  return Object.getOwnPropertyNames(obj).length === 0;
};

const checkIfNumber = (id: string, str: string) => {
  if (isAlpha(id.toString()) || id === '')
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `${id}: ` + str,
      },
      HttpStatus.BAD_REQUEST,
    );
};
