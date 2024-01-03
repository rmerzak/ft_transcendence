import { Injectable } from '@nestjs/common';
import { Ball, Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { State } from '../models/state.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket, Server } from 'socket.io';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
      },
    });
    return user;
  }

  static rooms: Map<number, Room> = new Map();
  static roomIdCounter: number = 1;
  private width = 1908;
  private height = 1146;

  // this method is creating a new room
  // the id of the room is returned
  createRoom(): number {
    const roomId = GameService.roomIdCounter++;
    const room = new Room(roomId);
    GameService.rooms.set(roomId, room);
    return roomId;
  }

  // this method is checking if there is a room with an available slot
  // if there is a room with an available slot, the id of that room is returned
  // if there is no room with an available slot, 0 is returned
  roomWithAvailableSlots(): number {
    for (const [id, room] of GameService.rooms) {
      if (room.players.length < 2) {
        return id;
      }
    }
    return 0;
  }

  // this method is called when a player joins a room
  // if there is a room with an available slot, the player is added to that room
  // if there is no room with an available slot, a new room is created and the player is added to that room
  joinRoom(player: Player, client: Socket, server: Server): number {
    let roomId = this.roomWithAvailableSlots();

    if (roomId === 0) {
      roomId = this.createRoom();
    }

    const room = GameService.rooms.get(roomId);

    if (room && room.state === State.WAITING) {
      if (room.players.length === 0) {
        player.playerNo = 1;
        player.position.x = 20;
        player.position.y = this.height / 2 - 100 / 2;
        client.emit('playerNo', 1);
      } else {
        player.playerNo = 2;
        player.position.x = this.width - 35;
        player.position.y = this.height / 2 - 100 / 2;
        client.emit('playerNo', 2);
        room.state = State.PLAYING;
      }
      room.addPlayer(player);
      client.join(roomId.toString());
      if (room.players.length === 2) {
        room.ball.color = 'white';
        server.to(roomId.toString()).emit('roomIsFull', true);
        // set time out to start game
        setTimeout(() => {
          server.to(roomId.toString()).emit('startedGame', room);
          // start game
          // this.startGame(room, roomId.toString(), server);
          // loop for game 
          room.startGame(server);

        }, 3000);

      }
    }
    return roomId;
  }

  // this method is called when a player moves
  // the position of the player is updated
  move(payload: any, roomId: number, server: Server) {
    // loop for game
    for (const [id, room] of GameService.rooms) {
      if (id === payload.roomId) {
        room.movePlayer(payload, server);
      }
    }
    // const room = GameService.rooms.get(roomId);
    // if (room) {
    //   room.movePlayer(payload, server);
    // }
  }
    
  // this method is called when a player leaves a room
  leaveRoom(roomId: number, playerId: string): boolean {
    const room = GameService.rooms.get(roomId);
    if (room) {
      room.removePlayer(playerId);
      if (room.players.length === 0) {
        GameService.rooms.delete(roomId);
        roomId = 0;
      }
      return true;
    }
    return false;
  }

  getRoom(roomId: number): Room {
    return GameService.rooms.get(roomId);
  }
}
