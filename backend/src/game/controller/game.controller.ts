import { Body, Controller, Post, Sse, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { PlayerNameDto, RoomDto } from '../dto/game.dto';
import { JwtGuard } from 'src/auth/guard';
import { Observable, startWith } from 'rxjs';
import { Leaderboard, MatchHistory, Statistics } from '../types/types';

@Controller()
@UseGuards(JwtGuard)
export class GameController {
  constructor(private readonly game: GameService) {}

  // api for creating a room
  @Post('api/rooms')
  createRoom(): { roomId: string } {
    const room = this.game.roomWithAvailableSlots() || this.game.createRoom();
    return { roomId: room.id };
  }

  // api for creating a challenge room
  @Post('api/rooms-challenge')
  createChallengeRoom(): { roomId: string } {
    const room = this.game.createChallengeRoom();
    return { roomId: room.id };
  }

  // api for check if room available
  @Post('api/check-room')
  checkRoom(@Body() rm: RoomDto): { check: boolean } {
    const { roomId } = rm;
    const { roomMode } = rm;
    const room = this.game.getRoom(roomId, roomMode);
    if (room === undefined) {
      return { check: false };
    }
    return { check: true };
  }

  // api for get statistics
  @Post('api/statistics')
  async getStatistics(
    @Body() username: PlayerNameDto,
  ): Promise<{ statistics: Statistics }> {
    const { playerName } = username;
    const statistics = await this.game.getStatistics(playerName);
    return { statistics };
  }

  // api for get match history
  @Post('api/match-history')
  async getMatchHistory(
    @Body() username: PlayerNameDto,
  ): Promise<{ matchHistory: MatchHistory[] }> {
    const { playerName } = username;
    const matchHistory = await this.game.getMatchHistory(playerName);
    return { matchHistory };
  }

  // api for get leaderboard
  @Post('api/leaderboard')
  async getLeaderboard(): Promise<{ leaderboard: Leaderboard[] }> {
    const leaderboard = await this.game.getLeaderboard();
    return { leaderboard };
  }

  // api for get achievements
  @Post('api/achievements')
  async getAchievements(
    @Body() username: PlayerNameDto,
  ): Promise<{ achievements: string[] }> {
    const { playerName } = username;
    const achievements = await this.game.getAchievements(playerName);
    return { achievements };
  }

  // api for check if player playing
  @Sse('api/is-playing')
  sse(): Observable<string> {
    // Send the current state immediately
    const initialState = this.game.getIsPlayingData();

    // Return the observable for future updates, starting with the initial state
    // this.game.sseSubject.setMaxListeners(20);
    return this.game.sseSubject.pipe(startWith(initialState));
  }
}
