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

    async getChatRoomsForUser(userId: number): Promise<ChatRoom[] | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            // if (!user) {
            //     throw new Error('User not found');
            // }
            if (!user) return null;

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
            if (chatRooms.length === 0) return null;
            const filteredChatRooms = await Promise.all(chatRooms.map(async room => {
                const firstChar = room.name.charAt(0);
                const roomMember = await this.prisma.chatRoomMember.findUnique({
                    where: { userId_chatRoomId: { userId: user.id, chatRoomId: room.id } },
                });
                return isNaN(parseInt(firstChar, 10)) && roomMember.status !== RoomStatus.BANNED;
            }));
            if (filteredChatRooms.length === 0) return null;
            const finalFilteredChatRooms = chatRooms.filter((_, index) => filteredChatRooms[index]);
            if (finalFilteredChatRooms.length === 0) return null;
            return finalFilteredChatRooms;
        } catch (error) {
            // console.error('Error getting chat rooms for user:', error.message);
            return null;
        }
    }

    // get chat room Not for user
    async getChatRoomsNotForUser(userId: number): Promise<ChatRoom[] | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            // if (!user) throw new Error('User not found');
            if (!user) return null;

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
            if (chatRooms.length === 0) return null;
            return chatRooms;
        } catch (error) {
            // console.error('Error getting chat rooms not for user:', error.message);
            return null;
        }
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
        try {
            if (!id) throw new Error('Chat room id not provided');
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
            return null;
        }
    }
    // create chat room
    async createChatRoom(socket: Socket, chatRoomData: ChatRoom): Promise<ChatRoom> {
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
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error('User not found');
        const roomMem = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId, chatRoomId } },
        });
        if (!roomMem) return null;
        return roomMem;
    }
    async getChatRoomMembers(
        chatRoomId: number,
    ): Promise<ChatRoomUsers[] | null> {
        const Members = await this.prisma.chatRoomMember.findMany({
            where: { chatRoomId: chatRoomId },
            select: {
                is_admin: true,
                leftAt: true,
                status: true,
                mutedDuration: true,
                mutedDate: true,
                chatRoomId: true,
                userId: true,
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
        });
        if (!Members) return null;
        return Members;
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
            }
        });
    }

    // update user chatroom
    async updatechatRoomMember(fromUserI: number, chatRoomMemData: ChatRoomMember): Promise<ChatRoomMember | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: fromUserI },
        });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomMemData.chatRoomId },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        const chatRoomOwner = await this.prisma.chatRoomMember.findUnique({
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
        if (!chatRoomOwner) throw new Error('User not in chat room');
        if (chatRoomOwner.chatRoom.owner !== user.id && !chatRoomOwner.is_admin) throw new Error('User not allowed to update chat room member');
        const userToUpdate = await this.prisma.user.findUnique({ where: { id: chatRoomMemData.userId } });
        if (!userToUpdate) throw new Error('User not found');
        if (chatRoomOwner.userId === userToUpdate.id) throw new Error('Owner or Admin not allowed to update himself');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: userToUpdate.id, chatRoomId: chatRoom.id } },
        });
        if (!chatRoomMember) throw new Error('User not in chat room');
        // if (chatRoomOwner.chatRoom.owner !== user.id && chatRoomMember.is_admin) throw new Error('you are not allowed to update admin');
        return await this.prisma.chatRoomMember.update({
            where: { userId_chatRoomId: { userId: userToUpdate.id, chatRoomId: chatRoom.id } },
            data: {
                is_admin: chatRoomMemData.is_admin,
                leftAt: chatRoomMemData.leftAt,
                status: chatRoomMemData.status,
                mutedDuration: chatRoomMemData.mutedDuration,
                mutedDate: chatRoomMemData.mutedDate,
            },
        });
    }


    // remove user from chat room
    async deletechatRoomMember(
        operatorId: number,
        userId: number,
        chatRoomId: number,
    ): Promise<ChatRoomMember | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: operatorId },
        });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
        });
        if (!chatRoom) throw new Error('Chat room not found');
        const chatRoomOwner = await this.prisma.chatRoomMember.findUnique({
            where: {
                userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id },
            },
            select: {
                is_admin: true,
                chatRoomId: true,
                userId: true,
                chatRoom: {
                    select: {
                        owner: true,
                    },
                },
            },
        });
        if (!chatRoomOwner) throw new Error('User not in chat room');
        if (chatRoomOwner.chatRoom.owner !== user.id && !chatRoomOwner.is_admin) throw new Error('You are not allowed to remove user from chat room');
        const userToRemove = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!userToRemove) throw new Error('User not found');
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
            if (payload.passwordHash === null || payload.passwordHash === undefined) throw new Error('Chat room password not set');
            const isPasswordValid = await argon.verify(chatRoom.passwordHash, payload.passwordHash);
            if (!isPasswordValid) throw new Error('Invalid password');
        }
        if (chatRoom.visibility === 'PRIVATE') {
            throw new Error('Chat room is private');
        }
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: _client['user'].id, chatRoomId: chatRoom.id } },
        });
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

    async getChatRoomMemberByRoomId(userId: number, id: number): Promise<ChatRoomMember | null> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        const chatRoom = await this.prisma.chatRoom.findUnique({ where: { id: id } });
        if (!chatRoom) throw new Error('Chat room not found');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
        });
        // if (!chatRoomMember) throw new Error('User not in chat room');
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
            throw new Error(error.message);
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
        const user = await this.prisma.user.findUnique({
            where: { id: senderId },
        });
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
        });
        if (!chatRoom || !user) return null;
        try {
            const roomReq = await this.prisma.roomReqJoin.delete({
                where: { senderId_chatRoomId: { senderId, chatRoomId } },
            });
            if (!roomReq) return null;
            return roomReq;
        } catch (error) {
            return null;
        }
    }
    // delete all requests to join chat room
    async deleteAllReqToJoinRoom(chatRoomId: number): Promise<RoomReqJoin[] | null> {
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
        });

        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        try {
            const roomReqsToDelete = await this.prisma.roomReqJoin.findMany({
                where: { chatRoomId: chatRoomId },
            });

            if (roomReqsToDelete.length === 0) {
                return null;
            }

            const deletedRoomReqs = await this.prisma.roomReqJoin.deleteMany({
                where: { chatRoomId: chatRoomId },
            });

            if (deletedRoomReqs.count !== roomReqsToDelete.length) {
                throw new Error('Error deleting all requests to join chat room');
            }

            return roomReqsToDelete;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // end Request to join chat room

    async leaveMemberFromRoom(_client: Socket, payload: ChatRoom): Promise<any> {

        const chatRoom = await this.prisma.chatRoom.findUnique({
            where: { name: payload.name },
        });

        if (!chatRoom) throw new Error('Chat room not found');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: _client['user'].id, chatRoomId: chatRoom.id } },
        });

        if (!chatRoomMember) throw new Error('User not in chat room');

        if ((chatRoomMember.is_admin && chatRoom.owner !== _client['user'].id) || !chatRoomMember.is_admin) {
            await this.prisma.chatRoomMember.delete({
                where: { userId_chatRoomId: { userId: _client['user'].id, chatRoomId: chatRoom.id } },
            });
            return chatRoom;
        }
        if (chatRoom.owner === chatRoomMember.userId) {
            const FirstAdminMember = await this.prisma.chatRoomMember.findFirst({
                where: { chatRoomId: chatRoom.id, userId: { not: _client['user'].id }, is_admin: true },
                orderBy: { joinedAt: 'asc' },
            });
            if (FirstAdminMember) {
                await this.prisma.chatRoom.update({
                    where: { id: chatRoom.id },
                    data: { owner: FirstAdminMember.userId },
                });
            }
            const FirstMember = await this.prisma.chatRoomMember.findFirst({
                where: { chatRoomId: chatRoom.id, userId: { not: _client['user'].id }, is_admin: false },
                orderBy: { joinedAt: 'asc' },
            });
            if (FirstMember && !FirstAdminMember) {
                await this.prisma.chatRoom.update({
                    where: { id: chatRoom.id },
                    data: { owner: FirstMember.userId },
                });
                await this.prisma.chatRoomMember.update({
                    where: { userId_chatRoomId: { userId: FirstMember.userId, chatRoomId: chatRoom.id } },
                    data: { is_admin: true },
                });
            }
            await this.prisma.chatRoomMember.delete({
                where: { userId_chatRoomId: { userId: _client['user'].id, chatRoomId: chatRoom.id } },
            });
            if (!FirstMember && !FirstAdminMember) {
                await this.prisma.chatRoom.delete({
                    where: { id: chatRoom.id },
                });
                return null;
            }
        }
        return chatRoom;
    }
    async getChatRoomInvitedUsers(id: number, roomId: number): Promise<RoomReqJoin[] | null> {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: roomId },
        });
        if (!room) return null;
        // if(room.owner !== id) throw new Error('You are not the owner of this chat room');
        // if (room.visibility !== 'PRIVATE') throw new Error('Chat room is not private');
        const invitedUsers = await this.prisma.roomReqJoin.findMany({
            where: {
                chatRoomId: roomId,
                status: 'PENDING'
            },
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
                    },
                },
            },
        });
        if (!invitedUsers) return null;
        return invitedUsers;
    }
    async requestJoinRoom(_client: Socket, name: string): Promise<RoomReqJoin | null> {
        const chatRoom = await this.prisma.chatRoom.findUnique({ where: { name: name } });
        if (!chatRoom) throw new Error('Chat room not found');

        if (chatRoom.visibility !== 'PRIVATE') throw new Error('Chat room is not private');

        const existingReqToJoinChatRoom = await this.prisma.roomReqJoin.findUnique({
            where: { senderId_chatRoomId: { senderId: _client['user'].id, chatRoomId: chatRoom.id } },
        });
        if (existingReqToJoinChatRoom) throw new Error('User already send request to join chat room');

        return await this.prisma.roomReqJoin.create({
            data: {
                sender: { connect: { id: _client['user'].id } },
                chatRoom: { connect: { id: chatRoom.id } },
            }
        });
    }
    async acceptJoinRoom(_client: Socket, payload: { roomId: number, userId: number }): Promise<ChatRoomMember | null> {
        const chatRoom = await this.prisma.chatRoom.findUnique({ where: { id: payload.roomId } });
        if (!chatRoom) throw new Error('Chat room not found');
        if (chatRoom.visibility !== 'PRIVATE') throw new Error('Chat room is not private');
        if (chatRoom.owner !== _client['payload']['sub']) throw new Error('You are not the owner of this chat room');
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) throw new Error('User not found');
        const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId: user.id, chatRoomId: chatRoom.id } },
        });
        if (chatRoomMember) throw new Error('User already in chat room');
        const requestToJoinChatRoom = await this.prisma.roomReqJoin.findUnique({
            where: { senderId_chatRoomId: { senderId: user.id, chatRoomId: chatRoom.id } },
        });
        if (!requestToJoinChatRoom) throw new Error('Request to join chat room not found');
        if (requestToJoinChatRoom.status !== 'PENDING') throw new Error('Request to join chat room already accepted or rejected');
        await this.prisma.roomReqJoin.update({
            where: { senderId_chatRoomId: { senderId: user.id, chatRoomId: chatRoom.id } },
            data: { status: 'ACCEPTED' },
        });
        return await this.prisma.chatRoomMember.create({
            data: {
                user: { connect: { id: user.id } },
                chatRoom: { connect: { id: chatRoom.id } },
                is_admin: false,
            }
        });
    }
    async rejectJoinRoom(_client: Socket, payload: { roomId: number, userId: number }): Promise<RoomReqJoin | null> {
        const chatRoom = await this.prisma.chatRoom.findUnique({ where: { id: payload.roomId } });

        if (!chatRoom) throw new Error('Chat room not found');
        if (chatRoom.visibility !== 'PRIVATE') throw new Error('Chat room is not private');
        if (chatRoom.owner !== _client['user'].id) throw new Error('You are not the owner of this chat room');
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) throw new Error('User not found');
        const requestToJoinChatRoom = await this.prisma.roomReqJoin.findUnique({
            where: { senderId_chatRoomId: { senderId: user.id, chatRoomId: chatRoom.id } },
        });
        if (!requestToJoinChatRoom) throw new Error('Request to join chat room not found');
        if (requestToJoinChatRoom.status !== 'PENDING') throw new Error('Request to join chat room already accepted or rejected');
        return await this.prisma.roomReqJoin.delete({
            where: { senderId_chatRoomId: { senderId: user.id, chatRoomId: chatRoom.id } }
        });
    }
    async getChatRoomsByName(name: string): Promise<ChatRoom[]> {
        return await this.prisma.chatRoom.findMany({
            where: {
                name: {
                    contains: name,
                },
            },
        });
    }
    async getChatRoomMembershipStatus(userId: number, chatRoomId: number): Promise<ChatRoomMember | null> {

        const membersip = await this.prisma.chatRoomMember.findUnique({
            where: { userId_chatRoomId: { userId, chatRoomId } },
        });
        if (!membersip) return null;
        return membersip;

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