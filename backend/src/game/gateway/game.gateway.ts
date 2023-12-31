/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { GameService } from '../services/game.service';
import { SocketAuthMiddleware } from 'src/auth/middleware/ws.mw';
import { Player } from '../models/player.model';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080/game',
    namespace: 'game',
    credentials: true,
  }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly game: GameService,
  ) {}
  private width = 1908;
  private height = 1146;

  @WebSocketServer()
  server: Server;
  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  async getUser(socket: any) {

    const user = await this.game.findUserByEmail(socket['payload']['email']);

    console.log(user);
  }
  private roomId = 0;
  async handleConnection(socket: Socket, request: Request) {
    // console.log(socket['payload']['email']);
    // this.getUser(socket.request);
    // socket["user"] = await this.getUser(socket.request);
    // console.log(this.getUser(socket));
    // this.getUser(socket);
  }
  handleDisconnect(client: Socket): any {
    console.log("disconnected");
    GameService.rooms;

    // loop through rooms and remove player from room
    for (const [id, room] of GameService.rooms) {
      if (room.players.has(client.id)) {
        room.players.delete(client.id);
        // if room is empty delete room
        if (room.players.size === 0) {
          GameService.rooms.delete(id);
          GameService.roomIdCounter--;
        }
      }
    }


    // console.log(client.id);
    //   socket.leave(roomID);
    // romove player from room
    // this.room.removePlayer(socket.id);
  }

  @SubscribeMessage('join')
  joinRoom(client: Socket): void {
    
  const player: Player = {
    socketId: client.id,
    playerNo: 0,
    score: 0,
    position: {
      x: 0,
      y: 0,
    },
    width: 15,
    height: 180,
    color: 'white',
  }

  this.roomId = this.game.joinRoom(player);
  

  // this.server.to(player.roomID).emit('startingGame');
  }

  // @SubscribeMessage('leaveRoom')
  // leaveRoom(client: Socket) {
  //   console.log("leave room");
  //   this.game.leaveRoom(this.roomId, client.id);
  // }



































  // @SubscribeMessage('join')
  // join(socket: any): void {
  //   this.room.joinRoom(socket);
    // {
    //   let room;

    //   if (
    //     this.rooms.length > 0 &&
    //     this.rooms[this.rooms.length - 1].players.length === 1
    //   )
    //     room = this.rooms[this.rooms.length - 1];
    //   if (room) {
    //     socket.join(room.id);
    //     socket.emit('playerNo', 2);
    //     // add player
    //     room.players.push({
    //       socketId: socket.id,
    //       playerNo: 2,
    //       score: 0,
    //       x: 20,
    //       y: this.height / 2 - 100 / 2,
    //       width: 15,
    //       height: 180,
    //       color: 'white',
    //     });
    //   // send message to room
    //   this.server.to(room.id).emit('startingGame');
    //   // socket.emit('startingGame');
      
    //       this.server.to(room.id).emit('startingGame');
          
    //       // set time out
    //       setTimeout(() => {
    //         // io.to(room.id).emit('startedGame', room);
    //         this.server.to(room.id).emit('startedGame', room);
            
    //         // start game;
    //         this.startGame(room);
    //       }, 3000);
    //     }
    //     else 
    //     {
    //       room = {
    //         id: this.rooms.length + 1,
    //         players: [{
    //           socketId: socket.id,
    //           playerNo: 1,
    //           score: 0,
    //           x: this.width - 35,
    //           y: this.height / 2 - 100 / 2,
    //           width: 15,
    //           height: 180,
    //           color: "white",
    //         }],
    //         ball: {
    //           x: this.width / 2,
    //           y: this.height / 2,
    //           radius: 20,
    //           speed: 10,
    //           velocityX: 5,
    //           velocityY: 5
    //         },
    //         winner: 0
    //       }
    //       this.rooms.push(room);
    //       socket.join(room.id);
    //       socket.emit('playerNo', 1);
    //   }
    // }
  // }

// resetBall(room) {
//     room.ball.x = this.width / 2;
//     room.ball.y = this.height / 2;

//     room.ball.speed = 10;
//     room.ball.velocityX = -room.ball.velocityX;
// }

// collision(ball: any, player: any) {
//     player.top = player.y;
//     player.bottom = player.y + player.height;
//     player.left = player.x;
//     player.right = player.x + player.width;

//     ball.top = ball.y - ball.radius;
//     ball.bottom = ball.y + ball.radius;
//     ball.left = ball.x - ball.radius;
//     ball.right = ball.x + ball.radius;

//     return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
// }

// updatePlayerCollision(ball: any, player: any) {
//     if (this.collision(ball, player)) {
//         let collidePoint = ball.y - (player.y + player.height / 2);
//         collidePoint = collidePoint / (player.height / 2);
//         let angleRad = collidePoint * Math.PI / 4;
//         let direction = ball.x < this.width / 2 ? 1 : -1;

//         ball.velocityX = direction * ball.speed * Math.cos(angleRad);
//         ball.velocityY = ball.speed * Math.sin(angleRad);

//         ball.speed += 0.5;
//     }
// }

//   startGame(room) {
//     const update = () => {
//       room.ball.x += room.ball.velocityX;
//       room.ball.y += room.ball.velocityY;

//       const borderSize = 10; // Adjust the border size as needed
//       if (room.ball.y + room.ball.radius > this.height - borderSize || room.ball.y - room.ball.radius < borderSize) {
//           room.ball.velocityY = -room.ball.velocityY;
//       }

//       // Check for collision with paddles and update their positions
//       this.updatePlayerCollision(room.ball, room.players[0]);
//       this.updatePlayerCollision(room.ball, room.players[1]);

//       // update score
//       if (room.ball.x - room.ball.radius < 0) {
//           room.players[1].score++;
//           this.resetBall(room);
//       } else if (room.ball.x + room.ball.radius > this.width) {
//           room.players[0].score++;
//           this.resetBall(room);
//       }
//       if (room.players[0].score === 5) {
//           room.winner = 1;
//           this.rooms = this.rooms.filter(r => r.id !== room.id);
//           // io.to(room.id).emit('gameOver', room);
//           this.server.to(room.id).emit('gameOver', room);
//           clearInterval(gameLoopInterval);
//       }
//       else if (room.players[1].score === 5) {
//           room.winner = 2;
//           this.rooms = this.rooms.filter(r => r.id !== room.id);
//           // io.to(room.id).emit('gameOver', room);
//           this.server.to(room.id).emit('gameOver', room);
//           clearInterval(gameLoopInterval);
//       }
//       // io.to(room.id).emit('updateGame', room);
//       this.server.to(room.id).emit('updateGame', room);
//   }

//   // Start the game loop with setInterval
//   const gameLoopInterval = setInterval(update, 1000 / 60);
//   }

//   @SubscribeMessage('move')
//   move(socket: any, payload: any): any {
//     let room = this.rooms.find(room => room.id === payload.roomID);
  
//     if (room) {
//         const player = room.players[payload.playerNo - 1];
//         const increment = 60; // Adjust the increment as needed
  
//         if (payload.direction === 'up') {
//             player.y -= increment;
//             player.y = Math.max(player.y, 0);
//         } else if (payload.direction === 'down') {
//             player.y += increment;
//             player.y = Math.min(player.y, this.height - player.height);
//         }
  
//         // update rooms
//         this.rooms = this.rooms.map(r => {
//             if (r.id === room.id)
//                 return room;
//             return r;
//         });
//     }
    
//     // io.to(room.id).emit('updateGame', room);
//     this.server.to(room.id).emit('updateGame', room);
//   }

//   @SubscribeMessage('leave')
//   leave(socket: any, payload: any): any {  
//     socket.leave(payload.roomID);
//   }


//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
}
