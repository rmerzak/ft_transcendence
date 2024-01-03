import { Server } from 'socket.io';
import { Player, Position } from './player.model';
import { State } from './state.model';

export interface Ball {
  position: Position;
  velocity: Position;
  radius: number;
  color: string;
  speed: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export class Room {
  private width = 1908;
  private height = 1146;
  id: number;
  state: State;
  players: Array<Player> = [];
  ball: Ball;
  winner: number;
  constructor(id: number) {
    this.id = id;
    this.state = State.WAITING;
    this.winner = 0;
    this.ball = {
      position: {
        x: this.width / 2,
        y: this.width / 2,
      },
      velocity: {
        x: 5,
        y: 5,
      },
      radius: 20,
      color: 'white',
      speed: 10,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  addPlayer(player: Player): void {
    if (!this.players.some(existingPlayer => existingPlayer.socketId === player.socketId)) {
        this.players.push(player);
    }
}

  removePlayer(socketId: string): void {
    this.players = this.players.filter(player => player.socketId !== socketId);
  }

  isEmpty(): boolean {
    return this.players.length === 0;
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
      if (player) {
        player.top = player.position.y;
        player.bottom = player.position.y + player.height;
        player.left = player.position.x;
        player.right = player.position.x + player.width;
      }

      if (ball)
      {
        ball.top = ball.position.y - ball.radius;
        ball.bottom = ball.position.y + ball.radius;
        ball.left = ball.position.x - ball.radius;
        ball.right = ball.position.x + ball.radius;
      }
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
    startGame(server: Server): void {
      const update = () => {
              this.ball.position.x += this.ball.velocity.x;
              this.ball.position.y += this.ball.velocity.y;
        
              const borderSize = 10; // Adjust the border size as needed
              if (this.ball.position.y + this.ball.radius > this.height - borderSize || this.ball.position.y - this.ball.radius < borderSize) {
                  this.ball.velocity.y = -this.ball.velocity.y;
              }
        
              // Check for collision with paddles and update their positions
              this.updatePlayerCollision(this.ball, this.players[0]);
              this.updatePlayerCollision(this.ball, this.players[1]);
        
              // update score
              if (this.ball.position.x - this.ball.radius < 0) {
                  this.players[1].score++;
                  this.resetBall(this);
              } else if (this.ball.position.x + this.ball.radius > this.width) {
                  this.players[0].score++;
                  this.resetBall(this);
              }
              if (this.players[0].score === 500) {
                  this.winner = 1;
                  // this.rooms = this.rooms.filter(r => r.id !== room.id);
                  // // io.to(room.id).emit('gameOver', room);
                  // this.server.to(room.id).emit('gameOver', room);
                  clearInterval(gameLoopInterval);
              }
              else if (this.players[1].score === 500) {
                  this.winner = 2;
                  // this.rooms = this.rooms.filter(r => r.id !== room.id);
                  // // io.to(room.id).emit('gameOver', room);
                  // server.to(room.id).emit('gameOver', room);
                  clearInterval(gameLoopInterval);
              }
              // io.to(room.id).emit('updateGame', room);
              server.to(this.id.toString()).emit('updateGame', this);
          }
        
          // Start the game loop with setInterval
          const gameLoopInterval = setInterval(update, 1000 / 60);
    }

    movePlayer(payload: any, server: Server): void {

      // if (payload.roomId !== this.id) return;
      const player = this.players[payload.playerNo - 1]
      const increment = 30; // Adjust the increment as needed

      if (payload.direction === 'up') {
          player.position.y -= increment;
          player.position.y = Math.max(player.position.y, 0);
      } else if (payload.direction === 'down') {
          player.position.y += increment;
          player.position.y = Math.min(player.position.y, this.height - player.height);
      }

      server.to(this.id.toString()).emit('updateGame', this);
    }
}
