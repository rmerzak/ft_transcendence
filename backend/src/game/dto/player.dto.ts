import { IsNumber, IsString } from 'class-validator';

export class PlayerDto {
  @IsNumber()
  playerId: number;
}

export class PassDto {
  @IsString()
  password: string;
}
