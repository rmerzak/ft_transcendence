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
import { UserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL as string,
    credentials: true,
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly game: GameService,
    private readonly prisma: PrismaService,
  ) {}

  private roomId: string = '';

  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  async handleConnection(socket: Socket) {
    console.log("hi i'm connected");

    // get user info from db and add it to the socket
    const user = await this.game.findUserById(socket['payload']['sub']);
    socket['user'] = user;
    socket.emit('userInfo');

    // change user status to INGAME
    const userId = socket['payload']['sub'];
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.INGAME },
    });
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnected');

    // Change user status to ONLINE
    const userId = client['payload']['sub'];
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.ONLINE },
    });

    // find the room using socket id
    const targetRoom = this.game.rooms.find((room) =>
      room.players.some((player) => player.socketId === client.id),
    );

    console.log('targetRoom', targetRoom);

    try {

      if (targetRoom) {
        if (targetRoom.players[0].socketId === client.id) {
          this.game.createMatchHistory(
            targetRoom.players[0].user.id,
            targetRoom.players[1].user.id,
            0,
            5,
          );
          this.game.updateStatistics(targetRoom.players[1].user.id, 5, 0);
          this.game.updateStatistics(targetRoom.players[0].user.id, 0, 5);
        }
        if (targetRoom.players[1].socketId === client.id) {
          this.game.createMatchHistory(
            targetRoom.players[0].user.id,
            targetRoom.players[1].user.id,
            5,
            0,
          );
          this.game.updateStatistics(targetRoom.players[0].user.id, 5, 0);
          this.game.updateStatistics(targetRoom.players[1].user.id, 0, 5);
        }
        targetRoom.players.forEach((player) => {
          // Check if the player is not the disconnected player
          if (player.socketId !== client.id) {
            this.server.to(player.socketId).emit('winByResign');
          }
        });
        this.game.leaveRoom(targetRoom.id, client.id, client);
      }
  
      console.log('targetRoom', targetRoom);
    } catch {}

    // console.log('first', this.game.rooms)

    // Leave the room for the disconnected player
    // const targetRoom = this.game.rooms.find((room) => room.id === this.roomId);
    // this.game.leaveRoom(this.roomId, client.id, client);
    // this.game.updateStatistics(targetRoom.players[0].user.id, 0, 1);

    // console.log('second', this.game.rooms)

    // Find the room where the disconnection occurred

    // // If the room is found, update the scores of other players
    // if (targetRoom) {
    //   targetRoom.players.forEach((player) => {
    //     // Check if the player is not the disconnected player
    //     if (player.socketId !== client.id) {
    //       // Set the score to 5 for other players
    //       // this.game.createMatchHistory(
    //       //   player.user.id,
    //       //   targetRoom.players[0].user.id,
    //       //   1,
    //       //   0,
    //       // );
    //       // this.game.updateStatistics(player.user.id, 1, 0);
    //       // this.game.updateStatistics(targetRoom.players[0].user.id, 0, 1);
    //       this.server.to(player.socketId).emit('winByResign');
    //     }
    //   });
    // }
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
  move(client: Socket, payload: any): void {
    try {
      this.game.move(payload, this.server);
    } catch {}
  }

  // @SubscribeMessage('resign')
  // resign(client: Socket, payload: {roomId: string}): void {
  //   try {
  //     // console.log(payload);
  //     console.log('resign');
  //     console.log('first', this.game.rooms)
  //     const room = this.game.rooms.find((room) => room.id === payload.roomId);
  //     if (room) {
  //       console.log('player 1', room.players[0]);
  //       console.log('player 2', room.players[1]);
  //       // create match history, if the player resigns, the other player wins by default with 5 points to 0
  //       if (room.players[0].socketId === client.id) {
  //         this.game.createMatchHistory(
  //           room.players[0].user.id,
  //           room.players[1].user.id,
  //           0,
  //           5,
  //         );
  //         this.game.updateStatistics(room.players[1].user.id, 5, 0);
  //         this.game.updateStatistics(room.players[0].user.id, 0, 5);
  //       }
  //       if (room.players[1].socketId === client.id) {
  //         this.game.createMatchHistory(
  //           room.players[0].user.id,
  //           room.players[1].user.id,
  //           5,
  //           0,
  //         );
  //         this.game.updateStatistics(room.players[0].user.id, 5, 0);
  //         this.game.updateStatistics(room.players[1].user.id, 0, 5);
  //       }

  //       room.players.forEach((player) => {
  //         if (player.socketId !== client.id) {
  //           this.server.to(player.socketId).emit('winByResign');
  //         }
  //       });
  //       this.game.leaveRoom(payload.roomId, client.id, client);
  //     }

  //     // update statistics
  //     console.log('second', this.game.rooms)
  //   } catch {}
  // }

  // this method is called when a player leaves a room
  @SubscribeMessage('leave')
  leave(client: Socket, payload: any): void {
    try {
      const playerId = client.id;
  
      this.game.leaveRoom(payload.roomId, playerId, client);
      console.log('leave');
    } catch {}
  }
}
