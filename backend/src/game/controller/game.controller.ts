import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { PlayerDto } from '../dto/player.dto';

type Statistics = {
  gameMatches: number;
  gameWins: number;
  gameLoses: number;
  gameElo: number;
};

@Controller()
export class GameController {
  constructor(private readonly game: GameService) {}

  @Post('api/rooms')
  createRoom(): { roomId: string } {
    const room = this.game.roomWithAvailableSlots() || this.game.createRoom();
    return { roomId: room.id };
  }

  @Post('api/players')
  isPlayerPlaying(@Body() playerDto: PlayerDto): { isPlaying: boolean } {
    const { playerId } = playerDto;
    const isPlaying = this.game.isPlayerPlaying(playerId);
    return { isPlaying };
  }

  @Post('api/statistics')
  async getStatistics(
    @Body() playerDto: PlayerDto,
  ): Promise<{ statistics: Statistics }> {
    const { playerId } = playerDto;
    const statistics = await this.game.getStatistics(playerId);
    return { statistics };
  }
}
