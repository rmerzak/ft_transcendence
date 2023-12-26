import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
    constructor(private prisma:PrismaService) {}
    public readonly connectedClients: Map<User, string> = new Map(); // must change to private its just for testing

    async handleConnection(socket: Socket): Promise<void> {
        const clientId = socket.id;
        let payload = socket['payload'];
        //let user = await this.prisma.user.findUnique({ where: { email: payload['email'] } });
        //this.connectedClients.set( user, clientId);
        console.log('connected client',this.connectedClients);
    }

    handleDisconnect(socket: Socket): void {
        const clientId = socket.id;
        //this.connectedClients.delete(user => user.id === clientId);
        console.log('disconnected client',this.connectedClients);
    }
}