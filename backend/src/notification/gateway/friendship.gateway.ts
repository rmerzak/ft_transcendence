import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendshipService } from '../friendship.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '../Dto';
/// dont forget to add the userin the socket using the methode socket.data = user

@WebSocketGateway({ cors: { origin: 'http://localhost:8080', credentials: true } })
export class FriendshipGateway {
  constructor(private readonly friendship: FriendshipService) { }
  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    console.log('init');
    socket.use(SocketAuthMiddleware() as any);
    console.log("socket",socket.data)
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
      socket.emit('RequestError', { error: error.message });
    }
  }

  @SubscribeMessage('friendAcceptRequest')
  async friendAcceptRequest(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const RequestAccepted = await this.friendship.AcceptFriendRequest(socket, Number(payload));
      const notification = await this.friendship.CreateNotification(socket, Number(payload), 'friendAcceptRequest', 'your friend request has been accepted',  RequestAccepted);
      emitClient.forEach((socket) => {
        socket.emit('friendAcceptRequest', notification);
      });
    } catch (error) {
      socket.emit('RequestError', { error: error.message });
    }
  }
  @SubscribeMessage('friendRefuseRequest')
  async friendRefuseRequest(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const RequestRefused = await this.friendship.RefuseFriendRequest(socket, Number(payload));
    } catch (error) {
      socket.emit('RequestError', { error: error.message });
    }
  }
  @SubscribeMessage('removeFriend')
  async removeFriend(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const friendshipRemoved = await this.friendship.RemoveFriend(socket, Number(payload));
      emitClient.forEach((socket) => {
        socket.emit('removeFriend', "notification");
      });
    } catch (error) {
      socket.emit('RequestError', { error: error.message });
    }
  }

  @SubscribeMessage('blockFriend')
  async blockFriend(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const friendshipBlock = await this.friendship.BlockFriend(socket, Number(payload));
      emitClient.forEach((socket) => {
        socket.emit('removeFriend', "notification");
      });
    } catch (error) {
      socket.emit('RequestError', { error: error.message });
    }
  }
  @SubscribeMessage('unblockFriend')
  async unblockFriend(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const friendshipUnblock = await this.friendship.UnBlockFriend(socket, Number(payload));
      emitClient.forEach((socket) => {
        socket.emit('removeFriend', "notification");
      });
    }catch(error) {
      socket.emit('RequestError', { error: error.message });
    }
  }
}