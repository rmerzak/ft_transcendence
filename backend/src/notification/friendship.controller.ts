import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { FriendshipService } from './friendship.service';
import { Request } from "express";
@Controller('friendship')
@UseGuards(JwtGuard)
export class FriendshipController {
    constructor(private friendship:FriendshipService) {}
    @Get('status/:id')
    async getStatus(@Req() req: Request) {
        try {
            const status = await this.friendship.getStatus(req.user['id'], Number(req.params.id));
            return status;
        } catch (error) {
            return error.message;
        }
    }
}
