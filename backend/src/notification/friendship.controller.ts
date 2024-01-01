import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { FriendshipService } from './friendship.service';
import { Request } from "express";
@Controller('friendship')
@UseGuards(JwtGuard)
export class FriendshipController {
    constructor(private friendship:FriendshipService) {}
    @Get('status/:id')
    async getFriendshipStatus(@Req() req: Request) {
        try {
            const friendship = await this.friendship.getFriendship(req.user['id'], Number(req.params.id));
            return friendship;
        } catch (error) {
            return error.message;
        }
    }
    @Get('friendlist/:id')
    async getFriendList(@Req() req : Request) {
        console.log("i m here")
        try {
            const friendlist = await this.friendship.getFriendListByUserId(req.user['id']);
            return friendlist;
        } catch (error) {
            return error.message;
        }
    }
}
