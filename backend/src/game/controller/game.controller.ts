import { Body, Controller, Post, Sse, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { PlayerDto } from '../dto/player.dto';
import { JwtGuard } from 'src/auth/guard';
import { Observable, startWith } from 'rxjs';
import { Mode } from '../models/state.model';

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
  constructor(private readonly game: GameService) {}

  @Post('api/rooms')
  createRoom(): { roomId: string } {
    const room = this.game.roomWithAvailableSlots() || this.game.createRoom(Mode.NORMAL);
    return { roomId: room.id };
  }

  @Post('api/rooms-challenge')
  createChallengeRoom(@Body() id: PlayerDto): { roomId: string } {
    const { playerId } = id;
    console.log('playerId', playerId);
    const room = this.game.createRoom(Mode.CHALLENGE);
    room.setInvitedId(playerId);
    return { roomId: room.id };
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
    console.log('id', id);
    const { playerId } = id;
    const matchHistory = await this.game.getMatchHistory(playerId);
    return { matchHistory };
  }

  @Sse('api/is-playing')
  sse(): Observable<string> {
    // Send the current state immediately
    const initialState = this.game.getIsPlayingData();

    // Return the observable for future updates, starting with the initial state
    return this.game.sseSubject.pipe(startWith(initialState));
  }
}
