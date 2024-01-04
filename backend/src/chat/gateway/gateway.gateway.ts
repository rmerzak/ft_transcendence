import { Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../chat.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { PrismaService } from 'src/prisma/prisma.service';

// let users = new Map<string, string[]>();

@WebSocketGateway({
  cors: { origin: 'http://localhost:8080', namespace: '/chat', credentials: true},
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // add a map to store users
  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  constructor(private chatService: ChatService,private prisma:PrismaService) {}
  async handleConnection(_client: Socket) {
    const user = await this.prisma.user.findUnique({where:{id:_client['payload']['sub']}});
    if(user){
      _client['user'] = user;
    }else{
      _client.disconnect();
    }
    console.log('connected: ' + _client.id);
  }

  @SubscribeMessage('message')
  async message(socket: Socket, message: string) {
    console.log(socket);
    console.log("inside the chat gateway");
    socket.emit('roomCreated', socket['user']);
   
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected: ' + _client.id);
    // check jwt token
    // remove user from map
    // users.delete(_client.id);
  }
}
