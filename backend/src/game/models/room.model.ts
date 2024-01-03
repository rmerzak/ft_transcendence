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

// export interface options {
//     width: number;
//     height: number;
//     players: Array<Player>;
//     ball: Ball;
//     winner: number;
// }

export class Room {
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
        x: 1908 / 2,
        y: 1908 / 2,
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
}
