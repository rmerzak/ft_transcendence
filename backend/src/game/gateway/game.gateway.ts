import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { GameService } from '../services/game.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { Player } from '../models/player.model';
// import { UserStatus } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  prisma: any;
  constructor(private readonly game: GameService) {}

  private roomId: string = '';

  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  async handleConnection(socket: Socket) {
    console.log("i'm connected");

    // const user = await this.prisma.user.findUnique({
    //   where: { id: socket['payload']['sub'] },
    // });

    const user = await this.game.findUserById(socket['payload']['sub']);
    // console.log('user = ', user);
    socket['user'] = user;
    socket.emit('user', user);
    // const userId = socket['payload']['sub'];
    // const updatedUser = await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { status: UserStatus.INGAME },
    // });
    // if (user) {
    // console.log(socket['user']);
    // } else {
    //   socket.disconnect();
    // }
    console.log('connected chat id1: ' + socket.id);
    // console.log(socket['payload']['email']);
    // this.getUser(socket.request);
    // socket["user"] = await this.getUser(socket.request);
    // console.log(this.getUser(socket));
    // this.getUser(socket);
  }

  async handleDisconnect(client: Socket) {
    console.log('Player disconnected');
    console.log('Room ID:', this.roomId);

    // Leave the room for the disconnected player
    this.game.leaveRoom(this.roomId, client.id, client);
    // const userId = client['payload']['sub'];
    // let updatedUser = await this.prisma.user.update({
    //   where: { id: userId },
    //   data: { status: UserStatus.ONLINE },
    // });

    // Find the room where the disconnection occurred
    const targetRoom = this.game.rooms.find((room) => room.id === this.roomId);

    // If the room is found, update the scores of other players
    if (targetRoom) {
      targetRoom.players.forEach((player) => {
        // Check if the player is not the disconnected player
        if (player.socketId !== client.id) {
          // Set the score to 5 for other players
          this.server.to(player.socketId).emit('gameOver', { winner: true });
        }
      });
    }
  }

  // this method is called when a player joins a room
  // if the room is full, the game is started immediately

  @SubscribeMessage('join')
  async joinRoom(client: Socket) {
    try {
      const player: Player = new Player(client.id, client['user']);
      this.roomId = this.game.joinRoom(player, client, this.server);
    } catch {}
  }

  // this mothod is for moving the player
  // the payload contains the direction the player is moving
  @SubscribeMessage('move')
  move(client: Socket, payload: any): any {
    try {
      this.game.move(payload, this.server);
    } catch {}
  }

  // this method is called when a player leaves a room
  @SubscribeMessage('leave')
  leave(client: Socket, payload: any): any {
    try {
      const playerId = client.id;
      this.game.leaveRoom(payload.roomId, playerId, client);
      console.log('leave');
    } catch {}
  }
}
