import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';

@Module({
  providers: [GatewayGateway],
})
export class ChatModule {}
