import { Socket } from 'socket.io';
import { WsJwtGuard } from '../guard/ws-jwt.guard';


export type SocketIOMiddleware = {
     (socket: Socket, next: (err?: Error) => void)
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
    //console.log("middleware");
        return (socket,next) => {
            try {
                console.log("middleware2");
                WsJwtGuard.validateToken(socket);
                next();
            } catch (error) {
                next(error);
            }
    }

}