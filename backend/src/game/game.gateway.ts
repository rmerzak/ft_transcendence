import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors :{
    origin:"http://localhost:8080",
    // namespace: "/game",
    // credentia+
  }
})
export class GameGateway implements OnGatewayConnection , OnGatewayDisconnect{
  handleConnection(client: Socket, payload: any)
  {
    console.log("connected");
  }
  handleDisconnect(client: Socket): any
  {
    console.log("disconnected");
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
