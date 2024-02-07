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
import { MsgService } from './services/msg/msg.service';
import { RoomService } from './services/room/room.service';
import { $Enums, ChatRoom, ChatRoomMember, Message, Recent, User } from '@prisma/client';
import { isAlpha } from 'class-validator';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { ChatRoomUsers } from './interfaces/interfaces';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: MsgService, private readonly roomService: RoomService) { }

  // get chat rooms for user
  @Get('rooms')
  async getChatRooms(@Req() req: Request): Promise<ChatRoom[]> {
    const user = req.user as User;
    return await this.roomService.getChatRoomsForUser(user.id);
  }
  // get chat rooms that user not in
  @Get('rooms/not')
  async getChatRoomsNotJoined(@Req() req: Request): Promise<ChatRoom[]> {
    const user = req.user as User;
    return await this.roomService.getChatRoomsNotForUser(user.id);
  }
  // get chat room by name
  @Get('room')
  async getChatRoomByName(@Query('user1') user1: string, @Query('user2') user2: string,): Promise<ChatRoom | null> {
    if (!user1 || user1.length === 0 || !user2 || user2.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Chat room name not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const name = user1 + '_' + user2;
      const room = await this.roomService.getChatRoomByName(name);
      if (room) {
        return room;
      }else {
        const name = user2 + '_' + user1;
        const room = await this.roomService.getChatRoomByName(name);
        if (room) {
          return room;
        }else {
          return null;
        }
      }
    }catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // get chat room by id
  @Get('room/:id')
  async getChatRoomById(@Param('id') id: number): Promise<ChatRoom | null> {
    checkIfNumber(id.toString(), 'Chat room id must be a number');
    try {
      return await this.roomService.getChatRoomById(Number(id));
    }catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // create chat room
  @Post('room')
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
      // return await this.roomService.createChatRoom(chatRoomData);
      return null;
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
      let existingChatRoom = await this.roomService.getChatRoomByName(user.id + '_' + targetUserId);
      if (existingChatRoom) {
        return existingChatRoom;
      } else if (existingChatRoom === null) {
        existingChatRoom = await this.roomService.getChatRoomByName(targetUserId + '_' + user.id);
        if (existingChatRoom) {
          return existingChatRoom;
        }
      }

      const newChatRoom = await this.roomService.makeConversation(user.id, chatRoomData);
      if (!newChatRoom) {
        throw new Error('Error creating chat room');
      }
      await this.roomService.addUserToChatRoom({
        userId: user.id,
        chatRoomId: newChatRoom.id,
        joinedAt: undefined,
        is_admin: false,
        leftAt: undefined,
        status: 'NORMAL',
        mutedDuration: undefined,
        updatedAt: undefined,
        mutedDate: undefined,
      });

      await this.roomService.addUserToChatRoom({
        userId: targetUserId,
        chatRoomId: newChatRoom.id,
        joinedAt: undefined,
        is_admin: false,
        leftAt: undefined,
        status: 'NORMAL',
        mutedDuration: undefined,
        updatedAt: undefined,
        mutedDate: undefined,
      });

      return newChatRoom;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error creating conversation room',
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
    return await this.roomService.updateChatRoom(chatRoomData.id, chatRoomData);
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
    return await this.roomService.deleteChatRoom(body.id);
  }
  // end chat room

  // start user chat room
  // get chat room for user
  @Get()
  async getChatRoomsForUser(@Query('id') id: number): Promise<ChatRoom[]> {
    checkIfNumber(id.toString(), 'User id must be a number');
    return await this.roomService.getChatRoomsForUser(Number(id));
  }
  @Get('user')
  async getChatRoomMembers(@Query('chatRoomId') chatRoomId: number): Promise<ChatRoomUsers[] | null> {
    checkIfNumber(chatRoomId.toString(), 'Chat room id must be a number');
    return await this.roomService.getChatRoomMembers(Number(chatRoomId));
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
      return await this.roomService.addUserToChatRoom(chatRoomMemberData);
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
    try {
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
        case 'Your are banned from this room':
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Your are banned from this room',
            },
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error getting message',
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }

  // add message
  @Post('msg')
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
  // delete user message
  @Delete()
  async deleteMessage(@Query('id') id: number): Promise<Message | null> {
    checkIfNumber(id.toString(), 'Message id must be a number');
    return await this.chatService.deleteMessage(Number(id));
  }
  // end user message

  // start recent
  // get recent for user
  @Get('recent')
  async getRecentForUser(@Req() req: Request): Promise<Recent[]> {
    const user = req.user as User;
    return await this.chatService.getRecent(user.id);
  }

  // add recent
  @Post('recent')
  async addRecent(@Body() recentData: Recent, @Req() req: Request): Promise<Recent> {
    if (isEmpty(recentData)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Recent data not provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = req.user as User;
    if (recentData.userId !== user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Recent user id not match',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.chatService.addRecent(recentData);
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
        default:
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error adding recent',
            },
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }
  // delete recent for user
  @Delete('recent')
  async deleteRecent(@Query('roomId') roomId: number, @Req() req: Request): Promise<Recent | null> {
    checkIfNumber(roomId.toString(), 'Chat room id must be a number');
    const user = req.user as User;
    return await this.chatService.deleteRecent(user.id, Number(roomId));
  }

  @Get('room/:id')
  async getChatRoomMembersById(@Param('id') id: string): Promise<ChatRoomUsers[] | null> {
    checkIfNumber(id.toString(), 'Chat room id must be a number');
    return await this.roomService.getChatRoomMembers(Number(id));
  }
  @Get('room/user/:id')
  async getChatRoomMemberByRoomId(@Req() req: Request, @Param('id') id: string): Promise<ChatRoomMember | null> {
    try {
      checkIfNumber(id.toString(), 'User id must be a number');
      const user = req.user as User;
      return await this.roomService.getChatRoomMemberByRoomId(user.id, Number(id));
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