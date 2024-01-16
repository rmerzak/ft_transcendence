import { Injectable } from '@nestjs/common';
import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { State } from '../models/state.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        gameElo: true,
      },
    });
    return user;
  }

  rooms: Array<Room> = [];
  private width = 1908;
  private height = 1146;

  // check if player already exists in a room or rooms
  // if player already exists, return true
  // if player does not exist, return false
  playerExists(player: Player): boolean {
    const isInRoom = this.rooms.some((room) =>
      room.players.some(({ user: { id } }) => id === player.user.id),
    );

    return isInRoom;
  }

  // this method is creating a new room
  // the id of the room is returned
  createRoom(): Room {
    const room = new Room(uuidv4());
    this.rooms.push(room);
    return room;
  }

  // this method is checking if there is a room with an available slot
  // if there is a room with an available slot, the id of that room is returned
  // if there is no room with an available slot, 0 is returned
  roomWithAvailableSlots(): Room | null {
    const room = this.rooms.find((room) => room.players.length < 2);
    if (room) {
      return room;
    }
    return null;
  }

  // this method is called when a player joins a room
  // if there is a room with an available slot, the player is added to that room
  // if there is no room with an available slot, a new room is created and the player is added to that room
  joinRoom(player: Player, client: Socket, server: Server): string {
    const room = this.roomWithAvailableSlots();

    if (room && room.state === State.WAITING) {
      client.join(room.id);
      if (!this.playerExists(player)) {
        if (room.players.length === 0) {
          player.playerNo = 1;
          player.position.x = 20;
          player.position.y = this.height / 2 - 100 / 2;
          player.status = 'PLAYING';
          room.addPlayer(player);

          client.emit('playerNo', {
            playerNo: 1,
            user: room.players[0].user,
            showLoading: true,
          });
        } else {
          player.playerNo = 2;
          player.position.x = this.width - 35;
          player.position.y = this.height / 2 - 100 / 2;
          player.status = 'PLAYING';
          room.addPlayer(player);

          server.to(room.id).emit('playerNo', {
            playerNo: 2,
            user: room.players[1].user,
          });
          client.emit('playerNo', {
            playerNo: 1,
            user: room.players[0].user,
            showLoading: false,
          });
          room.state = State.PLAYING;
        }
      } else {
        // client.emit('redirect', true);
        // don't allow player to join
      }
      if (room.players.length === 2) {
        room.ball.color = 'white';
        server.to(room.id).emit('roomIsFull', true);
        setTimeout(() => {
          server.to(room.id).emit('startedGame', room.id);
          // start game
          room.startGame(this, server);
        }, 50);
      }
    }
    return room.id;
  }

  // this method is called when a player moves
  // the position of the player is updated
  move(payload: any, server: Server) {
    const room = this.rooms.find((room) => room.id === payload.roomId);
    if (room) {
      room.movePlayer(payload, server);
    }
  }

  // this method is called when a player leaves a room
  // leaveRoom(roomId: string, playerId: string, client: Socket): void {
  //   const room = this.rooms.find((room) => room.id === roomId);
  //   client.leave(roomId);
  //   console.log(this.rooms);
  //   if (room) {
  //     room.endGame();
  //     const player = room.players.find(
  //       (player) => player.socketId === playerId,
  //     );
  //     room.removePlayer(player);
  //     if (room.players.length === 0) {
  //       this.rooms.splice(this.rooms.indexOf(room), 1);
  //       roomId = '';
  //     }
  //   }
  //   console.log(this.rooms);
  // }

  leaveRoom(roomId: string, playerId: string, client: Socket): void {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId);

    if (roomIndex !== -1) {
      const room = this.rooms[roomIndex];
      room.state = State.WAITING;
      room.endGame();
      client.leave(roomId);
      console.log(this.rooms);

      // Find and remove the player from the room
      const playerIndex = room.players.findIndex(
        (player) => player.socketId === playerId,
      );

      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        room.removePlayer(player);

        if (room.players.length === 0) {
          // rmove the other player and delete the room
          // const otherPlayer = room.players[0];

          this.rooms.splice(roomIndex, 1);
        }
      }

      console.log(this.rooms);
    }
  }

  // this method for get room
  getRoom(roomId: string): Room {
    return this.rooms.find((room) => room.id === roomId);
  }

  isPlayerPlaying(playerId: number): boolean {
    const isPlaying = this.rooms.some((room) =>
      room.players.some(
        ({ user: { id }, status }) => id === playerId && status === 'PLAYING',
      ),
    );

    return isPlaying;
  }

  // Create match History
  async createMatchHistory(
    player1Id: number,
    player2Id: number,
    player1Score: number,
    player2Score: number,
  ) {
    const matchHistory = await this.prisma.game.create({
      data: {
        userPlayerId: player1Id,
        userOpponentId: player2Id,
        userScore: player1Score,
        oppScore: player2Score,
      },
    });
    return matchHistory;
  }

  // Update Statistics
  async updateStatistics(
    playerId: number,
    playerScore: number,
    oppScore: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: playerId },
    });
    if (!user) {
      return;
    }
    const state = playerScore > oppScore ? 1 : 0;
    const gameWins = user.gameWins + state;
    const gameLoses = user.gameLoses + (1 - state);
    const gameMatches = user.gameMatches + 1;
    const gameElo =
      user.gameElo +
      10 * (state - 1 / (1 + 10 ** ((oppScore - playerScore) / 400)));

    await this.prisma.user.update({
      where: { id: playerId },
      data: {
        gameWins,
        gameLoses,
        gameMatches,
        gameElo,
      },
    });
  }

  // get Statistics
  async getStatistics(playerId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: playerId },
      select: {
        gameMatches: true,
        gameWins: true,
        gameLoses: true,
        gameElo: true,
      },
    });
    return user;
  }

  // get Match History
  async getMatchHistory(playerId: number) {
    const matchHistory = await this.prisma.game.findMany({
      where: {
        OR: [{ userPlayerId: playerId }, { userOpponentId: playerId }],
      },
      select: {
        userPlayerId: true,
        userOpponentId: true,
        userScore: true,
        oppScore: true,
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        opponent: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    });
    return matchHistory;
  }
}
