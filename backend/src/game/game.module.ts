import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameGateway } from './gateway/game.gateway';
import { GameController } from './controller/game.controller';

@Module({
  providers: [GameService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}
