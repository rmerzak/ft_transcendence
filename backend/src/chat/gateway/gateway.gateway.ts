import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: 'http://localhost:8080' } })
export class GatewayGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connection');
    });
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log('message:' + body);
    this.server.emit('message', {
      event: 'message',
      data: body,
    });
  }
  @SubscribeMessage('test')
  handleTest(@MessageBody() body: any) {
    console.log('test:' + body);
    this.server.emit('message', {
      event: 'test',
      data: body,
    });
  }
}
