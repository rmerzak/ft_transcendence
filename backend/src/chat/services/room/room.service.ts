import { Injectable } from '@nestjs/common';
import { ChatRoom, ChatRoomMember, RoomVisibility } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomUsers } from '../../interfaces/interfaces';

@Injectable()
export class RoomService {
    constructor(private readonly prisma: PrismaService) { }

    // start chat room
    // get chat room for user
    async getChatRoomsForUser(userId: number): Promise<ChatRoom[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
    
        if (!user) {
            throw new Error('User not found');
        }
    
        const chatRooms = await this.prisma.chatRoom.findMany({
            where: {
                users: {
                    some: {
                        userId: userId,
                    },
                },
            },
        });
    
        // Filter out rooms whose names start with a number
        const filteredChatRooms = chatRooms.filter(room => {
            const firstChar = room.name.charAt(0);
            return isNaN(parseInt(firstChar, 10));
        });
    
        return filteredChatRooms;
    }

    // get chat room Not for user
    async getChatRoomsNotForUser(userId: number): Promise<ChatRoom[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error('User not found');
        return await this.prisma.chatRoom.findMany({
            where: {
                users: {
                    none: {
                        userId: userId,
                    },
                },
                AND: {
                    visibility: RoomVisibility.PUBLIC,
                },
            },
        });
    }
    // get chat room by by name
    async getChatRoomByName(name: string): Promise<ChatRoom | null> {
        return await this.prisma.chatRoom.findUnique({
            where: { name },
        });
    }
    // create chat room
    async createChatRoom(chatRoomData: ChatRoom): Promise<ChatRoom> {
        if (!chatRoomData.name[0].match(/[a-zA-Z]/)) throw new Error('Chat room name must start with a letter');
        const existingChatRoom = await this.prisma.chatRoom.findUnique({
            where: { name: chatRoomData.name },
        });
        if (existingChatRoom) throw new Error('Chat room already exists');
        if (chatRoomData.hasOwnProperty('owner')) {
            const owner = await this.prisma.user.findUnique({
                where: { id: chatRoomData.owner },
            });
            if (!owner) throw new Error('Owner not found');
        }
        return await this.prisma.chatRoom.create({
            data: chatRoomData,
        });
    }
    // make conversation
    async makeConversation(userId: number, chatRoomData: ChatRoom): Promise<ChatRoom> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error('User not found');
        const existingChatRoom = await this.prisma.chatRoom.findUnique({
            where: { name: chatRoomData.name },
        });
        if (existingChatRoom) return existingChatRoom;
        try {
            return await this.prisma.chatRoom.create({
                data: chatRoomData,
            });
        }
        catch (error) {
            return null;
        }
    }
    // end make conversation

    // update chat room
    async updateChatRoom(
        id: number,
        chatRoomData: ChatRoom,
    ): Promise<ChatRoom | null> {
        return await this.prisma.chatRoom.update({
            where: { id },
            data: {
                name: chatRoomData.name,
                passwordHash: chatRoomData.passwordHash,
                visibility: chatRoomData.visibility,
            },
        });
    }
    // delete chat room
    async deleteChatRoom(id: number): Promise<ChatRoom | null> {
        try {
            const existingChatRoom = await this.prisma.chatRoom.findUnique({
                where: { id },
            });

            if (!existingChatRoom) throw new Error('Chat room not found');

            return await this.prisma.chatRoom.delete({
                where: { id },
            });
        } catch (error) {
            console.error('Error deleting chat room:', error.message);
            return null;
        }
    }
    // end chat room

    // start user chat room
    // get user chat room by id
    async getChatRoomMember(
        userId: number,
        chatRoomId: number,
    ): Promise<ChatRoomMember | null> {
        return await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId, chatRoomId } },
        });
    }
    async getChatRoomMembers(
        chatRoomId: number,
    ): Promise<ChatRoomUsers[] | null> {
        return await this.prisma.chatRoomMember.findMany({
            where: { chatRoomId: chatRoomId },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        status: true,
                    },
                },
            },
        }) as ChatRoomUsers[];
    }


    // create user chat room
    async addUserToChatRoom(
        chatRoomMemData: ChatRoomMember,
    ): Promise<ChatRoomMember> {
        const user = await this.prisma.user.findUnique({
            where: { id: chatRoomMemData.userId },
        });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomMemData.chatRoomId },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        const existingChatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
        });
        if (existingChatRoomMember) throw new Error('User already in chat room');
        return await this.prisma.chatRoomMember.create({
            data: {
                user: { connect: { id: user.id } },
                chatRoom: { connect: { id: chatRoom.id } },
                is_admin: chatRoomMemData.is_admin,
                leftAt: chatRoomMemData.leftAt,
            }
        });
    }

    // update user chat room
    async updatechatRoomMember(
        userId: number,
        chatRoomId: number,
        chatRoomMemData: ChatRoomMember,
    ): Promise<ChatRoomMember | null> {
        return await this.prisma.chatRoomMember.update({
            where: { userId_chatRoomId: { userId, chatRoomId } },
            data: chatRoomMemData,
        });
    }

    // delete user chat room
    async deletechatRoomMember(
        userId: number,
        chatRoomId: number,
    ): Promise<ChatRoomMember | null> {
        return await this.prisma.chatRoomMember.delete({
            where: { userId_chatRoomId: { userId, chatRoomId } },
        });
    }
    // end user chat room
}
