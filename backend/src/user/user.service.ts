import { Injectable } from '@nestjs/common';
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
}
