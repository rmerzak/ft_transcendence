import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { FriendshipGateway } from './notification/gateway/friendship.gateway';
import { FriendshipService } from './notification/friendship.service';
import { NotificationController } from './notification/notification.controller';
import { GameModule } from './game/game.module';
import { NotificationService } from './notification/notification.service';
import { FriendshipController } from './notification/friendship.controller';



@Module({
  imports: [ AuthModule, UserModule, PrismaModule, ConfigModule.forRoot({isGlobal:true,}), MulterModule.register({dest : './uploads'}),GameModule],
  controllers: [NotificationController, FriendshipController],
  providers: [FriendshipGateway, FriendshipService, NotificationService],
})
export class AppModule {}
