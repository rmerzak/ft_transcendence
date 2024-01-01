import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { $Enums, ChatRoom, ChatRoomMember, Message } from '@prisma/client';
import { isAlpha } from 'class-validator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // create chat room
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
  // end chat room

  // start user chat room
  // get chat room for user
  @Get()
  async getChatRoomsForUser(@Query('id') id: number): Promise<ChatRoom[]> {
    checkIfNumber(id.toString(), 'User id must be a number');
    return await this.chatService.getChatRoomsForUser(Number(id));
  }
  // create chat room
  // @Post()
  async createChatRoomMember(@Body() chatRoomMemberData: ChatRoomMember) {
    if (isEmpty(chatRoomMemberData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room member data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    checkIfNumber(chatRoomMemberData.userId.toString(), 'User id must be a number');
    checkIfNumber(chatRoomMemberData.chatRoomId.toString(), 'Chat room id must be a number');
    try {
      return await this.chatService.addUserToChatRoom(chatRoomMemberData);
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

  // end user chat room
  // get all messages of specific users
  // @Get()
  // async getMessages(
  //   @Query('sdId') sdId: number,
  // ): Promise<Message[]> {
  //   checkIfNumber(sdId.toString(), 'Sender id must be a number');
  //   return await this.chatService.getUserMessages(Number(sdId));
  // }

  // add message
  async addMessage(@Body() messageData: Message): Promise<Message> {
    if (isEmpty(messageData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chatService.addMessage(messageData);
  }
  // update message
  @Put()
  async updateMessage(@Body() messageData: Message): Promise<Message> {
    if (isEmpty(messageData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.chatService.updateMessage(messageData);
  }
  // delete user message
  @Delete()
  async deleteMessage(@Query('id') id: number): Promise<Message | null> {
    checkIfNumber(id.toString(), 'Message id must be a number');
    return await this.chatService.deleteMessage(Number(id));
  }

  // handle http post request
  @Post()
  async handlePostRequest(@Body() data: any): Promise<any> {
    if (isEmpty(data)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.hasOwnProperty('chatRoomData')) {
      return await this.createChatRoom(data.chatRoomData);
    } else if (data.hasOwnProperty('chatRoomMemberData')) {
      return await this.createChatRoomMember(data.chatRoomMemberData);
    }else if (data.hasOwnProperty('messageData')) {
      return await this.addMessage(data.messageData);
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  //end handle http post request
}

// helper functions
const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) return true;
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
