import { IsNumber, IsString } from 'class-validator';

export class PlayerDto {
  @IsNumber()
  playerId: number;
}

export class RoomDto {
  @IsString()
  roomId: string;

  @IsNumber()
  roomMode: number;
}

export class PlayerNameDto {
  @IsString()
  playerName: string;
}
