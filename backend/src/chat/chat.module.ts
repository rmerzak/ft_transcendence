import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    GatewayGateway,
    ChatService,
    { provide: 'PrismaClient', useValue: new PrismaClient() },
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
