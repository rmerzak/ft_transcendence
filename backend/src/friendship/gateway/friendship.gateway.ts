import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendshipService } from '../friendship.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '../Dto';


@WebSocketGateway({ cors: { origin: 'http://localhost:8080', credentials: true } })
export class FriendshipGateway {
  constructor(private readonly friendship: FriendshipService) { }
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
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const Request = await this.friendship.CreateFriendRequest(socket, Number(payload));
      const notification = await this.friendship.CreateNotification(socket, Number(payload), 'friendRequest', 'you have a friend request', Request);
      emitClient.forEach((socket) => {
        socket.emit('friendRequest', notification);
      });
    } catch (error) {
      console.error('Error processing friend request:', error.message);
      socket.emit('RequestError', { error: error.message });
    }
  }

  @SubscribeMessage('friendAcceptRequest')
  async friendAcceptRequest(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const RequestAccepted = this.friendship.AcceptFriendRequest(socket, Number(payload));
      const notification = this.friendship.CreateNotification(socket, Number(payload), 'friendAcceptRequest', 'your friend request has been accepted', await RequestAccepted);
      emitClient.forEach((socket) => {
        socket.emit('friendAcceptRequest', notification);
      });
    } catch (error) {
      console.error('Error processing friend request:', error.message);
      socket.emit('RequestError', { error: error.message });
    }
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
