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
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';


@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
  namespace: '/game'
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly game: GameService,
    private prisma:PrismaService
  ) {}

  private roomId: string = '';

  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

    async handleConnection(socket: Socket) {
    console.log("i'm connected");

      const user = await this.prisma.user.findUnique({where:{id:socket['payload']['sub']}});
      const userId = socket['payload']['sub'];
      let updatedUser = await this.prisma.user.update({where:{id:userId},data:{status:UserStatus.INGAME}});
      if(user){
        socket['user'] = user;
        // console.log(socket['user']);
      }else{
        socket.disconnect();
      } 
    console.log('connected chat id1: ' + socket.id);
    // console.log(socket['payload']['email']);
    // this.getUser(socket.request);
    // socket["user"] = await this.getUser(socket.request);
    // console.log(this.getUser(socket));
    // this.getUser(socket);
  }

  async handleDisconnect(client: Socket) {
    console.log("Player disconnected");
    console.log("Room ID:", this.roomId);
  
    // Leave the room for the disconnected player
    this.game.leaveRoom(this.roomId, client.id);
    const userId = client['payload']['sub'];
    let updatedUser = await this.prisma.user.update({where:{id:userId},data:{status:UserStatus.ONLINE}});

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
    console.log(client.id);
    const user = await this.prisma.user.findUnique({where:{id:client['payload']['sub']}});
    console.log('user = ',user)
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
