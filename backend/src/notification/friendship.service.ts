import { Injectable } from '@nestjs/common';
import { Blocker, FriendshipStatus, RequestType, User, UserStatus } from '@prisma/client';
import { stat } from 'fs';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
    constructor(private prisma: PrismaService) { }
    public readonly connectedClients: Map<number, Socket[]> = new Map(); // must change to private its just for testing

    async handleConnection(socket: Socket): Promise<void> {
        try{
            const clientId = socket.id;
            let payload = socket['payload'];
            let user = await this.prisma.user.findUnique({ where: { email: payload['email'] } });
            const userId = user?.id;
            await this.prisma.user.update({where:{id:userId},data:{status:UserStatus.ONLINE}});
            if (!this.connectedClients.has(userId)) {
                this.connectedClients.set(userId, []);
            }
    
            this.connectedClients.get(userId).push(socket);
            // print socket id
            console.log('connected notification id : ' + clientId);
        } catch(error) {
            throw new Error(error.message);
        }
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const userId = socket['payload']['sub'];
        const sockets = this.connectedClients.get(userId);
        if (sockets) {
            const index = sockets.indexOf(socket);
            if (index !== -1) {
                sockets.splice(index, 1);
            }
            if (sockets.length === 0) {
                await this.prisma.user.update({where:{id:userId},data:{status:UserStatus.OFFLINE}});
                this.connectedClients.delete(userId);
            }
        }
    }
    getSocketsByUser(userId: number): any {
        return this.connectedClients.get(userId) || [];
    }
    async CreateNotification(socket: Socket, user: any, type: string, content: string, requestId: number, requestType: RequestType) {
        //type: 'friendRequest' | 'friendRequestAccepted' | 'friendRequestRejected' | 'friendRequestCanceled' | 'friendRequestDeleted' | 'friendRequestBlocked' | 'friendRequestUnblocked' | 'friendRequestUnfriended' | 'friendRequestUnblocked'
        console.log(' i  m herre');
        const Receiver = await this.prisma.user.findUnique({ where: { id: user } });
        const Sender = await this.prisma.user.findUnique({ where: { id: socket['payload']['sub'] } });
        const notification = await this.prisma.notification.create({
            data: {
                type: type,
                content: content,
                RequestId: requestId ? requestId : 0, /// must work on it
                Receiver: { connect: { id: Receiver?.id } },
        sender: { connect: { id: Sender?.id } },
                RequestType: requestType, 
                vue: false,
                senderName: Sender?.username,
                senderImage: Sender?.image,
                createdAt: new Date(),
            } as any
        });
        console.log('notification', notification);
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

    // async RefuseFriendRequest(socket: Socket, userId: number) {
    //     const user = await this.prisma.user.findUnique({ where: { id: userId } });
    //     if (!user) throw new Error('user not found');
    //     const friendRequest = await this.prisma.friendship.findFirst({ where: { senderId: userId, receiverId: socket['payload']['sub'] } });
    //     if (!friendRequest) throw new Error('friend request not found');
    //     if (friendRequest.status === FriendshipStatus.DECLINED || friendRequest.status === FriendshipStatus.ACCEPTED) throw new Error('friend request already accepted or rejected');
    //     const friendRequestRefused = await this.prisma.friendship.update({
    //         where: { id: friendRequest.id }, data: {
    //             status: FriendshipStatus.DECLINED,
    //         }
    //     });
    //     return friendRequestRefused.id;
    // }

    async RemoveFriend(socket: Socket, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        console.log('user', user);
        console.log('socket', socket['payload']['sub']);
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
        console.log('i m herre 2');
        const friendRequestRemoved = await this.prisma.friendship.delete({
            where: { id: friendRequest.id }
        });
        return friendRequestRemoved;
    }

    async BlockFriend(socket: Socket, userId: number) {
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
        if (!friendRequest) throw new Error('friend request not found 1');
        if(friendRequest.block === true) throw new Error('friend request already blocked');
        const friendRequestBlocked = await this.prisma.friendship.update({
            where: { id: friendRequest.id },
            data: {
                block: true,
                blockBy: user.id !== friendRequest.senderId ? Blocker.SENDER : Blocker.RECEIVER,
                status: FriendshipStatus.BLOCKED,
            }
        });
        return friendRequestBlocked;
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
                blockBy: null,
                status: FriendshipStatus.ACCEPTED,
            }
        });
        return friendRequestUnblocked;
    }
    async getFriendship(userId: number, friendId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('user not found');
        const friend = await this.prisma.user.findUnique({ where: { id: friendId } });
        if (!friend) throw new Error('friend not found');
        const friendRequest = await this.prisma.friendship.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId }
              ]
            },
            select:{
                status:true,
                block:true,
                blockBy:true,
                senderId:true,
                receiverId:true,
            }
          });
        if (!friendRequest) throw new Error('friend request not found');
        return friendRequest;
    }

    async getFriendListByUserId(userId:number) {
        const user = this.prisma.user.findUnique({where:{id:userId}});
        if(!user) throw new Error('user not found');
        const friendList = await this.prisma.friendship.findMany({
            where:{
                OR:[
                    {senderId:userId},
                    {receiverId:userId},
                ]
            },
            select:{
                id:true,
                senderId:true,
                receiverId:true,
                createdAt:true,
                updateAt:true,
                status:true,
                block:true,
                blockBy:true,
                sender:{
                    select:
                    {
                        id:true,
                        username:true,
                        image:true,
                        status:true,
                    }
                },
                receiver:{
                    select:
                    {
                        id:true,
                        username:true,
                        image:true,
                        status:true,
                    }
                }
            }
        });
        return friendList;
    }

}