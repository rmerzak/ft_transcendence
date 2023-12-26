import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}  
    async findUserById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            image: true,
         }
        });
        return user;
    }
}
