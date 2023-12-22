import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  providers: [GatewayGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
