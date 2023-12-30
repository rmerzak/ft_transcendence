import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from './chat/chat.module';
import { NotificationController } from './notification/notification.controller';
import { FriendshipController } from './notification/friendship.controller';
import { FriendshipGateway } from './notification/gateway/friendship.gateway';
import { FriendshipService } from './notification/friendship.service';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: './uploads' }),
    ChatModule,
  ],
  controllers: [NotificationController, FriendshipController],
  providers: [FriendshipGateway, FriendshipService, NotificationService],
})
export class AppModule {}
