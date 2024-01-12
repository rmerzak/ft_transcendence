import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { MsgService } from './services/msg/msg.service';
import { ChatController } from './chat.controller';
import { RoomService } from './services/room/room.service';

@Module({
  providers: [GatewayGateway, MsgService, RoomService],
  controllers: [ChatController],
  exports: [MsgService, RoomService],
})
export class ChatModule {}
