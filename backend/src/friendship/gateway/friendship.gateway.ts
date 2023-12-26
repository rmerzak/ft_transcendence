import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendshipService } from '../friendship.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@WebSocketGateway({cors:{origin:'http://localhost:8080',credentials:true}})
export class FriendshipGateway {
  constructor(private readonly friendship:FriendshipService) {}
  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    console.log('init');
    socket.use(SocketAuthMiddleware() as any);
  }

  /// here handle the logic of the connection of new client
  handleConnection(socket: Socket) {
    console.log('connected');
    this.friendship.handleConnection(socket);
  }

  /// here handle the logic of the disconnection of a client
  handleDisconnect(socket: Socket) {
    console.log('disconnected');
    this.friendship.handleDisconnect(socket);
  }
  @SubscribeMessage('friendRequest')
  friendRequest(socket: Socket, payload: any) {
    console.log(socket);
    this.server.emit('friendRequest', "hello"); 
  }
}
