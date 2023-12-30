import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
        
    }

    async searchUser(username: string, name:string) {
        const users = await this.prismaService.user.findMany({
            where: {
                OR: [
                    { username: { equals: username } },
                    { username: { contains: username } },
                ],
            },
            select: {
                image: true,
                username: true,
            },
        });
        const filteredUsers = users.filter(user => user.username !== name);
        return filteredUsers;
    }
    async getUserProfile(username: string, name: string) {
        // if (name === username)
        //     return null;
        const user = await this.prismaService.user.findUnique({
            where: {
                username: username , 
            },
            select: {
                id: true,
                username: true,
                image: true,
                email: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                firstname: true,
                lastname: true,
            },
        });
        if (!user)
            throw new BadRequestException('User not found');
        return user;
    }
}
