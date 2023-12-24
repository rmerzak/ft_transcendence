import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from "@nestjs/common";
import { Socket } from 'socket.io';
import { Observable } from "rxjs";
import { verify } from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor( private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType() !== 'ws') {
            return true;
        }
        const client: Socket = context.switchToWs().getClient();
        const { authorization } = client.handshake.headers;
        WsJwtGuard.validateToken(client);
        return true;
    }
     static validateToken(socket: Socket) {
            const authorization = socket.handshake.headers.cookie;
            console.log("authorization",authorization);
            if (authorization) {
                const tokenArray = authorization.split(';').map(pair => pair.trim().split('='));
                const accessTokenPair = tokenArray.find(([key]) => key === 'accesstoken');
                if (accessTokenPair) {
                    const [, value] = accessTokenPair;
                    const payload = verify(value, process.env.JWT_SERCRET);
                    console.log("playload",payload);
                    socket['payload'] = payload;
                    return payload;
                }
            } else
                throw new Error('Not authorized');
    
    }
}