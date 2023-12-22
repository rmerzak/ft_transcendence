import { Server } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

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

  constructor() {}
  handleConnection(_client: Socket) {
    console.log('connected: ' + _client);
    //check jwt token
    // const isValidToken = this.validateToken(_client.handshake.query.token);
    // add user to map
    // users.set(_client.id, []);
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected: ' + _client.id);
    // check jwt token
    // remove user from map
    // users.delete(_client.id);
  }

  @SubscribeMessage('sendmessage')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('message', { message: data, id: client.id });
  }
}
