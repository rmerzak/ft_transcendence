import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { JwtGuard } from 'src/auth/guard';
import { NotificationService } from './notification.service';
import { Request } from "express";
@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationController {
    constructor(private notification: NotificationService) {}
    @Get('unread')
    async getNotifications(@Req() req: Request) {
        return this.notification.getNotifications(req.user['id']);
    }
    @Post('read/:id')
    async readNotification(@Req() req: Request) {
        return this.notification.readNotification(req.user['id'], Number(req.params.id));
    }
}
