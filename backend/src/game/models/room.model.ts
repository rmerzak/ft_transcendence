import { Player } from './player.model';
import { State } from './state.model';

// interface Ball {
//   position: Position;
//   velocity: Position;
//   radius: number;
//   color: string;
//   speed: number;
// }

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
  players: Map<string, Player> = new Map();
  // ball: Ball;
  winner: number;
  // width: number;
  // height: number;
  constructor(id: number) {
    this.id = id;
    this.state = State.WAITING;
    // this.width = width;
    // this.height = height;
    // this.ball = ball;
    this.winner = 0;
  }

  addPlayer(player: Player): boolean {
    if (!this.players.has(player.socketId)) {
      this.players.set(player.socketId, player);
      return true;
    }
    return false;
  }

  removePlayer(socketId: string): void {
    this.players.delete(socketId);
  }

  isEmtpy(): boolean {
    return this.players.size === 0;
  }
}
