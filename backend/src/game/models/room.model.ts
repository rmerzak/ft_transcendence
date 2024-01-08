import { Server } from 'socket.io';
import { Player } from './player.model';
import { State } from './state.model';
import { Ball } from './ball.model';

export class Room {
  private playersSet: WeakSet<Player> = new WeakSet<Player>();
  private width = 1908;
  private height = 1146;
  id: string;
  state: State;
  players: Array<Player> = new Array<Player>();
  ball: Ball = new Ball(this.width);
  winner: number;
  constructor(id: string) {
    this.id = id;
    this.state = State.WAITING;
    this.winner = 0;
  }

  addPlayer(player: Player): void {
    if (!this.playersSet.has(player)) {
      this.playersSet.add(player);
      this.players.push(player);
    }
  }

  removePlayer(player: Player): void {
    this.playersSet.delete(player);
    this.players = this.players.filter((p) => p !== player);
  }

  isEmpty(): boolean {
    return this.players.length === 0;
  }

  // this mothod is for reseting the ball
  resetBall(room: Room) {
    if (room.ball === undefined) {
      return;
    }
    room.ball.position.x = this.width / 2;
    room.ball.position.y = this.height / 2;

    room.ball.speed = 10;
    if (room.ball.velocity.x < 0) {
      room.ball.velocity.x = 5;
    } else {
      room.ball.velocity.x = -5;
    }
    if (room.ball.velocity.y < 0) {
      room.ball.velocity.y = 5;
    } else {
      room.ball.velocity.y = -5;
    }
  }

  // this method is for checking if there is a collision between the ball and the player
  collision(ball: Ball, player: Player) {
    if (ball === undefined || player === undefined) {
      return false;
    }

    player.top = player.position.y;
    player.bottom = player.position.y + player.height;
    player.left = player.position.x;
    player.right = player.position.x + player.width;

    ball.top = ball.position.y - ball.radius;
    ball.bottom = ball.position.y + ball.radius;
    ball.left = ball.position.x - ball.radius;
    ball.right = ball.position.x + ball.radius;
    return (
      player.left < ball.right &&
      player.top < ball.bottom &&
      player.right > ball.left &&
      player.bottom > ball.top
    );
  }

  // this method is for updating the collision between the ball and the player
  updatePlayerCollision(ball: Ball, player: Player) {
    if (this.collision(ball, player)) {
      let collidePoint =
        ball.position.y - (player.position.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);
      const angleRad = (collidePoint * Math.PI) / 4;
      const direction = ball.position.x < this.width / 2 ? 1 : -1;

      ball.velocity.x = direction * ball.speed * Math.cos(angleRad);
      ball.velocity.y = ball.speed * Math.sin(angleRad);

      ball.speed += 0.5;
    }
  }

  // this method is the logic of the game
  // it is called when the game starts
  startGame(server: Server): void {
    const update = () => {
      if (this.state === State.FINISHED) {
        clearInterval(gameLoopInterval);
        return;
      }
      this.ball.position.x += this.ball.velocity.x;
      this.ball.position.y += this.ball.velocity.y;

      const borderSize = 10; // Adjust the border size as needed
      if (
        this.ball.position.y + this.ball.radius > this.height - borderSize ||
        this.ball.position.y - this.ball.radius < borderSize
      ) {
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

      if (this.players[0].score === 500 || this.players[1].score === 500) {
        if (this.players[0].score === 5) {
          this.winner = 1;
          server
            .to(this.players[0].socketId)
            .emit('gameOver', { winner: true });
          server
            .to(this.players[1].socketId)
            .emit('gameOver', { winner: false });
        } else if (this.players[1].score === 5) {
          this.winner = 2;
          server
            .to(this.players[1].socketId)
            .emit('gameOver', { winner: true });
          server
            .to(this.players[0].socketId)
            .emit('gameOver', { winner: false });
        }
        this.state = State.FINISHED;
        clearInterval(gameLoopInterval);
        return;
      }
      // io.to(room.id).emit('updateGame', room);
      server.to(this.id).emit('updateGame', this);
    };

    // Start the game loop with setInterval
    const gameLoopInterval = setInterval(update, 1000 / 60);
  }

  movePlayer(payload: any, server: Server): void {
    const player = this.players[payload.playerNo - 1];
    const increment = 30; // Adjust the increment as needed

    if (payload.direction === 'up') {
      player.position.y -= increment;
      player.position.y = Math.max(player.position.y, 0);
    } else if (payload.direction === 'down') {
      player.position.y += increment;
      player.position.y = Math.min(
        player.position.y,
        this.height - player.height,
      );
    }
    server.to(this.id).emit('updateGame', {
      players: this.players,
      ball: this.ball,
    });
  }

  endGame(): void {
    this.state = State.FINISHED;
  }
}
