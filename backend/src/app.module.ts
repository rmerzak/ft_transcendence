import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { GameModule } from './game/game.module';



@Module({
  imports: [ AuthModule, UserModule, PrismaModule, ConfigModule.forRoot({isGlobal:true,}), MulterModule.register({dest : './uploads'}), GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
