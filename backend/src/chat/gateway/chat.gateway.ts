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
    console.log(payload);
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
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(_client: Socket, payload: { roomId: number }) {
    if (!payload.hasOwnProperty('roomId') || _client.rooms.has(payload.roomId.toString())) return;
    _client.join(payload.roomId.toString());
    this.server.to(payload.roomId.toString()).emit('has-joined');
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

    } catch (error) {
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('update-room')
  async handleUpdateRoom(_client: Socket, payload: ChatRoom) {
    try {
      const room = await this.roomService.updateChatRoom(_client['user'].id, payload);
      this.server.to('1_public').emit('updated-room', room);
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
      }
      this.server.to(roomMem.chatRoomId.toString()).emit('banned-user', updatedRoom);
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
        mutedDuration: BigInt(payload.duration),
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
          text: `${_client['user'].username} has muted ${user.username} from the room`,
          senderId: _client['user'].id,
          type: MessageStatus.ANNOUCEMENT,
        } as Message;
        const msg = await this.chatService.addMessage(msgData, _client['user'].id);
        this.server.to(roomMem.chatRoomId.toString()).emit('receive-message', msg);
      }
      this.server.to(roomMem.chatRoomId.toString()).emit('muted-user', updatedRoom);
    } catch (error) {
      _client.emit('error', error.message);
    }
  }
  @SubscribeMessage('kick-user')
  async handleKickUser(_client: Socket, payload: { roomId: number, userId: number }) {
    try {
      const deletedRoomMem = await this.roomService.deletechatRoomMember(payload.userId, payload.roomId);
      if (deletedRoomMem) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        const msgData = {
          chatRoomId: deletedRoomMem.chatRoomId,
          text: `${_client['user'].username} has kicked ${user.username} from the room`,
          senderId: _client['user'].id,
          type: MessageStatus.ANNOUCEMENT,
        } as Message;
        const msg = await this.chatService.addMessage(msgData, _client['user'].id);
        this.server.to(deletedRoomMem.chatRoomId.toString()).emit('receive-message', msg);
      }
      this.server.to(deletedRoomMem.chatRoomId.toString()).emit('kicked-user', deletedRoomMem);
    } catch (error) {
      _client.emit('error', error.message);
    }
  }
  @SubscribeMessage('admin-user')
  async handleAddAdmin(_client: Socket, payload: { roomId: number, userId: number }) {
    // try {
      console.log('add-user ', payload);
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
      console.log('add-user ', tmp);
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
      }
      this.server.to(roomMem.chatRoomId.toString()).emit('added-admin', updatedRoom);
    // } catch (error) {
      // _client.emit('error', error.message);
    // }
  }
  //==============================================================================================================
  handleDisconnect(_client: Socket) {
    console.log('disconnected chat id: ' + _client.id);
  }
}

// @SubscribeMessage('leave-room')
// handleLeaveRoom(_client: Socket, payload: { roomId: number }) {
//   if (!payload.hasOwnProperty('roomId') || !_client.rooms.has(payload.roomId.toString())) return;
//   _client.leave(payload.roomId.toString());
//   this.server.to(payload.roomId.toString()).emit('has-left');
// }

// @SubscribeMessage('add-recent')
// async handleAddRecent(_client: Socket, payload: Recent[]) {
//   payload.map(async (recent, index) => {
//     try {
//       await this.chatService.addRecent(recent);
//     }
//     catch (error) {
//       _client.emit('error', error.message);
//     }
//     if (payload.length === index + 1) {
//       this.server.to(recent.chatRoomId.toString()).emit('receive-recent');
//     }
//   });
// }