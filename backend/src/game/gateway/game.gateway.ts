/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { State } from '../models/state.model';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080/game',
    namespace: 'game',
    credentials: true,
  }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly game: GameService,
  ) {}

  private roomId: string = '';

  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  async getUser(socket: any) {

    const user = await this.game.findUserByEmail(socket['payload']['email']);

    console.log(user);
  }

    handleConnection(socket: Socket, request: Request) {
    console.log("connected");
    // console.log(socket['payload']['email']);
    // this.getUser(socket.request);
    // socket["user"] = await this.getUser(socket.request);
    // console.log(this.getUser(socket));
    // this.getUser(socket);
  }

  handleDisconnect(client: Socket): void {
    console.log("Player disconnected");
    console.log("Room ID:", this.roomId);
  
    // Leave the room for the disconnected player
    this.game.leaveRoom(this.roomId, client.id);
  
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
  joinRoom(client: Socket): void {
    try {
      const player: Player = new Player(client.id);
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
      this.game.leaveRoom(payload.roomId, playerId);
      console.log("leave");
    } catch {}
  }
}
