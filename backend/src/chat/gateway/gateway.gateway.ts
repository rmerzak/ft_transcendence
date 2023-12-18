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

@WebSocketGateway({ cors: { origin: 'http://localhost:8080' } })
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(_client: any) {
    console.log('connected: ' + _client.id);
  }

  handleDisconnect(_client: any) {
    console.log('disconnected: ' + _client.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('message', { message: data, id: client.id });
  }
}
