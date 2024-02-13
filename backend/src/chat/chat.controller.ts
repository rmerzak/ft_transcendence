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
import { $Enums, ChatRoom, ChatRoomMember, Message, Recent, RoomReqJoin, User } from '@prisma/client';
import { isAlpha } from 'class-validator';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { ChatRoomUsers } from './interfaces/interfaces';
import { get } from 'http';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: MsgService, private readonly roomService: RoomService) { }

  // get chat rooms for user
  @Get('rooms')
  async getChatRooms(@Req() req: Request): Promise<ChatRoom[] | null> {
    try {
      const user = req.user as User;
      const rooms = await this.roomService.getChatRoomsForUser(user.id);
      if (!rooms)
        return [];
      return rooms;
    } catch (error) {
      return null;
    }
  }
  // get chat rooms that user not in
  @Get('rooms/not')
  async getChatRoomsNotJoined(@Req() req: Request): Promise<ChatRoom[] | null> {
    try {
      const user = req.user as User;
      const tojoin = await this.roomService.getChatRoomsNotForUser(user.id);
      if (!tojoin)
        return [];
      return tojoin;
    } catch (error) {
      return null;
    }
  }
  // get chat room by name
  @Get('room')
  async getChatRoomByName(@Query('user1') user1: string, @Query('user2') user2: string,): Promise<ChatRoom | null> {
    if (!user1 || user1.length === 0 || !user2 || user2.length === 0) {
      return null;
    }
    try {
      const name = user1 + '_' + user2;
      const room = await this.roomService.getChatRoomByName(name);
      if (room) {
        return room;
      } else {
        const name = user2 + '_' + user1;
        const room = await this.roomService.getChatRoomByName(name);
        if (room) {
          return room;
        } else {
          return null;
        }
      }
    } catch (error) {
      return null;
    }
  }
  // get chat room by id
  @Get('room/:id')
  async getChatRoomById(@Param('id') id: number): Promise<ChatRoom | null> {

    try {
      if (isNaN(id) || id <= 0) {
        return null;
      }
      return await this.roomService.getChatRoomById(Number(id));
    } catch (error) {
      return null;
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
    if (isNaN(chatRoomId) || chatRoomId <= 0) {
      return null;
    }
    try {
      return await this.roomService.getChatRoomMembers(Number(chatRoomId));
    } catch (error) {
      return null;
    }
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
  async getChatRoomMessages(@Param('id') id: number, @Req() req: Request, @Query('from') from: string): Promise<Message[] | string> {
    const user = req.user as User;
    const Id = Number(id);
    if (isNaN(Id) || !Number.isInteger(Id) || Id <= 0) {
      return 'Error getting messages';
    }
    try {
      return await this.chatService.getChatRoomMessages(Id, user.id, from);
    } catch (error) {
      return 'Error getting messages';
    }
  }
  // end user message

  // start recent
  // get recent for user
  @Get('recent')
  async getRecentForUser(@Req() req: Request): Promise<Recent[] | null> {
    try {
      const user = req.user as User;
      return await this.chatService.getRecent(user.id);
    } catch (error) {
      return null;
    }
  }

  // add recent
  @Post('recent')
  async addRecent(@Body() recentData: Recent, @Req() req: Request): Promise<Recent | null> {
    if (isEmpty(recentData)) {
      return null;
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
    try {
      if (isNaN(roomId) || roomId <= 0) {
        return null;
      }
      const user = req.user as User;
      return await this.chatService.deleteRecent(user.id, Number(roomId));
    } catch (error) {
      return null;
    }
  }

  @Get('room/user/:id')
  async getChatRoomMemberByRoomId(@Req() req: Request, @Param('id') id: string): Promise<ChatRoomMember | null> {
    try {
      if (isNaN(Number(id)) || Number(id) <= 0) {
        return null;
      }
      const user = req.user as User;
      return await this.roomService.getChatRoomMemberByRoomId(user.id, Number(id));
    } catch (error) {
      return null;
    }
  }

  @Get('/room/invited/:id')
  async getChatRoomInvitedUsers(@Req() req: Request, @Param('id') id: string): Promise<RoomReqJoin[] | null> {
    try {
      checkIfNumber(id.toString(), 'Chat room id must be a number');
      const user = req.user as User;
      return await this.roomService.getChatRoomInvitedUsers(user.id, Number(id));
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
  @Get('/room/search/:name')
  async getChatRoomsByName(@Req() req: Request, @Param('name') name: string): Promise<ChatRoom[] | null> {
    try {
      return this.roomService.getChatRoomsByName(name);
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
  @Get('room/membership/:id')
  async getChatRoomMembershipStatus(@Req() req: Request,@Param('id') id:string): Promise<ChatRoomMember> {
    try {
      const user = req.user as User;
      checkIfNumber(id, 'Chat room id must be a number');
      return await this.roomService.getChatRoomMembershipStatus(user.id, Number(id));
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