import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
        
    }

    async searchUser(username: string) {
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

        return users;
    }
    async getUserProfile(username: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: username,
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
        console.log("user :", user) 
        return user;
    }
}
