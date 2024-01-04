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

  rooms: Map<number, Room> = new Map();
  roomIdCounter: number = 1;
  private width = 1908;
  private height = 1146;

  // this method is creating a new room
  // the id of the room is returned
  createRoom(): Room {
    const roomId = this.roomIdCounter++;
    const room = new Room(roomId);
    this.rooms.set(roomId, room);
    return room;
  }

  // this method is checking if there is a room with an available slot
  // if there is a room with an available slot, the id of that room is returned
  // if there is no room with an available slot, 0 is returned
  roomWithAvailableSlots(): Room | null {
    for (const [id, room] of this.rooms) {
      if (room.players.length < 2) {
        return room;
      }
    }
    return null;
  }

  // this method is called when a player joins a room
  // if there is a room with an available slot, the player is added to that room
  // if there is no room with an available slot, a new room is created and the player is added to that room
  joinRoom(player: Player, client: Socket, server: Server): number {
    const room = this.roomWithAvailableSlots() || this.createRoom();

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
      client.join(room.id.toString());
      if (room.players.length === 2) {
        room.ball.color = 'white';
        server.to(room.id.toString()).emit('roomIsFull', true);
        // set time out to start game
        setTimeout(() => {
          server.to(room.id.toString()).emit('startedGame', room);
          // start game
          // this.startGame(room, roomId.toString(), server);
          // loop for game 
          room.startGame(server);

        }, 3000);

      }
    }
    return room.id;
  }

  // this method is called when a player moves
  // the position of the player is updated
  move(payload: any, server: Server) {
    // loop for game
    for (const [id, room] of this.rooms) {
      if (id === payload.roomId) {
        room.movePlayer(payload, server);
      }
    }
  }
    
  // this method is called when a player leaves a room
  leaveRoom(roomId: number, playerId: string): void {

    // if just one player in room, delete room
    const room = this.rooms.get(roomId);
    if (room) {
      room.removePlayer(playerId);
      if (room.players.length === 1) {
          this.rooms.delete(roomId); 
          roomId = 0;
        }
      }
  }

  // this method for get room
  getRoom(roomId: number): Room {
    return this.rooms.get(roomId);
  }
}
