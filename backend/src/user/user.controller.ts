import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator/auth.decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService : UserService) { }
    @Get('me')
    getMe(@GetUser('id') user){
        return user;
    }

    @Get('search/:username')
    async searchUser(@Req() req: Request, @Param('username') username: string) {
        return this.userService.searchUser(username, req.user['username']);
    }
    @Get('profile/:username')
    async getUserProfile(@Req() req: Request, @Param('username') username: string) {
        return this.userService.getUserProfile(username, req.user['username']);
    }

    @Get('user/:id')
    async getUserProfileById(@Param('id') id: number) {
        return this.userService.getUserProfileById(Number(id));
    }
}
