import { Injectable } from '@nestjs/common';
import { Blocker, FriendshipStatus, RequestType, User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './Dto';

@Injectable()
export class FriendshipService {
    constructor(private prisma: PrismaService) { }
    public readonly connectedClients: Map<number, Socket[]> = new Map(); // must change to private its just for testing

    async handleConnection(socket: Socket): Promise<void> {
        const clientId = socket.id;
        let payload = socket['payload'];
        let user = await this.prisma.user.findUnique({ where: { email: payload['email'] } });
        const userId = user?.id;
        if (!this.connectedClients.has(userId)) {
            this.connectedClients.set(userId, []);
        }

        this.connectedClients.get(userId).push(socket);
        console.log('connected client', this.connectedClients.size);
    }

    handleDisconnect(socket: Socket): void {
        const userId = socket['payload']['sub'];
        const sockets = this.connectedClients.get(userId);
        if (sockets) {
            const index = sockets.indexOf(socket);
            if (index !== -1) {
                sockets.splice(index, 1);
            }
            if (sockets.length === 0) {
                this.connectedClients.delete(userId);
            }
        }
    }
    getSocketsByUser(userId: number): any {
        return this.connectedClients.get(userId) || [];
    }
    async CreateNotification(socket: Socket, userId: number, type: string, content: string, RequestId: number) {
        //type: 'friendRequest' | 'friendRequestAccepted' | 'friendRequestRejected' | 'friendRequestCanceled' | 'friendRequestDeleted' | 'friendRequestBlocked' | 'friendRequestUnblocked' | 'friendRequestUnfriended' | 'friendRequestUnblocked'
        const Receiver = await this.prisma.user.findUnique({ where: { id: userId } });
        const Sender = await this.prisma.user.findUnique({ where: { id: socket['payload']['sub'] } });
        const notification = await this.prisma.notification.create({
            data: {
                type: type,
                content: content,
                RequestId: RequestId,
                userId: Receiver.id,
                senderId: Sender.id,
                RequestType: RequestType.FRIENDSHIP
            }
        });
        return notification;
    }
    async CreateFriendRequest(socket: Socket, userId: number) {
        const senderId = socket['payload']['sub'];
        if (senderId === userId) throw new Error('cannot send friend request to yourself');
        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { senderId, receiverId: userId },
                    { senderId: userId, receiverId: senderId },
                ],
            },
        });
        if (existingFriendship) {
            throw new Error('Friendship request already sent or accepted');
        }
        if 
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('user not found');
        const friendRequest = await this.prisma.friendship.create({
            data: {
                status: FriendshipStatus.PENDING,
                senderId: socket['payload']['sub'],
                receiverId: userId
            }
        });
        return friendRequest.id;
    }
    async AcceptFriendRequest(socket: Socket, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('user not found');
        const friendRequest = await this.prisma.friendship.findFirst({ where: { senderId: userId, receiverId: socket['payload']['sub'] } });
        if (!friendRequest) throw new Error('friend request not found');
        if (friendRequest.status === FriendshipStatus.ACCEPTED || friendRequest.block === true) throw new Error('friend request already accepted or rejected');
        const friendRequestAccepted = await this.prisma.friendship.update({
            where: { id: friendRequest.id }, data: {
                status: FriendshipStatus.ACCEPTED,
            }
        });
        return friendRequestAccepted.id;

    }

    async RefuseFriendRequest(socket: Socket, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('user not found');
        const friendRequest = await this.prisma.friendship.findFirst({ where: { senderId: userId, receiverId: socket['payload']['sub'] } });
        if (!friendRequest) throw new Error('friend request not found');
        if (friendRequest.status === FriendshipStatus.DECLINED || friendRequest.status === FriendshipStatus.ACCEPTED) throw new Error('friend request already accepted or rejected');
        const friendRequestRefused = await this.prisma.friendship.update({
            where: { id: friendRequest.id }, data: {
                status: FriendshipStatus.DECLINED,
            }
        });
        return friendRequestRefused.id;
    }

    async RemoveFriend(socket: Socket, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('user not found');
        const friendRequest = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { senderId: userId, receiverId: socket['payload']['sub'] },
                    { senderId: socket['payload']['sub'], receiverId: userId }
                ]
            }
        });
        if (!friendRequest) throw new Error('friend request not found');
        if (friendRequest.status !== FriendshipStatus.ACCEPTED) throw new Error('friend request not accepted');
        const friendRequestRemoved = await this.prisma.friendship.delete({
            where: { id: friendRequest.id }
        });
        console.log(friendRequestRemoved);
        return friendRequestRemoved;
    }

    async BlockFriend(socket: Socket, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        console.log(userId,socket['payload']['sub']);
        if (!user) throw new Error('user not found');
        const friendRequest = await this.prisma.friendship.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: socket['payload']['sub'] },
                { senderId: socket['payload']['sub'], receiverId: userId }
              ]
            }
          });
          console.log(friendRequest);
        if (!friendRequest) throw new Error('friend request not found 1');
        if(friendRequest.block === true) throw new Error('friend request already blocked');
        const friendRequestBlocked = await this.prisma.friendship.update({
            where: { id: friendRequest.id },
            data: {
                block: true,
                blockBy: user.id !== friendRequest.senderId ? Blocker.SENDER : Blocker.RECEIVER
            }
        });
    }
    async UnBlockFriend(socket: Socket, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('user not found');
        const friendRequest = await this.prisma.friendship.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: socket['payload']['sub'] },
                { senderId: socket['payload']['sub'], receiverId: userId }
              ]
            }
          });
        if (!friendRequest) throw new Error('friend request not found');
        if(friendRequest.block === false) throw new Error('friend request not blocked');
        if(friendRequest.blockBy === Blocker.SENDER && friendRequest.senderId !== socket['payload']['sub']) throw new Error('friend request not blocked by you');
        if(friendRequest.blockBy === Blocker.RECEIVER && friendRequest.receiverId !== socket['payload']['sub']) throw new Error('friend request not blocked by you');
        const friendRequestUnblocked = await this.prisma.friendship.update({
            where: { id: friendRequest.id },
            data: {
                block: false,
                blockBy: null
            }
        });
        return friendRequestUnblocked;
    }

}