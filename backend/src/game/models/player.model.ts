export interface Position {
  x: number;
  y: number;
}
type User = {
  id: number;
  username: string;
  email: string;
  image: string;
};

export class Player {
  socketId: any;
  playerNo: number;
  position: Position;
  user: User;
  status: string;
  width: number;
  height: number;
  color: string;
  score: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  constructor(socketId: any, user: User) {
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
    this.user = user;
    this.status = 'ONLINE';
  }
}
