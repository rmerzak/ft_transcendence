import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { PlayerDto } from '../dto/player.dto';
import { JwtGuard } from 'src/auth/guard';

type Statistics = {
  gameMatches: number;
  gameWins: number;
  gameLoses: number;
  gameElo: number;
};

type MatchHistory = {
  userPlayerId: number;
  userOpponentId: number;
  userScore: number;
  oppScore: number;
  user: {
    id: number;
    username: string;
    email: string;
    image: string;
  };
  opponent: {
    id: number;
    username: string;
    email: string;
    image: string;
  };
};

@Controller()
@UseGuards(JwtGuard)
export class GameController {
  constructor(private readonly game: GameService) {}

  @Post('api/rooms')
  createRoom(): { roomId: string } {
    const room = this.game.roomWithAvailableSlots() || this.game.createRoom();
    return { roomId: room.id };
  }

  @Post('api/players')
  isPlayerPlaying(@Body() id: PlayerDto): { isPlaying: boolean } {
    const { playerId } = id;
    const isPlaying = this.game.isPlayerPlaying(playerId);
    return { isPlaying };
  }

  @Post('api/statistics')
  async getStatistics(
    @Body() id: PlayerDto,
  ): Promise<{ statistics: Statistics }> {
    const { playerId } = id;
    const statistics = await this.game.getStatistics(playerId);
    return { statistics };
  }

  @Post('api/match-history')
  async getMatchHistory(
    @Body() id: PlayerDto,
  ): Promise<{ matchHistory: MatchHistory[] }> {
    const { playerId } = id;
    const matchHistory = await this.game.getMatchHistory(playerId);
    return { matchHistory };
  }
}
