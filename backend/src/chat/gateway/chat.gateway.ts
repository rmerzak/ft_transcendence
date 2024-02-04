import { Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { msgRecent } from '../interfaces/interfaces';
import { Socket } from 'socket.io';
import { MsgService } from '../services/msg/msg.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoom, ChatRoomMember, Message, MessageStatus, Recent, RoomStatus, RoomVisibility } from '@prisma/client';
import { RoomService } from '../services/room/room.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:8080', credentials: true },
  namespace: '/chat'
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  // add a map to store users
  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  constructor(private chatService: MsgService, private roomService: RoomService, private prisma: PrismaService) { }

  async handleConnection(_client: Socket) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: _client['payload']['sub'] } });
      if (user) {
        _client['user'] = user;
      } else {
        _client.disconnect();
      }
      if (!_client.rooms.has('1_public')) {
        _client.join('1_public');
      }
      if (!this.roomService.connectedClients.has(user.id)) {
        this.roomService.connectedClients.set(user.id, []);
      }
      this.roomService.connectedClients.get(user.id).push(_client);
      console.log('connected chat id1: ' + _client.id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @SubscribeMessage('send-message')
  async handleMessage(_client: Socket, payload: msgRecent) {
    try {
      if (payload.hasOwnProperty('recentData')) {
        payload.recentData.map(async (recent, index) => {
          try {
            await this.chatService.addRecent(recent);
          }
          catch (error) {
            _client.emit('error', error.message);
          }
          if (payload.recentData.length === index + 1) {
            this.server.to(recent.chatRoomId.toString()).emit('receive-recent');
          }
        });
      }
      if (!payload.hasOwnProperty('msgData')) throw new Error('No message data');
      const msg = await this.chatService.addMessage(payload.msgData, _client['user'].id);
      this.server.to(payload.msgData.chatRoomId.toString()).emit('receive-message', msg);
    } catch (error) {
      console.log("send-message ", error);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(_client: Socket, payload: { roomId: number }) {
    try {
      if (_client.hasOwnProperty('user') && _client['user'].hasOwnProperty('id')) {
        if (!payload.hasOwnProperty('roomId') || _client.rooms.has(payload.roomId.toString())) return;
        const inRoom = this.roomService.getChatRoomMember(_client['user'].id, Number(payload.roomId));
        if (!inRoom) return;
        _client.join(payload.roomId.toString());
        this.server.to(payload.roomId.toString()).emit('has-joined');
      }
    } catch (error) {
      console.log("join-room ", error);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('create-room')
  async handleCreateRoom(_client: Socket, payload: ChatRoom) {

    try {
      const room = await this.roomService.createChatRoom(_client, payload);
      this.roomService.connectedClients.forEach((sockets, userId) => {
        if (userId !== _client['user'].id) {
          sockets.forEach(socket => {
            socket.emit('create-room', room);
          });
        }
        if (userId === _client['user'].id) {
          sockets.forEach(socket => {
            socket.emit('ownedRoom', room);
          });
        }
      });

    } catch (error) {
      console.log("create-room ", error);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('new-member')
  async handleMemberRoom(_client: Socket, payload: ChatRoom) {
    // console.log("payload: ", payload);
    try {
      const room = await this.roomService.addMemberToRoom(_client, payload);

      const msgData = {
        chatRoomId: room.id,
        text: `${_client['user'].username} has joined the room`,
        senderId: _client['user'].id,
        type: MessageStatus.ANNOUCEMENT,
      } as Message;

      const msg = await this.chatService.addMessage(msgData, _client['user'].id);

      this.roomService.connectedClients.forEach((sockets, userId) => {
        if (userId === _client['user'].id) {
          sockets.forEach(socket => {
            socket.emit('ownedRoom', room);
          });
        }
      });
      this.server.to(room.id.toString()).emit('receive-message', msg);
      this.server.to(room.id.toString()).emit('update_chat_room_member', room);

    } catch (error) {
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('update-room')
  async handleUpdateRoom(_client: Socket, payload: ChatRoom) {
    try {
      const room = await this.roomService.updateChatRoom(_client['user'].id, payload);
      this.server.to('1_public').emit('update_chat_room_member', room);
    } catch (error) {
      _client.emit('error', error.message);
    }
  }

  //==============================================================================================================
  // handle room ban user mute user kick user and add admin unadmin
  @SubscribeMessage('ban-user')
  async handleBanUser(_client: Socket, payload: { roomId: number, userId: number }) {
    try {
      const roomMem = await this.roomService.getChatRoomMember(payload.userId, payload.roomId);
      if (!roomMem) throw new Error('User is not a member of the room');

      const tmp: ChatRoomMember = {
        userId: payload.userId,
        chatRoomId: payload.roomId,
        status: RoomStatus.BANNED,
        mutedDuration: roomMem.mutedDuration,
        is_admin: roomMem.is_admin,
        joinedAt: roomMem.joinedAt,
        leftAt: roomMem.leftAt,
        updatedAt: roomMem.updatedAt,
      }
      const updatedRoom = await this.roomService.updatechatRoomMember(_client['user'].id, tmp);
      if (updatedRoom) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        const msgData = {
          chatRoomId: updatedRoom.chatRoomId,
          text: `${_client['user'].username} has banned ${user.username} from the room`,
          senderId: _client['user'].id,
          type: MessageStatus.ANNOUCEMENT,
        } as Message;
        const msg = await this.chatService.addMessage(msgData, _client['user'].id);
        this.server.to(roomMem.chatRoomId.toString()).emit('receive-message', msg);
        this.server.to(roomMem.chatRoomId.toString()).emit('update_chat_room_member', updatedRoom);
        this.server.to(roomMem.chatRoomId.toString()).emit('leaveRoom', { roomId: roomMem.chatRoomId, userId: user.id });
      }
    } catch (error) {
      _client.emit('error', error.message);
    }
  }
  @SubscribeMessage('mute-user')
  async handleMuteUser(_client: Socket, payload: { roomId: number, userId: number, duration: number }) {
    try {
      const roomMem = await this.roomService.getChatRoomMember(payload.userId, payload.roomId);
      if (!roomMem) throw new Error('User is not a member of the room');

      const tmp: ChatRoomMember = {
        userId: payload.userId,
        chatRoomId: payload.roomId,
        status: RoomStatus.MUTED,
        mutedDuration: (payload.duration * 1000).toString(),
        is_admin: roomMem.is_admin,
        joinedAt: roomMem.joinedAt,
        leftAt: roomMem.leftAt,
        updatedAt: roomMem.updatedAt,
      }
      const updatedRoomMem = await this.roomService.updatechatRoomMember(_client['user'].id, tmp);
      if (updatedRoomMem) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        const msgData = {
          chatRoomId: updatedRoomMem.chatRoomId,
          text: `${_client['user'].username} has muted ${user.username} from the room`,
          senderId: _client['user'].id,
          type: MessageStatus.ANNOUCEMENT,
        } as Message;
        const msg = await this.chatService.addMessage(msgData, _client['user'].id);
        this.server.to(roomMem.chatRoomId.toString()).emit('receive-message', msg);
        this.server.to(roomMem.chatRoomId.toString()).emit('muted', { mem: updatedRoomMem, isMuted: true });
        this.server.to(roomMem.chatRoomId.toString()).emit('update_chat_room_member', updatedRoomMem);
      }
    } catch (error) {
      // console.log("mute-user ", error);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('muteTimeOut')
  async handleMuteTimeOut(_client: Socket, payload: ChatRoomMember) {
    try {
      const tmp: ChatRoomMember = {
        userId: payload.userId,
        chatRoomId: payload.chatRoomId,
        status: RoomStatus.NORMAL,
        mutedDuration: null,
        is_admin: payload.is_admin,
        joinedAt: payload.joinedAt,
        leftAt: payload.leftAt,
        updatedAt: payload.updatedAt,
      }
      const chatRoom = await this.prisma.chatRoom.findUnique({ where: { id: payload.chatRoomId } });
      if (!chatRoom) throw new Error('Chat room not found');
      const updatedRoomMem = await this.roomService.updatechatRoomMember(chatRoom.owner, tmp);

      if (!compareDateWithCurrent(addDates(new Date(payload.updatedAt), Number(payload.mutedDuration)))) {
        console.log("here");
        const updatedRoomMem = await this.roomService.updatechatRoomMember(chatRoom.owner, tmp);
        if (updatedRoomMem) {
          console.log("updatedRoomMem: ", updatedRoomMem);
          _client.emit('mute_apdate_sendMsgInput', updatedRoomMem);
        }
      } else {
        console.log("payload: ", payload);
        setTimeout(async () => {
          if (updatedRoomMem) {
            this.server.to(payload.chatRoomId.toString()).emit('mute_apdate_sendMsgInput', updatedRoomMem);
          }
        }, restDuration(addDates(new Date(payload.updatedAt), Number(payload.mutedDuration))));
      }
    } catch (error) {
      console.log("mute-user ", error);
      _client.emit('error', error.message);
    }

  }

  @SubscribeMessage('kick-user')
  async handleKickUser(_client: Socket, payload: { roomId: number, userId: number }) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
      const msgData = {
        chatRoomId: payload.roomId,
        text: `${_client['user'].username} has kicked ${user.username} from the room`,
        senderId: _client['user'].id,
        type: MessageStatus.ANNOUCEMENT,
      } as Message;
      const msg = await this.chatService.addMessage(msgData, _client['user'].id);
      const deletedRoomMem = await this.roomService.deletechatRoomMember(payload.userId, payload.roomId);
      if (deletedRoomMem) {
        this.server.to(deletedRoomMem.chatRoomId.toString()).emit('receive-message', msg);
        this.server.to(deletedRoomMem.chatRoomId.toString()).emit('update_chat_room_member', deletedRoomMem);
        this.server.to(deletedRoomMem.chatRoomId.toString()).emit('leaveRoom', { roomId: deletedRoomMem.chatRoomId, userId: payload.userId });
      }
    } catch (error) {
      console.log("kick-user ", error);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('admin-user')
  async handleAddAdmin(_client: Socket, payload: { roomId: number, userId: number }) {
    try {
      const roomMem = await this.roomService.getChatRoomMember(payload.userId, payload.roomId);
      if (!roomMem) throw new Error('User is not a member of the room');
      if (roomMem.is_admin) throw new Error('User is already admin');
      const tmp: ChatRoomMember = {
        joinedAt: roomMem.joinedAt,
        status: roomMem.status,
        mutedDuration: roomMem.mutedDuration,
        leftAt: roomMem.leftAt,
        updatedAt: roomMem.updatedAt,
        userId: payload.userId,
        chatRoomId: payload.roomId,
        is_admin: true,
      }
      const updatedRoom = await this.roomService.updatechatRoomMember(_client['user'].id, tmp);
      if (updatedRoom) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        const msgData = {
          chatRoomId: updatedRoom.chatRoomId,
          text: `${_client['user'].username} has added ${user.username} as admin`,
          senderId: _client['user'].id,
          type: MessageStatus.ANNOUCEMENT,
        } as Message;
        const msg = await this.chatService.addMessage(msgData, _client['user'].id);
        this.server.to(roomMem.chatRoomId.toString()).emit('receive-message', msg);
        this.server.to(roomMem.chatRoomId.toString()).emit('update_chat_room_member', updatedRoom);
      }
    } catch (error) {
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('unadmin-user')
  async handleRemoveAdmin(_client: Socket, payload: { roomId: number, userId: number }) {
    try {
      const roomMem = await this.roomService.getChatRoomMember(payload.userId, payload.roomId);
      if (!roomMem) throw new Error('User is not a member of the room');
      if (!roomMem.is_admin) throw new Error('User is not admin');
      const tmp: ChatRoomMember = {
        joinedAt: roomMem.joinedAt,
        status: roomMem.status,
        mutedDuration: roomMem.mutedDuration,
        leftAt: roomMem.leftAt,
        updatedAt: roomMem.updatedAt,
        userId: payload.userId,
        chatRoomId: payload.roomId,
        is_admin: false,
      }
      const updatedRoom = await this.roomService.updatechatRoomMember(_client['user'].id, tmp);
      if (updatedRoom) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        const msgData = {
          chatRoomId: updatedRoom.chatRoomId,
          text: `${_client['user'].username} has removed ${user.username} from admin`,
          senderId: _client['user'].id,
          type: MessageStatus.ANNOUCEMENT,
        } as Message;
        const msg = await this.chatService.addMessage(msgData, _client['user'].id);
        this.server.to(roomMem.chatRoomId.toString()).emit('receive-message', msg);
        this.server.to(roomMem.chatRoomId.toString()).emit('update_chat_room_member', updatedRoom);
      }
    } catch (error) {
      _client.emit('error', error.message);
    }
  }
  //==============================================================================================================
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoomSocket(_client: Socket, payload: { roomId: number }) {
    try {
      _client.leave(payload.roomId.toString());
    } catch (error) {
      console.log("leave-room ", error);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(_client: Socket, payload: ChatRoom) {
    try {
      const msgData = {
        chatRoomId: payload.id,
        text: `${_client['user'].username} has left the chat`,
        senderId: _client['user'].id,
        type: MessageStatus.ANNOUCEMENT,
      } as Message;
      const msg = await this.chatService.addMessage(msgData, _client['user'].id);
      const room = await this.roomService.leaveMemberFromRoom(_client, payload);
      console.log("room = ", room);
      this.roomService.connectedClients.forEach((sockets, userId) => {
        if (userId === _client['user'].id) {
          sockets.forEach(socket => {
            if (room !== null) {
              socket.emit('ownedRoom', room);
              socket.emit('create-room', room);
            }
            else {
              socket.emit('deletedRoom', payload.name);
            }
          });
        } else {
          if (room === null) {
            sockets.forEach(socket => {
              socket.emit('deletedRoom', payload.name);
            });
          }
        }
      });
      if (room !== null) {
        this.server.to(room.id.toString()).emit('receive-message', msg);
      }
      this.server.to(payload.id.toString()).emit('leaveRoom', { roomId: payload.id, userId: _client['user'].id });
    } catch (error) {
      _client.emit('error', error.message);
    }
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected chat id: ' + _client.id); // must fix this
  }
}

function addDates(date: Date, duration: number): number {
  return date.getTime() + duration;
}

function compareDateWithCurrent(date1: number): boolean {
  const date2 = new Date();
  return date1 > date2.getTime();
}

function restDuration(date1: number): number {
  const date2 = new Date();
  return date1 - date2.getTime();
}
