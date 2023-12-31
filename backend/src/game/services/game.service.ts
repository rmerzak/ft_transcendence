import { Injectable } from '@nestjs/common';
import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { State } from '../models/state.model';
import { PrismaService } from 'src/prisma/prisma.service';

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

  createRoom(): number {
    const roomId = GameService.roomIdCounter++;
    const room = new Room(roomId);
    GameService.rooms.set(roomId, room);
    return roomId;
  }

  roomWithAvailableSlots(): number {
    for (const [id, room] of GameService.rooms) {
      if (room.players.size < 2) {
        return id;
      }
    }
    return 0;
  }

  joinRoom(player: Player): number {
    // let roomId = 0;
    let roomId = this.roomWithAvailableSlots();
    // if (
    //   this.rooms.size === 0 ||
    //   this.rooms.get(this.rooms.size).players.size === 2
    // ) {
    //   roomId = this.createRoom();
    // } else {
    //   // Find the first room with available slots
    // }

    if (roomId === 0) {
      roomId = this.createRoom();
    }

    const room = GameService.rooms.get(roomId);

    if (room && room.state === State.WAITING) {
      if (room.players.size === 0) {
        player.playerNo = 1;
        player.position.x = 20;
        player.position.y = this.height / 2 - 100 / 2;
      } else {
        player.playerNo = 2;
        player.position.x = this.width - 35;
        player.position.y = this.height / 2 - 100 / 2;
        room.state = State.PLAYING;
      }
      room.addPlayer(player);
      //   room.state = State.PLAYING;
      //   console.log(roomId);
      console.log(GameService.rooms);
      //   console.log(this.rooms.get(roomId).players);
    }
    return roomId;
  }

  leaveRoom(roomId: number, playerId: string): boolean {
    const room = GameService.rooms.get(roomId);
    if (room) {
      room.removePlayer(playerId);
      if (room.players.size === 0) {
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
