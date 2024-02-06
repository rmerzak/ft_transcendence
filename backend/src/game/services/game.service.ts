import { Injectable } from '@nestjs/common';
import { Room } from '../classes/room';
import { Player } from '../classes/player';
import { State } from '../classes/state';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { Achievements } from '../types/types';

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
  challenge: Array<Room> = [];
  playerStatusMap: Map<number, boolean> = new Map();
  sseSubject = new Subject<string>();
  private width = 1908;
  private height = 1146;

  // this method is updating the status of a player
  private updatePlayerStatus(playerId: number, newStatus: boolean) {
    this.playerStatusMap.set(playerId, newStatus);

    // Emit the updated data to the client
    this.sseSubject.next(this.getIsPlayingData());
  }

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

  createChallengeRoom(): Room {
    const room = new Room(uuidv4());
    this.challenge.push(room);
    return room;
  }

  // this method is checking if there is a room with an available slot
  // if there is a room with an available slot, the id of that room is returned
  // if there is no room with an available slot, 0 is returned
  roomWithAvailableSlots(): Room | null {
    const room = this.rooms.find((room) => room.state === State.WAITING);
    if (room) {
      return room;
    }
    return null;
  }

  // this method call when status of player change
  // if player status is undefined, set status to true
  onPlayerStatusChange(
    playerId: number,
    callback: (newStatus: boolean) => void,
  ) {
    let status = this.playerStatusMap.get(playerId);

    if (status === undefined) {
      // Set an initial status if needed
      status = true;
      this.playerStatusMap.set(playerId, status);
    }

    callback(status);
  }

  // start playing status
  startPlaying(playerId: number) {
    this.updatePlayerStatus(playerId, true);
  }

  // stop playing status
  stopPlaying(playerId: number) {
    this.updatePlayerStatus(playerId, false);
  }

  // get is playing data
  getIsPlayingData(): string {
    const isPlayingData = Array.from(this.playerStatusMap.entries()).map(
      ([playerId, isPlaying]) => ({ playerId, isPlaying }),
    );
    return JSON.stringify(isPlayingData);
  }

  // this method is called when a player joins a room
  // if there is a room with an available slot, the player is added to that room
  // if there is no room with an available slot, a new room is created and the player is added to that room
  joinRoom(player: Player, client: Socket, server: Server): string {
    const room = this.roomWithAvailableSlots();
    if (!this.playerExists(player)) {
      if (room && room.state === State.WAITING) {
        client.join(room.id);
        this.startPlaying(player.user.id);
        if (room.players.length === 0) {
          player.playerNo = 1;
          player.position.x = 20;
          player.position.y = this.height / 2 - 100 / 2;
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
      }
      if (room && room.state === State.PLAYING) {
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

  // this method is called when a player joins a challenge room
  joinChallengeRoom(
    payload: string,
    player: Player,
    client: Socket,
    server: Server,
  ): string {
    const room = this.getRoom(payload, 1);
    if (!this.playerExists(player)) {
      if (room && room.state === State.WAITING) {
        client.join(room.id);
        this.startPlaying(player.user.id);
        if (room.players.length === 0) {
          player.playerNo = 1;
          player.position.x = 20;
          player.position.y = this.height / 2 - 100 / 2;
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
      }
      // Start the 3-minute timer for room removal
      setTimeout(() => {
        if (room && room.state === State.WAITING) {
          // remove the room if note filled within 3 minutes
          const roomIndex = this.challenge.findIndex(
            (room) => room.id === payload,
          );
          if (roomIndex !== -1) {
            this.challenge.splice(roomIndex, 1);
          }
          server.to(room.id).emit('timeOut');
        }
      }, 30000); // 180000 = 3 minutes 30000 = 30 seconds
      if (room && room.state === State.PLAYING) {
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
    let room: Room;
    if (payload.mode === 0) {
      room = this.rooms.find((room) => room.id === payload.roomId);
    } else if (payload.mode === 1) {
      room = this.challenge.find((room) => room.id === payload.roomId);
    }
    if (room) {
      room.movePlayer(payload, server);
    }
  }

  // this method is called when a player leaves a room
  leaveRoom(roomId: string, playerId: string, client: Socket): void {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId);

    if (roomIndex !== -1) {
      const room = this.rooms[roomIndex];
      if (room.players.length === 1) {
        room.state = State.WAITING;
      }
      room.endGame();
      client.leave(roomId);

      // Find and remove the player from the room
      const playerIndex = room.players.findIndex(
        (player) => player.socketId === playerId,
      );

      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        room.removePlayer(player);
        this.stopPlaying(player.user.id);

        if (room.players.length === 0) {
          this.rooms.splice(roomIndex, 1);
        }
      }
    }
  }

  // this method is called when a player leaves a challenge room
  leaveChallengeRoom(roomId: string, playerId: string, client: Socket): void {
    const roomIndex = this.challenge.findIndex((room) => room.id === roomId);

    if (roomIndex !== -1) {
      const room = this.challenge[roomIndex];
      room.state = State.WAITING;
      room.endGame();
      client.leave(roomId);

      // Find and remove the player from the room
      const playerIndex = room.players.findIndex(
        (player) => player.socketId === playerId,
      );
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        room.removePlayer(player);
        this.stopPlaying(player.user.id);
        this.challenge.splice(roomIndex, 1);
      }
    }
  }

  // this method for get room
  getRoom(roomId: string, mode: number): Room {
    if (mode === 0) {
      return this.rooms.find((room) => room.id === roomId);
    }
    return this.challenge.find((room) => room.id === roomId);
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
  async getStatistics(playerName: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: playerName },
      select: {
        gameMatches: true,
        gameWins: true,
        gameLoses: true,
        gameElo: true,
        gameRank: true,
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

  // get Leaderboard
  async getLeaderboard() {
    // Fetch the leaderboard without updating ranks
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        gameRank: true,
      },
      orderBy: {
        gameWins: 'desc',
      },
    });
  
    // Update gameRank for each user based on their position in the list
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await this.prisma.user.update({
        where: { id: user.id },
        data: { gameRank: i + 1 },
      });
    }
  
    // Fetch the updated leaderboard
    const updatedUsers = await this.prisma.user.findMany({
      select: {
        id: true,
        gameRank: true,
        username: true,
        image: true,
        gameElo: true,
        gameMatches: true,
        gameWins: true,
      },
      orderBy: {
        gameWins: 'desc',
      },
    });
  
    return updatedUsers;
  }

  // get Achievements
  async getAchievements(playerName: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: playerName },
      select: {
        gameMatches: true,
        gameWins: true,
      },
    });
  
    const achievements = [];
    if (user.gameMatches >= 1) {
      achievements.push(Achievements.FIRST_GAME);
    }
    if (user.gameWins >= 5) {
      achievements.push(Achievements.WOOD);
    }
    if (user.gameWins >= 10) {
      achievements.push(Achievements.BRONZE);
    }
    if (user.gameWins >= 20) {
      achievements.push(Achievements.SILVER);
    }
    if (user.gameWins >= 30) {
      achievements.push(Achievements.GOLD);
    }
    if (user.gameWins >= 40) {
      achievements.push(Achievements.RUBY);
    }
    if (user.gameWins >= 50) {
      achievements.push(Achievements.DIAMOND);
    }
    return achievements;
  }
}
