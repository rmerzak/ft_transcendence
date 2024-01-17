import { Body, Controller, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { PlayerDto } from '../dto/player.dto';
import { JwtGuard } from 'src/auth/guard';
import { Observable, Subject, interval, map, startWith, tap } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

export interface MessageEvent {
  data: boolean;
}

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
  constructor(private readonly game: GameService, private readonly prisma:PrismaService) {}

  @Post('api/rooms')
  async createRoom(@Req() req: Request): Promise<{ roomId: string, status: boolean }> {
    try {
      const user = await this.prisma.user.findUnique({where:{id:req['user'].id}})
      if (user.status === 'INGAME')
        return { roomId: null, status: false };
      console.log("user",user);
      const room = this.game.roomWithAvailableSlots() || this.game.createRoom();
      return { roomId: room.id, status: true};
    } catch (error) {
      throw new Error(error.message);
    }
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
  // sse (@Req() req: Request): Observable<MessageEvent> {
  //   // retuen this.game.isPlayerPlaying(playerId);
  //   // console.log(req['user'].id);
  //   const isPlaying = this.game.isPlayerPlaying(req['user'].id);
  //   console.log(isPlaying)
  //   return interval(1000).pipe(map((_) => ({ data: JSON.stringify({ isPlaying: false }) })));
  // }

  @Sse('api/is-playing')
  sse(@Req() req: Request): Observable<string> {
    console.log(req['user']);
    const playerId = req['user'].id;
    const isPlayingSubject = new Subject<boolean>();

    const initialIsPlaying = this.game.isPlayerPlaying(playerId);

    // Ensure event listener is registered before starting the stream
    this.game.onPlayerStatusChange(playerId, (newIsPlaying: boolean) => {
      isPlayingSubject.next(newIsPlaying);
    });

    return isPlayingSubject.asObservable().pipe(
      startWith(initialIsPlaying),
      map((isPlaying) => `data: ${JSON.stringify({ isPlaying })}`),
    );
  }
}