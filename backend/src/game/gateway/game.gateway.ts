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
import { Player } from '../classes/player';
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
  ) { }

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
    
    try {
      const targetRoom = this.game.rooms.find((room) =>
        room.players.some((player) => player.socketId === client.id),
      );
      if (targetRoom) {
        if (targetRoom.players.length > 1) {
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
        }
        console.log('targetRoom', targetRoom);
        this.game.leaveRoom(targetRoom.id, client.id, client);
      }

      const targetChallengeRoom = this.game.challenge.find((room) =>
        room.players.some((player) => player.socketId === client.id),
      );

      if (targetChallengeRoom) {
        if (targetChallengeRoom.players.length > 1) {
          if (targetChallengeRoom.players[0].socketId === client.id) {
            this.game.createMatchHistory(
              targetChallengeRoom.players[0].user.id,
              targetChallengeRoom.players[1].user.id,
              0,
              5,
            );
            this.game.updateStatistics(targetChallengeRoom.players[1].user.id, 5, 0);
            this.game.updateStatistics(targetChallengeRoom.players[0].user.id, 0, 5);
          }
          if (targetChallengeRoom.players[1].socketId === client.id) {
            this.game.createMatchHistory(
              targetChallengeRoom.players[0].user.id,
              targetChallengeRoom.players[1].user.id,
              5,
              0,
            );
            this.game.updateStatistics(targetChallengeRoom.players[0].user.id, 5, 0);
            this.game.updateStatistics(targetChallengeRoom.players[1].user.id, 0, 5);
          }
          targetChallengeRoom.players.forEach((player) => {
            // Check if the player is not the disconnected player
            if (player.socketId !== client.id) {
              this.server.to(player.socketId).emit('winByResign');
            }
          });
        }
        this.game.leaveChallengeRoom(targetChallengeRoom.id, client.id, client);
      }
    } catch { }
  }

  // this method is called when a player joins a room
  // if the room is full, the game is started immediately

  @SubscribeMessage('join')
  async joinRoom(client: Socket) {
    try {
      const player: Player = new Player(client.id, client['user']);
      this.roomId = this.game.joinRoom(player, client, this.server);
    } catch { }
  }

  @SubscribeMessage('challengeJoin')
  async joinChallengeRoom(client: Socket, payload: string) {
    try {
      const player: Player = new Player(client.id, client['user']);
      this.roomId = this.game.joinChallengeRoom(
        payload,
        player,
        client,
        this.server,
      );
    } catch { }
  }

  // this mothod is for moving the player
  // the payload contains the direction the player is moving
  @SubscribeMessage('move')
  move(client: Socket, payload: any): void {
    try {
      this.game.move(payload, this.server);
    } catch { }
  }

  @SubscribeMessage('resign')
  resign(client: Socket, payload: { roomId: string; mode: number }): void {
    try {
      // console.log(payload);
      console.log('resign');
      if (payload.mode === 0) {
        const room = this.game.rooms.find((room) => room.id === payload.roomId);
        if (room) {
            // console.log('player 1', room.players[0]);
            // console.log('player 2', room.players[1]);
          // create match history, if the player resigns, the other player wins by default with 5 points to 0
            if (room.players[0].socketId === client.id) {
              this.game.createMatchHistory(
                room.players[0].user.id,
                room.players[1].user.id,
                0,
                5,
              );
              this.game.updateStatistics(room.players[1].user.id, 5, 0);
              this.game.updateStatistics(room.players[0].user.id, 0, 5);
            }
            if (room.players[1].socketId === client.id) {
              this.game.createMatchHistory(
                room.players[0].user.id,
                room.players[1].user.id,
                5,
                0,
              );
              this.game.updateStatistics(room.players[0].user.id, 5, 0);
              this.game.updateStatistics(room.players[1].user.id, 0, 5);
            }

          room.players.forEach((player) => {
            if (player.socketId !== client.id) {
              this.server.to(player.socketId).emit('winByResign');
            }
          });
          this.game.leaveRoom(payload.roomId, client.id, client);
        }

        // update statistics
      } else if (payload.mode === 1) {
        console.log('first', this.game.challenge);
        const room = this.game.challenge.find(
          (room) => room.id === payload.roomId,
        );
        if (room) {
            // console.log('player 1', room.players[0]);
            // console.log('player 2', room.players[1]);
          // create match history, if the player resigns, the other player wins by default with 5 points to 0
            if (room.players[0].socketId === client.id) {
              this.game.createMatchHistory(
                room.players[0].user.id,
                room.players[1].user.id,
                0,
                5,
              );
              this.game.updateStatistics(room.players[1].user.id, 5, 0);
              this.game.updateStatistics(room.players[0].user.id, 0, 5);
            }
            if (room.players[1].socketId === client.id) {
              this.game.createMatchHistory(
                room.players[0].user.id,
                room.players[1].user.id,
                5,
                0,
              );
              this.game.updateStatistics(room.players[0].user.id, 5, 0);
              this.game.updateStatistics(room.players[1].user.id, 0, 5);
            }

          room.players.forEach((player) => {
            if (player.socketId !== client.id) {
              this.server.to(player.socketId).emit('winByResign');
            }
          });
          this.game.leaveChallengeRoom(payload.roomId, client.id, client);
          //
        }
        console.log('second', this.game.challenge);
      }
    } catch { }
  }

  // this method is called when a player leaves a room
  @SubscribeMessage('leave')
  leave(client: Socket, payload: any): void {
    try {
      const playerId = client.id;

      if (payload.mode === 0) {
        this.game.leaveRoom(payload.roomId, playerId, client);
      } else if (payload.mode === 1) {
        this.game.leaveChallengeRoom(payload.roomId, playerId, client);
      }
      console.log('leave');
    } catch { }
  }
}