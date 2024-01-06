export interface Position {
  x: number;
  y: number;
}

export class Player {
  socketId: any;
  playerNo: number;
  position: Position;
  width: number;
  height: number;
  color: string;
  score: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  constructor(socketId: any) {
    this.socketId = socketId;
    this.playerNo = 0;
    this.position = {
      x: 0,
      y: 0,
    };
    this.width = 15;
    this.height = 180;
    this.color = 'white';
    this.score = 0;
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
  }
}
