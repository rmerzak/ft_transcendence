import { Body, Controller, Post, Sse, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { PlayerDto } from '../dto/player.dto';
import { JwtGuard } from 'src/auth/guard';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

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
    username: string;
    image: string;
  };
  opponent: {
    username: string;
    image: string;
  };
};

@Controller()
@UseGuards(JwtGuard)
export class GameController {
  constructor(
    private readonly game: GameService,
    private readonly prisma: PrismaService,
  ) {}

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

  // @Sse('api/is-playing')
  // sse(): Observable<string> {
  //   return new Observable<string>((observer) => {
  //     // You can adjust the interval based on your requirements
  //     const intervalId = setInterval(() => {
  //       const isPlayingData = Array.from(
  //         this.game.playerStatusMap.entries(),
  //       ).map(([playerId, isPlaying]) => ({ playerId, isPlaying }));

  //       const formattedData = JSON.stringify(isPlayingData);
  //       observer.next(formattedData);
  //     }, 1000);

  //     // Cleanup function to close the interval when the connection is closed
  //     return () => clearInterval(intervalId);
  //   });
  // }
  @Sse('api/is-playing')
  sse(): Observable<string> {
    return this.game.sseSubject.asObservable();
  }
}
