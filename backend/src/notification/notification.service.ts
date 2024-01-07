import { Injectable } from '@nestjs/common';
import { Blocker, FriendshipStatus, RequestType, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './Dto';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        const notifications = await this.prisma.notification.findMany({
            where: {
                userId: userId,
                vue: false,
            },
            orderBy: {
                createdAt: 'desc'
            }});
        return notifications;
    }
    async readNotification(userId: number, notificationId: number) {
        const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
        if (!notification)
            throw new Error("Notification not found");
        if (notification.userId != userId)
            throw new Error("Notification not found");
        const notificationUpdate = await this.prisma.notification.update({
            where: { id: notificationId },
            data: {
                vue: true,
            }
        });
        return notificationUpdate;
    }
}