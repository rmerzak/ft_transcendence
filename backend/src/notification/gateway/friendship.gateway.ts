import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendshipService } from '../friendship.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/chat/services/room/room.service';
/// dont forget to add the userin the socket using the methode socket.data = user

@WebSocketGateway({ cors: { origin: 'http://localhost:8080', credentials: true, namespace: '/profile' } })
export class FriendshipGateway {
  constructor(private readonly friendship: FriendshipService, private roomService: RoomService,
    private readonly prisma: PrismaService) { }
  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    console.log('init');
    socket.use(SocketAuthMiddleware() as any);
    console.log("socket", socket.data)
  }

  handleConnection(socket: Socket) {
    this.friendship.handleConnection(socket);
    socket.join('1_friendship');
  }

  handleDisconnect(socket: Socket) {
    // console.log('disconnected');
    this.friendship.handleDisconnect(socket);
  }
  @SubscribeMessage('friendRequest')
  async friendRequest(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const request = await this.friendship.CreateFriendRequest(socket, Number(payload));
      const notification = await this.friendship.CreateNotification(socket, Number(payload), 'friendRequest', 'You have a friend request', request, 'FRIENDSHIP');
      emitClient.forEach((socket) => {
        socket.emit('friendRequest', { notification: notification, friendship: request, status: true, error: null });
      });
      socket.emit('friendRequest', { notification: null, friendship: null, status: true, error: null });
    } catch (error) {
      socket.emit('RequestError', { notification: null, friendship: null, status: false, error: error.message });
    }
  }

  @SubscribeMessage('friendAcceptRequest')
  async friendAcceptRequest(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const RequestAccepted = await this.friendship.AcceptFriendRequest(socket, Number(payload));
      const notification = await this.friendship.CreateNotification(socket, Number(payload), 'friendAcceptRequest', 'your friend request has been accepted', RequestAccepted, 'FRIENDSHIP');
      emitClient.forEach((socket: Socket) => {
        socket.emit('friendAcceptRequest', { notification: notification, friendship: RequestAccepted, status: true, error: null });
      });
      socket.emit('AcceptRequest', { notification: null, friendship: null, status: true, error: null });
      this.server.to('1_friendship').emit('AcceptRequest', { notification: notification, friendship: RequestAccepted, status: true, error: null });
    } catch (error) {
      socket.emit('RequestError', { notification: null, friendship: null, status: false, error: error.message });
    }
  }
  // @SubscribeMessage('friendRefuseRequest')
  // async friendRefuseRequest(socket: Socket, payload: number) {
  //   try {
  //     const emitClient = this.friendship.getSocketsByUser(Number(payload));
  //     const RequestRefused = await this.friendship.RefuseFriendRequest(socket, Number(payload));
  //   } catch (error) {
  //     socket.emit('RequestError', {notification: null, friendship: null, status: false, error: error.message});
  //   }
  // }
  @SubscribeMessage('removeFriend')
  async removeFriend(socket: Socket, payload: number) {
    try {
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const friendshipRemoved = await this.friendship.RemoveFriend(socket, Number(payload));
      emitClient.forEach((socket) => {
        socket.emit('removeFriend', { notification: null, friendship: null, status: true, error: null });
      });
      socket.emit('removeFriend', { notification: null, friendship: null, status: true, error: null });
      this.server.to('1_friendship').emit('removeFriend', { notification: null, friendship: friendshipRemoved, status: true, error: null });
    } catch (error) {
      socket.emit('RequestError', { notification: null, friendship: null, status: false, error: error.message });
    }
  }

  @SubscribeMessage('blockFriend')
  async blockFriend(socket: Socket, payload: number) {
    try {
      // console.log("blockFrienddd", socket['payload']['sub'])
      const blockByMe = socket['payload']['sub'];
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const friendshipBlock = await this.friendship.BlockFriend(socket, Number(payload));
      if (friendshipBlock) {
        // console.log("blockFriend", payload)

        emitClient.forEach((socket) => {
          socket.emit('blockFriend', { notification: friendshipBlock, friendship: null, status: true, error: null });
          socket.emit('blockFriendChat', { isblock: true, blockByMe: blockByMe });
          socket.emit('blockUserOnline', { isblock: true, blockByMe: blockByMe });
        });
        // console.log("blockFriendd", blockByMe)
        socket.emit('blockFriend', { notification: friendshipBlock, friendship: null, status: true, error: null });
        socket.emit('blockFriendChat', { isblock: true, blockByMe: blockByMe });
        socket.emit('blockUserOnline', { isblock: true, blockByMe: blockByMe });
      }
    } catch (error) {
      socket.emit('RequestError', { notification: null, friendship: null, status: false, error: error.message });
    }
  }
  @SubscribeMessage('unblockFriend')
  async unblockFriend(socket: Socket, payload: number) {
    try {
      // console.log("unblockFriend", payload)
      const emitClient = this.friendship.getSocketsByUser(Number(payload));
      const friendshipUnblock = await this.friendship.UnBlockFriend(socket, Number(payload));
      emitClient.forEach((socket) => {
        socket.emit('unblockFriend', { notification: friendshipUnblock, friendship: null, status: true, error: null });
        socket.emit('unblockFriendChat', { isblock: false, blockByMe: 0 });
        socket.emit('unblockUserOnline', { isblock: false, blockByMe: 0 });
      });
      socket.emit('unblockFriend', { notification: friendshipUnblock, friendship: null, status: true, error: null });
      socket.emit('unblockFriendChat', { isblock: false, blockByMe: 0 });
      socket.emit('unblockUserOnline', { isblock: false, blockByMe: 0 });
    } catch (error) {
      socket.emit('RequestError', { notification: null, friendship: null, status: false, error: error.message });
    }
  }

  @SubscribeMessage('challengeGame')
  async challengeGame(socket: Socket, payload: { playerId: number, gameId: string }) {
    try {
      const emitClient = this.friendship.getSocketsByUser(payload.playerId);
      // you must creaet a room or a game logic here
      // const rooom = await this.friendship.CreateRoom(socket, Number(payload));
      const gameNotification = await this.friendship.CreateNotification(socket, payload.playerId, 'challengeGame', payload.gameId, null, 'GAME');
      emitClient.forEach((socket) => {
        socket.emit('challengeGame', { notification: gameNotification, friendship: null, status: true, error: null });
      });
    } catch (error) {
      socket.emit('RequestError', { notification: null, friendship: null, status: false, error: error.message });
    }
  }

  @SubscribeMessage('acceptChallenge')
  async accept(socket: Socket, payload: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { content: payload }
    });
    
    if (notification) {
      await this.prisma.notification.update({ where: { id: notification.id }, data: { vue: true } });
    }

    // socket.emit('updateNotification');
  }

  @SubscribeMessage('refuseChallenge')
  async refuse(socket: Socket, payload: string) {
    const game = this.server.of('/game').to(payload);
    game.emit('refuseChallenge');

    const notification = await this.prisma.notification.findFirst({
      where: { content: payload }
    });
    
    if (notification) {
      await this.prisma.notification.update({ where: { id: notification.id }, data: { vue: true } });
    }
    // socket.emit('updateNotification');
  }
}
