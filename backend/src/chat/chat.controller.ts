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
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { $Enums, ChatRoom, ChatRoomMember, Message, User } from '@prisma/client';
import { isAlpha } from 'class-validator';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { ChatRoomUsers } from './interfaces/interfaces';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  // get chat rooms for user
  @Get('rooms')
  async getChatRooms(@Req() req: Request): Promise<ChatRoom[]> {
    const user = req.user as User;
    return await this.chatService.getChatRoomsForUser(user.id);
  }
  // get chat rooms that user not in
  @Get('rooms/not')
  async getChatRoomsNotJoined(@Req() req: Request): Promise<ChatRoom[]> {
    const user = req.user as User;
    return await this.chatService.getChatRoomsNotForUser(user.id);
  }

  // create chat room
  @Post('room/:id')
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
  // create user conversation room
  
  @Post('user/:id')
  async createConversationRoom(@Body() chatRoomData: ChatRoom, @Req() req: Request): Promise<ChatRoom> {
    const user = req.user as User;
    // console.log(user);
    const targetUserId = Number(req.params.id);
    if (isNaN(targetUserId) || !Number.isInteger(targetUserId) || targetUserId <= 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid target user ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!chatRoomData.name || typeof chatRoomData.name !== 'string') {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid chat room data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let existingChatRoom = await this.chatService.getChatRoomByName(user.id + '_' + targetUserId);
      if (existingChatRoom) {
        return existingChatRoom;
      }else if (existingChatRoom === null) {
        existingChatRoom = await this.chatService.getChatRoomByName(targetUserId + '_' + user.id);
        if (existingChatRoom) {
          return existingChatRoom;
        }
      }

      const newChatRoom = await this.chatService.makeConversation(chatRoomData);
      if (!newChatRoom) {
        throw new Error('Error creating chat room');
      }
      await this.chatService.addUserToChatRoom({
        userId: user.id,
        chatRoomId: newChatRoom.id,
        joinedAt: undefined,
        is_admin: false,
        leftAt: undefined,
      });

      await this.chatService.addUserToChatRoom({
        userId: targetUserId,
        chatRoomId: newChatRoom.id,
        joinedAt: undefined,
        is_admin: false,
        leftAt: undefined,
      });

      return newChatRoom;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error creating chat room',
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
  @Get('user')
  async getChatRoomMembers(@Query('chatRoomId') chatRoomId: number): Promise<ChatRoomUsers[] | null> {
    checkIfNumber(chatRoomId.toString(), 'Chat room id must be a number');
    return await this.chatService.getChatRoomMembers(Number(chatRoomId));
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

  // get all messages of specific private user conversation
  @Get('user/:id')
  async getChatRoomMessages(@Param('id') id: number, @Req() req: Request): Promise<Message[]> {
    checkIfNumber(id.toString(), 'Chat room id must be a number');
    const user = req.user as User;
    const Id = Number(id);
    if (isNaN(Id) || !Number.isInteger(Id) || Id <= 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid chat room ID',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try
    {
      return await this.chatService.getChatRoomMessages(Id, user.id);
    } catch (error) {
      switch (error.message) {
        case 'User not found':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'User not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        case 'Chat room not found':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Chat room not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        case 'User not in chat room':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'User not in chat room',
            },
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error updating message',
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }

  // add message
  @Post('user')
  async addMessage(@Body() messageData: Message, @Req() req: Request): Promise<Message> {
    if (isEmpty(messageData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = req.user as User;
    if (messageData.senderId !== user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message sender id not match',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.chatService.addMessage(messageData, user.id);
    }catch (error) {
      switch (error.message) {
        case 'User not found':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'User not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        case 'Chat room not found':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Chat room not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        case 'User not in chat room':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'User not in chat room',
            },
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error updating message',
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }
  // update message
  @Put()
  async updateMessage(@Body() messageData: Message, @Req() req: Request): Promise<Message> {
    if (isEmpty(messageData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = req.user as User;
    if (messageData.senderId !== user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Message sender id not match',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.chatService.updateMessage(messageData, user.id);
    }catch (error) {
      switch (error.message) {
        case 'User not found':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'User not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        case 'Chat room not found':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Chat room not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        case 'User not in chat room':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'User not in chat room',
            },
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error updating message',
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }
  // delete user message
  @Delete()
  async deleteMessage(@Query('id') id: number): Promise<Message | null> {
    checkIfNumber(id.toString(), 'Message id must be a number');
    return await this.chatService.deleteMessage(Number(id));
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
// end helper functions