import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy, LeetStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports:[PrismaModule,JwtModule.register({}),PassportModule.register({ session: false })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,LeetStrategy]
})
export class AuthModule{}