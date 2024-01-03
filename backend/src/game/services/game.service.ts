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
          this.startGame(room, roomId.toString(), server);
        }, 3000);

      }
    }
    return roomId;
  }

  // this method is called when a player moves
  // the position of the player is updated
  move(payload: any, roomId: number, server: Server) {
    const room = GameService.rooms.get(roomId);
    
    if (room) {
      const player = room.players[payload.playerNo - 1]
      const increment = 30; // Adjust the increment as needed

      if (payload.direction === 'up') {
          player.position.y -= increment;
          player.position.y = Math.max(player.position.y, 0);
      } else if (payload.direction === 'down') {
          player.position.y += increment;
          player.position.y = Math.min(player.position.y, this.height - player.height);
      }

      server.to(roomId.toString()).emit('updateGame', room);
      // update rooms
      // this.rooms = this.rooms.map(r => {
      //     if (r.id === room.id)
      //         return room;
      //     return r;
      // });
    }
  }

  // this mothod is for reseting the ball
  resetBall(room: Room) {
    room.ball.position.x = this.width / 2;
    room.ball.position.y = this.height / 2;

    room.ball.speed = 10;
    room.ball.velocity.x = -room.ball.velocity.x;
  }

  // this method is for checking if there is a collision between the ball and the player
  collision(ball: Ball, player: Player) {
    player.top = player.position.y;
    player.bottom = player.position.y + player.height;
    player.left = player.position.x;
    player.right = player.position.x + player.width;

    ball.top = ball.position.y - ball.radius;
    ball.bottom = ball.position.y + ball.radius;
    ball.left = ball.position.x - ball.radius;
    ball.right = ball.position.x + ball.radius;

    return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
  }

  // this method is for updating the collision between the ball and the player
  updatePlayerCollision(ball: Ball, player: Player) {
    if (this.collision(ball, player)) {
        let collidePoint = ball.position.y - (player.position.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = collidePoint * Math.PI / 4;
        let direction = ball.position.x < this.width / 2 ? 1 : -1;

        ball.velocity.x = direction * ball.speed * Math.cos(angleRad);
        ball.velocity.y = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }
  }

  // this method is the logic of the game
  // it is called when the game starts
  startGame(room: Room, roomId: string, server: Server): void {
    const update = () => {
            room.ball.position.x += room.ball.velocity.x;
            room.ball.position.y += room.ball.velocity.y;
      
            const borderSize = 10; // Adjust the border size as needed
            if (room.ball.position.y + room.ball.radius > this.height - borderSize || room.ball.position.y - room.ball.radius < borderSize) {
                room.ball.velocity.y = -room.ball.velocity.y;
            }
      
            // Check for collision with paddles and update their positions
            this.updatePlayerCollision(room.ball, room.players[0]);
            this.updatePlayerCollision(room.ball, room.players[1]);
      
            // update score
            if (room.ball.position.x - room.ball.radius < 0) {
                room.players[1].score++;
                this.resetBall(room);
            } else if (room.ball.position.x + room.ball.radius > this.width) {
                room.players[0].score++;
                this.resetBall(room);
            }
            if (room.players[0].score === 500) {
                room.winner = 1;
                // this.rooms = this.rooms.filter(r => r.id !== room.id);
                // // io.to(room.id).emit('gameOver', room);
                // this.server.to(room.id).emit('gameOver', room);
                clearInterval(gameLoopInterval);
            }
            else if (room.players[1].score === 500) {
                room.winner = 2;
                // this.rooms = this.rooms.filter(r => r.id !== room.id);
                // // io.to(room.id).emit('gameOver', room);
                // server.to(room.id).emit('gameOver', room);
                clearInterval(gameLoopInterval);
            }
            // io.to(room.id).emit('updateGame', room);
            server.to(roomId).emit('updateGame', room);
        }
      
        // Start the game loop with setInterval
        const gameLoopInterval = setInterval(update, 1000 / 60);
  }

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
