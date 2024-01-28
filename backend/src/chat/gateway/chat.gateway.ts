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
import { ChatRoom, Message, MessageStatus, Recent, RoomVisibility } from '@prisma/client';
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
    console.log("payload: ", payload);
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

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(_client: Socket, payload: ChatRoom) {
    console.log("payload = ", payload);
    try {
      const room = await this.roomService.leaveMemberFromRoom(_client, payload);
      this.roomService.connectedClients.forEach((sockets, userId) => {
        if (userId === _client['user'].id) {
          sockets.forEach(socket => {
            socket.emit('ownedRoom', room);
            socket.emit('create-room', room);
          });
        }
      });
      //this.server.to(room.id.toString()).emit('updated-room', room);
    } catch (error) {
      _client.emit('error', error.message);
    }
  }

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