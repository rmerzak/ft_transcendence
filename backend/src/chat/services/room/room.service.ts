import { Injectable } from '@nestjs/common';
import { ChatRoom, ChatRoomMember, RoomVisibility, RoomStatus, RoomReqJoin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomUsers } from '../../interfaces/interfaces';
import { Socket } from 'socket.io';
import * as argon from 'argon2';

@Injectable()
export class RoomService {
    constructor(private readonly prisma: PrismaService) { }

    // start chat room
    // get chat room for user
    public readonly connectedClients: Map<number, Socket[]> = new Map(); // must change to private its just for testing
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
            select: {
                id: true,
                name: true,
                visibility: true,
                owner: true,
                createdAt: true,
                updatedAt: true,
            },
        }) as ChatRoom[];

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

        const chatRooms = await this.prisma.chatRoom.findMany({
            where: {
                users: {
                    none: {
                        userId: userId,
                    },
                },
                visibility: {
                    in: [RoomVisibility.PUBLIC, RoomVisibility.PROTECTED],
                },
            },
        });
        return chatRooms;
    }


    // get friends in chat room
    async getFriendsInChatRoom(userId: number, chatRoomId: number): Promise<ChatRoomUsers[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
        });
        if (!chatRoomMember) throw new Error('User not in chat room');
        const roomMember = await this.prisma.chatRoomMember.findMany({
            where: {
                chatRoomId: chatRoomId,
                userId: {
                    not: userId,
                },
            },
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

        return roomMember;
    }
    // get chat room by by name
    async getChatRoomByName(name: string): Promise<ChatRoom | null> {
        return await this.prisma.chatRoom.findUnique({
            where: { name },
            select: {
                id: true,
                name: true,
                visibility: true,
                owner: true,
                createdAt: true,
                updatedAt: true,
            },
        }) as ChatRoom | null;
    }
    // get chat room by by id
    async getChatRoomById(id: number): Promise<ChatRoom | null> {
        if (!id) throw new Error('Chat room id not provided');
        try {
            return await this.prisma.chatRoom.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    visibility: true,
                    owner: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }) as ChatRoom | null;
        } catch (error) {
            console.error('Error getting chat room by id:', error.message);
            return null;
        }
    }
    // create chat room
    async createChatRoom(socket: Socket, chatRoomData: ChatRoom): Promise<ChatRoom> {
        // console.log('chatRoomData: ', chatRoomData);
        // if (!chatRoomData.name[0].match(/[a-zA-Z]/)) throw new Error('Chat room name must start with a letter');
        chatRoomDataValidation(chatRoomData);
        const existingChatRoom = await this.prisma.chatRoom.findUnique({
            where: { name: chatRoomData.name },
        });
        if (existingChatRoom) throw new Error('Chat room already exists');
        let hash = null;
        if (chatRoomData.passwordHash) {
            hash = await argon.hash(chatRoomData.passwordHash);
        }
        const newChatRoom = await this.prisma.chatRoom.create({
            data: {
                name: chatRoomData.name,
                passwordHash: (chatRoomData.visibility === RoomVisibility.PROTECTED && hash !== null) ? hash : null,
                visibility: chatRoomData.visibility,
                owner: socket['user'].id,
            },
        });
        // add user to chat room
        await this.prisma.chatRoomMember.create({
            data: {
                user: { connect: { id: socket['user'].id } },
                chatRoom: { connect: { id: newChatRoom.id } },
                is_admin: true,
            }
        });
        return newChatRoom;
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
    async updateChatRoom(userId: number, chatRoomData: ChatRoom): Promise<ChatRoom | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error('User not found');
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomData.id },
            select: {
                passwordHash: true,
                visibility: true,
                owner: true,
            },
        });
        const chatRoom = await this.prisma.chatRoom.findFirst({
            where: { name: chatRoomData.name, NOT: { id: chatRoomData.id } },
        });
        if (chatRoom) throw new Error('Chat room already exists');
        chatRoomDataValidation(chatRoomData);
        if (!room) throw new Error('Chat room not found');
        if (room.owner !== user.id || user.id !== chatRoomData.owner) throw new Error('you are not the owner of this chat room');
        if (room.visibility !== RoomVisibility.PROTECTED) {
            if (chatRoomData.visibility === RoomVisibility.PROTECTED && (chatRoomData.passwordHash === null || chatRoomData.passwordHash === ''
                || chatRoomData.visibility === undefined)) throw new Error('Chat room password not set');
            else if (chatRoomData.visibility === RoomVisibility.PROTECTED && (chatRoomData.passwordHash !== null || chatRoomData.passwordHash !== ''))
                chatRoomData.passwordHash = await argon.hash(chatRoomData.passwordHash);
            else
                chatRoomData.passwordHash = null;
        } else if (room.visibility === RoomVisibility.PROTECTED) {
            
            if (chatRoomData.visibility === RoomVisibility.PROTECTED && (chatRoomData.passwordHash === null
                || chatRoomData.passwordHash === '' || chatRoomData.visibility === undefined)) {
                chatRoomData.passwordHash = room.passwordHash;
            } else if (chatRoomData.visibility === RoomVisibility.PROTECTED && (chatRoomData.passwordHash !== null || chatRoomData.passwordHash !== '')) {
                chatRoomData.passwordHash = await argon.hash(chatRoomData.passwordHash);
            } else
                chatRoomData.passwordHash = null;
        }
        return await this.prisma.chatRoom.update({
            where: { id: chatRoomData.id },
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
                is_admin: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        status: true,
                    },
                }
            },
            orderBy: {
                joinedAt: 'asc',
            }
        }) as ChatRoomUsers[];
    }


    // add user to chat room
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
                status: RoomStatus.NORMAL,
                mutedDuration: chatRoomMemData.mutedDuration,
            }
        });
    }

    // update user chatroom
    async updatechatRoomMember(fromUserI: number, onUser: number, chatRoomMemData: ChatRoomMember): Promise<ChatRoomMember | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: fromUserI },
        });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomMemData.chatRoomId },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: {
                userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id },
            },
            select: {
                is_admin: true,
                leftAt: true,
                status: true,
                mutedDuration: true,
                chatRoomId: true,
                userId: true,
                chatRoom: {
                    select: {
                        owner: true,
                    },
                },
            },
        });
        if (!chatRoomMember) throw new Error('User not in chat room');
        if (chatRoomMember.chatRoom.owner !== user.id || !chatRoomMember.is_admin) throw new Error('User not allowed to update chat room member');
        const userToUpdate = await this.prisma.user.findUnique({ where: { id: onUser } });
        if (!userToUpdate) throw new Error('User not found');
        if (chatRoomMember.userId === userToUpdate.id) throw new Error('User not allowed to update himself');
        const isexist = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: userToUpdate.id, chatRoomId: chatRoom.id } },
        });
        if (chatRoomMember.chatRoom.owner === isexist.userId || isexist.is_admin) throw new Error('You can not update admin or owner');
        return await this.prisma.chatRoomMember.update({
            where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
            data: {
                is_admin: chatRoomMemData.is_admin,
                leftAt: chatRoomMemData.leftAt,
                status: chatRoomMemData.status,
                mutedDuration: chatRoomMemData.mutedDuration,
            },
        });
    }


    // remove user from chat room
    async deletechatRoomMember(
        userId: number,
        chatRoomId: number,
    ): Promise<ChatRoomMember | null> {
        return await this.prisma.chatRoomMember.delete({
            where: { userId_chatRoomId: { userId, chatRoomId } },
        });
    }
    // add user to chat room
    async addMemberToRoom(_client: Socket, payload: ChatRoom): Promise<any> {
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { name: payload.name },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        if (chatRoom.visibility === 'PROTECTED') {
            console.log('chatRoom.passwordHash: ', payload.passwordHash);
            if (payload.passwordHash === null || payload.passwordHash === undefined) throw new Error('Chat room password not set');
            const isPasswordValid = await argon.verify(chatRoom.passwordHash, payload.passwordHash);
            console.log('isPasswordValid: ', isPasswordValid);
            if (!isPasswordValid) throw new Error('Invalid password');
        }
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: _client['user'].id, chatRoomId: chatRoom.id } },
        });
        console.log('chatRoomMember: ', chatRoomMember);
        if (chatRoomMember) throw new Error('User already in chat room');
        const newChatRoomMember = await this.prisma.chatRoomMember.create({
            data: {
                user: { connect: { id: _client['user'].id } },
                chatRoom: { connect: { id: chatRoom.id } },
                is_admin: false,
            }
        });
        return chatRoom;
    }

    async getChatRoomMemberByRoomId(userId :number ,id: number): Promise<ChatRoomMember | null> {
        const user = await this.prisma.user.findUnique({where: { id: userId }});
        if(!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({where: { id: id }});
        if(!chatRoom) throw new Error('Chat room not found');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
        });
        if(!chatRoomMember) throw new Error('User not in chat room');
        console.log('chatRoomMember: ', chatRoomMember)
        return chatRoomMember;
    }


    // end user chat room

    // start Request to join chat room
    // get request to join chat room
    async getRequestToJoinChatRoom(chatRoomId: number): Promise<RoomReqJoin[] | null> {
        try {
            const chatRoom = await this.prisma.chatRoom.findUnique({
                where: { id: chatRoomId },
            });
            if (!chatRoom) throw new Error('Chat room not found');
            const requestToJoinChatRoom = await this.prisma.roomReqJoin.findMany({
                where: { chatRoomId: chatRoomId },
                select: {
                    createdAt: true,
                    chatRoomId: true,
                    senderId: true,
                    status: true,
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                            status: true,
                        },
                    },
                },
            });
            return requestToJoinChatRoom;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // create request to join chat room
    async addRequestToJoinChatRoom(
        chatRoomId: number,
        senderId: number,
    ): Promise<RoomReqJoin> {
        const user = await this.prisma.user.findUnique({
            where: { id: senderId },
        });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        const existingReqToJoinChatRoom = await this.prisma.roomReqJoin.findUnique({
            where: { senderId_chatRoomId: { senderId: user.id, chatRoomId: chatRoom.id } },
        });
        if (existingReqToJoinChatRoom) throw new Error('User already send request to join chat room');
        return await this.prisma.roomReqJoin.create({
            data: {
                sender: { connect: { id: user.id } },
                chatRoom: { connect: { id: chatRoom.id } },
            }
        });
    }
    // delete request to join chat room
    async deleteRequestToJoinChatRoom(
        senderId: number,
        chatRoomId: number,
    ): Promise<RoomReqJoin | null> {
        return await this.prisma.roomReqJoin.delete({
            where: { senderId_chatRoomId: { senderId, chatRoomId } },
        });
    }
}

// fuctions helpers
const chatRoomDataValidation = (chatRoomData: ChatRoom) => {
    if (!chatRoomData.name[0].match(/[a-zA-Z]/)) throw new Error('Chat room name must start with a letter');
    if (!chatRoomData.name.match(/\S/)) throw new Error('Chat room name must not be all spaces');
    if (!chatRoomData.name.match(/^[a-zA-Z0-9_ ]+$/)) throw new Error('Chat room name must contain only letters, numbers and underscores');
    if (chatRoomData.name.length < 3) throw new Error('Chat room name must be at least 3 characters long');
    if (chatRoomData.name.length > 12) throw new Error('Chat room name must be at most 20 characters long');
}