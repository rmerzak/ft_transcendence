import { Position } from './player.model';

export class Ball {
  position: Position;
  velocity: Position;
  radius: number;
  speed: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  constructor(width: number) {
    this.position = {
      x: width / 2,
      y: width / 2,
    };
    this.velocity = {
      x: 5,
      y: 5,
    };
    this.radius = 20;
    this.speed = 10;
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
  }
}
