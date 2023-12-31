export interface Position {
  x: number;
  y: number;
}

export interface Player {
  socketId: any;
  playerNo: number;
  position: Position;
  width: number;
  height: number;
  color: string;
  score: number;
}
