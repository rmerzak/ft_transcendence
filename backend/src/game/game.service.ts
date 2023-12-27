import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}  
    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email },
        select: {
            id: true,
            username: true,
            image: true,
         }
        });
        return user;
    }
}
