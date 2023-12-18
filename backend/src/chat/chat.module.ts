import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
// import { ChatService } from './chat.service';

@Module({
  providers: [GatewayGateway],
})
export class ChatModule {}
