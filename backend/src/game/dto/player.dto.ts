import { IsNumber } from 'class-validator';

export class PlayerDto {
  @IsNumber()
  playerId: number;
}
