import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from "@nestjs/common";
import { Socket } from 'socket.io';
import { verify } from "jsonwebtoken";
import { PrismaService } from "src/prisma/prisma.service";
import * as cookie from 'cookie';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

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
        // const authorization = socket.handshake.headers.cookie;
        // if (authorization) {
        //     const tokenArray = authorization.split(';').map(pair => pair.trim().split('='));
        //     const accessTokenPair = tokenArray.find(([key]) => key === 'accesstoken');
        //     if (accessTokenPair) {
        //         const [, value] = accessTokenPair;
        //         const payload = verify(value, process.env.JWT_SERCRET);
        //         socket['payload'] = payload;
        //         return payload;
        //     }
        // } else
        //     throw new Error('Not authorized');
        try {
            const tokenCookie = cookie.parse(socket.handshake.headers.cookie);
            if (tokenCookie) {
                const payload = verify(tokenCookie.accesstoken, process.env.JWT_SERCRET);
                socket['payload'] = payload;
                return payload;
            }
        } catch (error) {
            throw new Error('Not authorized');
        }

    }
}