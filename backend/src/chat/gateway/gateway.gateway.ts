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
// import { SocketContainer } from '../classes/socket_container';

// let users = new Map<string, string[]>();

@WebSocketGateway({
  cors: { origin: 'http://localhost:8080', credentials: true },
  namespace: '/chat'
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  //atruibute socket
  private userChatRoomSocket: Map<number, Map<number, Socket[]>> = new Map<number, Map<number, Socket[]>>();

  // add a map to store users
  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  constructor(private chatService: MsgService, private prisma: PrismaService) { }

  async handleConnection(_client: Socket) {
    const user = await this.prisma.user.findUnique({ where: { id: _client['payload']['sub'] } });
    if (user) {
      _client['user'] = user;
      // this.addSocket(-1, _client);
    } else {
      _client.disconnect();
    }
    console.log('connected chat id1: ' + _client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(_client: Socket, payload: Message) {
    // console.log("send-message");
    // console.log(payload);
    const msg = await this.chatService.addMessage(payload, _client['user'].id);
    console.log("mesage: ", msg );
    this.server.to(payload.chatRoomId.toString()).emit('receive-message', msg);
  }
  @SubscribeMessage('join-room')
  handleJoinRoom(_client: Socket, payload: { roomId: number }) {
    console.log("roomId: ", payload.roomId);
    _client.join(payload.roomId.toString());
    _client.emit('joined-room');
    console.log("rooms: ", _client['rooms']);
    // if (_client.rooms)
    // _client.rooms.forEach((room) => {
    //   console.log("roomeeees: ", room);
    // });
  }

  handleDisconnect(_client: Socket) {
    console.log('disconnected chat id: ' , _client);
    console.log("rooms: ", _client['rooms']);
    // _client.rooms.forEach((room) => {
    //   console.log("room: ", room);
    //   _client.leave(room);
    // });
    // this.userChatRoomSocket.removeSocket(_client['user'].id,-1,_client);
    // check jwt token
    // remove user from map
    // users.delete(_client.id);
  }

  /////////////////////////////////////////////
  public addSocket(roomId: number, socket: Socket): Map<number, Map<number, Socket[]>> | -1 {
    // console.log("addSocket", roomId, socket['user']);
    if (!this.userChatRoomSocket.has(socket['user'].id)) {
      this.userChatRoomSocket.set(socket['user'].id, new Map<number, Socket[]>());
    }
    if (roomId == -1 || socket == null) return -1;
    if (!this.userChatRoomSocket.get(socket['user'].id).has(roomId)) {
      this.userChatRoomSocket.get(socket['user'].id).set(roomId, []);
    }
    this.userChatRoomSocket.get(socket['user'].id).get(roomId).push(socket);
    console.log("addSocket", this.userChatRoomSocket);
    return this.userChatRoomSocket;
  }

  public removeSocket(userId: number, roomId: number, socket: Socket): Map<number, Socket[]> {
    if (this.userChatRoomSocket.has(userId)) {
      if (this.userChatRoomSocket.get(userId).has(roomId)) {
        const index = this.userChatRoomSocket.get(userId).get(roomId).indexOf(socket);
        if (index > -1) {
          this.userChatRoomSocket.get(userId).get(roomId).splice(index, 1);
        }
      }
    }
    return this.userChatRoomSocket.get(userId);
  }

  public getSocketsByRoomId(userId: number, roomId: number): Socket[] {
    if (this.userChatRoomSocket.has(userId)) {
      console.log("getSocketsByRoomId 222", this.userChatRoomSocket.get(userId));
      if (this.userChatRoomSocket.get(userId).has(roomId)) {
        console.log("getSocketsByRoomId", this.userChatRoomSocket.get(userId).get(roomId));
        return this.userChatRoomSocket.get(userId).get(roomId);
      }
    }
    return [];
  }

  public getSocketsByUserId(userId: number): Map<number, Socket[]> {
    if (this.userChatRoomSocket.has(userId)) {
      return this.userChatRoomSocket.get(userId);
    }
    return new Map<number, Socket[]>();
  }

  public removeSocketFromRoom(userId: number, roomId: number, socket: Socket): Map<number, Socket[]> {
    if (this.userChatRoomSocket.has(userId)) {
      if (this.userChatRoomSocket.get(userId).has(roomId)) {
        const index = this.userChatRoomSocket.get(userId).get(roomId).indexOf(socket);
        if (index > -1) {
          this.userChatRoomSocket.get(userId).get(roomId).splice(index, 1);
        }
      }
    }
    return this.userChatRoomSocket.get(userId);
  }

  public sendToRoom(userId: number, roomId: number, payload: Message): void {
    const sockets = this.getSocketsByRoomId(userId, roomId);
    console.log("",sockets);
    sockets.forEach((socket) => {
      socket.emit('receive-message', payload);
    });
  }

}
