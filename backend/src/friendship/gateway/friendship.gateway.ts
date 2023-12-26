import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendshipService } from '../friendship.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '../Dto';


@WebSocketGateway({cors:{origin:'http://localhost:8080',credentials:true}})
export class FriendshipGateway {
  constructor(private readonly friendship:FriendshipService) {}
  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    console.log('init');
    socket.use(SocketAuthMiddleware() as any);
  }

  handleConnection(socket: Socket) {
    this.friendship.handleConnection(socket);
  }

  handleDisconnect(socket: Socket) {
    console.log('disconnected');
    this.friendship.handleDisconnect(socket);
  }
  @SubscribeMessage('friendRequest')
  async friendRequest(socket: Socket, payload: number) {
    const emitClient = this.friendship.getSocketsByUser(Number(payload));
    console.log("emitClient = ",emitClient)
    const Request = this.friendship.CreateFriendRequest(socket, Number(payload));
    const notification = await this.friendship.CreateNotification(socket, Number(payload), 'friendRequest', 'you have a friend request', await Request);
    emitClient.forEach((socket) => {
      socket.emit('friendRequest', notification);
    });

  }

  @SubscribeMessage('friendAcceptRequest')
  friendAcceptRequest(socket: Socket, payload: number) {
    const emitClient = this.friendship.getSocketsByUser(Number(payload));
    const RequestAccepted = this.friendship.AcceptFriendRequest(socket, Number(payload));
    this.server.emit('friendAcceptRequest', "hello"); 
  }
  @SubscribeMessage('removeFriend')
  removeFriend(socket: Socket, payload: number) {
    const emitClient = this.friendship.getSocketsByUser(Number(payload));
    
    this.server.emit('removeFriend', "hello"); 
  }
  @SubscribeMessage('friendRefuseRequest')
  friendRefuseRequest(socket: Socket, payload: number) {
    const emitClient = this.friendship.getSocketsByUser(Number(payload));

    this.server.emit('friendRefuseRequest', "hello"); 
  }
  @SubscribeMessage('blockFriend')
  blockFriend(socket: Socket, payload: number) {
    const emitClient = this.friendship.getSocketsByUser(Number(payload));

    this.server.emit('blockFriend', "hello"); 
  }
  @SubscribeMessage('unblockFriend')
  unblockFriend(socket: Socket, payload: number) {
    const emitClient = this.friendship.getSocketsByUser(Number(payload));

    this.server.emit('unblockFriend', "hello"); 
  }
}
