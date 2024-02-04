import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
        
    }

    async searchUser(targetUsername: string, currentUsername: string) {
        const lowercasedTargetUsername = targetUsername.toLowerCase();
    
        const users = await this.prismaService.user.findMany({
            where: {
                NOT: {
                    username: { equals: currentUsername }
                },
                OR: [
                    { username: { equals: lowercasedTargetUsername } },
                    { username: { contains: lowercasedTargetUsername } },
                ],
            },
            select: {
                image: true,
                username: true,
            },
        });
    
        return users;
    }
    async getUserProfile(username: string, name: string) {
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
                status: true,
            },
        });
        if (!user)
            throw new BadRequestException('User not found');
        return user;
    }
    async getUserProfileById(id: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: id,
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
                status: true,
            },
        });
        if (!user)
            throw new BadRequestException('User not found');
        return user;
    }
}
