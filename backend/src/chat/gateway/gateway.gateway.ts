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
import { Message, Recent } from '@prisma/client';

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
    } else {
      _client.disconnect();
    }
    console.log('connected chat id1: ' + _client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(_client: Socket, payload: Message) {
    const msg = await this.chatService.addMessage(payload, _client['user'].id);
    this.server.to(payload.chatRoomId.toString()).emit('receive-message', msg);
    // console.log("rooms: ", _client.rooms);
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

  handleDisconnect(_client: Socket) {
    console.log('disconnected chat id: ' + _client.id);
  }
}
