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
  private width = 1908;
  private height = 1146;
  private roomId = 0;

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

  handleDisconnect(client: Socket): any {
    console.log("disconnected");
    this.game.leaveRoom(this.roomId, client.id);
  }

  // this method is called when a player joins a room
  // if the room is full, the game is started immediately
  @SubscribeMessage('join')
  joinRoom(client: Socket): void {
    
  const player: Player = {
    socketId: client.id,
    playerNo: 0,
    score: 0,
    position: {
      x: 0,
      y: 0,
    },
    width: 15,
    height: 180,
    color: 'white',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }

  this.roomId = this.game.joinRoom(player, client, this.server);
  }

  // this mothod is for moving the player
  // the payload contains the direction the player is moving
  @SubscribeMessage('move')
  move(client: Socket, payload: any): any {
    this.game.move(payload, this.server);
  }

  // this method is called when a player leaves a room
  @SubscribeMessage('leave')
  leave(client: Socket, payload: any): any {
    
    const playerId = client.id;
    this.game.leaveRoom(payload.roomId, playerId);
    console.log("leave");
    // console.log(GameService.rooms);
  }
}
