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
import { Message } from '@prisma/client';

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
    // console.log(_client);
    const user = await this.prisma.user.findUnique({where:{id:_client['payload']['sub']}});
    if(user){
      _client['user'] = user;
    }else{
      _client.disconnect();
    }
    console.log('connected: ' + _client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(client: Socket, payload: Message) {
    console.log("send-message");
    console.log(payload);
    // const user = await this.prisma.user.findUnique({where:{id:client['payload']['sub']}});
    // if(user){
    //   const chat = await this.chatService.addMessage(message);
    //   this.server.to(to).emit('receive-message', chat);
    // }
  }
  @SubscribeMessage('join-room') 
  async handleJoinRoom(client: Socket, payload: {roomId:number}) {
    console.log(client['user']);
    console.log("roomId = "+payload.roomId);

  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected: ' + _client.id);
    // check jwt token
    // remove user from map
    // users.delete(_client.id);
  }
}
