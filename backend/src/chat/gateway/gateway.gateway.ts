import { Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MsgService } from '../services/msg/msg.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoom, Message, Recent, RoomVisibility } from '@prisma/client';
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

  constructor(private chatService: MsgService, private roomService: RoomService,private prisma: PrismaService) { }

  async handleConnection(_client: Socket) {
    const user = await this.prisma.user.findUnique({ where: { id: _client['payload']['sub'] } });
    if (user) {
      _client['user'] = user;
    } else {
      _client.disconnect();
    }
    if (!this.roomService.connectedClients.has(user.id)) {
      this.roomService.connectedClients.set(user.id, []);
    }
    this.roomService.connectedClients.get(user.id).push(_client);
    console.log('connected chat id1: ' + _client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(_client: Socket, payload: Message) {
    try {
      const msg = await this.chatService.addMessage(payload, _client['user'].id);
      this.server.to(payload.chatRoomId.toString()).emit('receive-message', msg);
    } catch (error) {
      console.log("error ==== ",error.message);
      _client.emit('error', error.message);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(_client: Socket, payload: { roomId: number }) {
    if (_client.rooms.has(payload.roomId.toString())) return;
    _client.join(payload.roomId.toString());
    this.server.to(payload.roomId.toString()).emit('has-joined');
    // console.log("rooms: ", _client.rooms);
  }

  @SubscribeMessage('add-recent')
  async handleAddRecent(_client: Socket, payload: Recent[]) {
    payload.map(async (recent, index) => {
      await this.chatService.addRecent(recent);
      if (payload.length === index + 1) {
        this.server.to(recent.chatRoomId.toString()).emit('receive-recent', recent);
      }
    });
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
    //_client.emit('receive-room', room);
  }
  @SubscribeMessage('new-member')
  async handleMemberRoom(_client: Socket, payload: ChatRoom) {
    console.log("payload: ", payload);
    try {
      const room = await this.roomService.addMemberToRoom(_client, payload);
      this.roomService.connectedClients.forEach((sockets, userId) => {
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

  handleDisconnect(_client: Socket) {
    console.log('disconnected chat id: ' + _client.id);
  }
}
