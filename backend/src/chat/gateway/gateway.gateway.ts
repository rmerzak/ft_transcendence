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
import { Message } from '@prisma/client';

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

  constructor(private chatService: MsgService, private prisma: PrismaService) { }

  async handleConnection(_client: Socket) {
    const user = await this.prisma.user.findUnique({ where: { id: _client['payload']['sub'] } });
    if (user) {
      _client['user'] = user;
      // this.addSocket(-1, _client);
    } else {
      _client.disconnect();
    }
    console.log('connected chat id1: ' + _client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(_client: Socket, payload: Message) {
    const msg = await this.chatService.addMessage(payload, _client['user'].id);
    console.log("mesage: ", msg );
    const msgData = {
      msg: msg,
      SocketId: _client.id
    }
    this.server.to(payload.chatRoomId.toString()).emit('receive-message', msg);
    console.log("rooms: ", _client.rooms);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(_client: Socket, payload: { roomId: number }) {
    console.log("roomId: ", payload.roomId);
    if (_client.rooms.has(payload.roomId.toString())) return;
    _client.join(payload.roomId.toString());
    console.log("rooms: ", _client.rooms);
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected chat id: ' + _client.id);
  }

}
