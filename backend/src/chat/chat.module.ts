import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/chat.gateway';
import { MsgService } from './services/msg/msg.service';
import { ChatController } from './chat.controller';
import { RoomService } from './services/room/room.service';
import { FriendshipService } from 'src/notification/friendship.service';

@Module({
  providers: [GatewayGateway, MsgService, RoomService, FriendshipService],
  controllers: [ChatController],
  exports: [MsgService, RoomService],
})
export class ChatModule {}
