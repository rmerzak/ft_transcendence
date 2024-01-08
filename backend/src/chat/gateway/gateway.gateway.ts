import { Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io'; 
import { MsgService } from '../services/room/msg.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from '@prisma/client';
import { SocketContainer } from '../classes/socket_container';

// let users = new Map<string, string[]>();

@WebSocketGateway({ 
  cors: { origin: 'http://localhost:8080', credentials: true}, 
  namespace:'/chat'
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  //atruibute socket
  private userChatRoomSocket: SocketContainer;

  // add a map to store users
  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  constructor(private chatService: MsgService,private prisma:PrismaService) {
    this.userChatRoomSocket = new SocketContainer();
  } 
  async handleConnection(_client: Socket) {
    // console.log(_client);
    const user = await this.prisma.user.findUnique({where:{id:_client['payload']['sub']}});
    if(user){
      _client['user'] = user;
      this.userChatRoomSocket.addSocket(user.id,-1, null);
    }else{
      _client.disconnect();
    } 
    console.log('connected chat id1: ' + _client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(client: Socket, payload: Message) {
    console.log("send-message");
    console.log(client);
    // const user = await this.prisma.user.findUnique({where:{id:client['payload']['sub']}});
    this.chatService.addMessage(payload, client['user'].id);
  }
  @SubscribeMessage('join-room') 
  async handleJoinRoom(_client: Socket, payload: {roomId:number}) {
    // console.log(client['user']);
    console.log("roomId = "+payload.roomId);
    if (_client['user'] == null) return;
    this.userChatRoomSocket.addSocket(_client['user'].id, payload.roomId, _client);
    // console.log("hhhhhhh  ");
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected: ' + _client.id);
    // this.userChatRoomSocket.removeSocket(_client['user'].id,-1,_client);
    // check jwt token
    // remove user from map
    // users.delete(_client.id);
  } 


}
