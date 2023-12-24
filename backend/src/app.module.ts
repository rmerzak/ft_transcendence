import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { FriendshipGateway } from './friendship/gateway/friendship.gateway';
import { FriendshipService } from './friendship/friendship.service';
import { FriendshipController } from './friendship/friendship.controller';



@Module({
  imports: [ AuthModule, UserModule, PrismaModule, ConfigModule.forRoot({isGlobal:true,}), MulterModule.register({dest : './uploads'})],
  controllers: [FriendshipController],
  providers: [FriendshipGateway, FriendshipService],
})
export class AppModule {}
