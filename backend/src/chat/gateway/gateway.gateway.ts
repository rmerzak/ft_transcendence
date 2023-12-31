import { Server } from 'socket.io';
import {
  // ConnectedSocket,
  // MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../chat.service';
import { ChatRoom } from '@prisma/client';

// let users = new Map<string, string[]>();

@WebSocketGateway({
  cors: { origin: 'http://localhost:8080', namespace: '/chat' },
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // add a map to store users
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}
  handleConnection(_client: Socket) {
    console.log('connected: ' + _client);
    //check jwt token
    // const isValidToken = this.validateToken(_client.handshake.query.token);
    // add user to map
    // users.set(_client.id, []);
  }

  @SubscribeMessage('createRoom')
  async createChatRoom(socket: Socket, room: ChatRoom) {
    try {
      await this.chatService.createChatRoom(room);
    } catch (error) {
      console.log(error);
    }
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected: ' + _client.id);
    // check jwt token
    // remove user from map
    // users.delete(_client.id);
  }
}
