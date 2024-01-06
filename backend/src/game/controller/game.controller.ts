import { Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from '../services/game.service';

@Controller()
export class GameController {
  constructor(private readonly game: GameService) {}

  @Get('/:id')
  getGame(@Param('id') roomId: string): string {
    console.log(roomId);
    return this.game.getGame(roomId);
  }

  @Post('api/rooms')
  createRoom(): { roomId: string } {
    const room = this.game.roomWithAvailableSlots() || this.game.createRoom();
    return { roomId: room.id };
  }
}
