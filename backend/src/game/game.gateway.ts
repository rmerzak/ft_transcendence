import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
// socket for server

// const io = new Socket();

@WebSocketGateway({
  cors :{
    origin:"*",
    // namespace: "/game",
  }
})
export class GameGateway implements OnGatewayConnection , OnGatewayDisconnect{

  // @WebSocketServer()
  // server: Server;

  handleConnection(socket: Socket, payload: any)
  {
    console.log("connected");
    let rooms = [];
    let width = 1908;
    let height = 1146;

    socket.on('join', () => {
      let room: any = null;

      // get room
      if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1)
          room = rooms[rooms.length - 1];

        if (room)
        {
          socket.join(room.id);
          socket.emit('playerNo', 2);
          // add player
          room.players.push({
            socketId: socket.id,
            playerNo: 2,
            score: 0,
            x: 20,
            y: height / 2 - 100 / 2,
            width: 15,
            height: 180,
            color: "white",
          });
          
          // send message to room
          // io.to(room.id).emit('startingGame');
          // this.server.to(room.id).emit('startingGame');

          // emit to room.id
          socket.to(room.id).emit('startingGame');
          
          // set time out
          setTimeout(() => {
            // io.to(room.id).emit('startedGame', room);
            // this.server.to(room.id).emit('startedGame', room);
            
            // start game;
            startGame(room);
          }, 3000);
        }
        else 
        {
          room = {
            id: rooms.length + 1,
            players: [{
              socketId: socket.id,
              playerNo: 1,
              score: 0,
              x: width - 35,
              y: height / 2 - 100 / 2,
              width: 15,
              height: 180,
              color: "white",
            }],
            ball: {
              x: width / 2,
              y: height / 2,
              radius: 20,
              speed: 10,
              velocityX: 5,
              velocityY: 5
            },
            winner: 0
          }
          rooms.push(room);
          socket.join(room.id);
          socket.emit('playerNo', 1);
      }
    });
    socket.on("move", (data) => {
      let room = rooms.find(room => room.id === data.roomID);
  
      if (room) {
          const player = room.players[data.playerNo - 1];
          const increment = 20; // Adjust the increment as needed
  
          if (data.direction === 'up') {
              player.y -= increment;
              player.y = Math.max(player.y, 0);
          } else if (data.direction === 'down') {
              player.y += increment;
              player.y = Math.min(player.y, height - player.height);
          }
  
          // update rooms
          rooms = rooms.map(r => {
              if (r.id === room.id)
                  return room;
              return r;
          });
      }
      
      // io.to(room.id).emit('updateGame', room);
      // this.server.to(room.id).emit('updateGame', room);
    });
  
    socket.on('leave', (roomID) => {
      socket.leave(roomID);
    });
    
    function resetBall(room) {
      room.ball.x = width / 2;
      room.ball.y = height / 2;
  
      room.ball.speed = 10;
      room.ball.velocityX = -room.ball.velocityX;
  }
  
  function collision(ball: any, player: any) {
      player.top = player.y;
      player.bottom = player.y + player.height;
      player.left = player.x;
      player.right = player.x + player.width;
  
      ball.top = ball.y - ball.radius;
      ball.bottom = ball.y + ball.radius;
      ball.left = ball.x - ball.radius;
      ball.right = ball.x + ball.radius;
  
      return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
  }
  
  function updatePlayerCollision(ball: any, player: any) {
      if (collision(ball, player)) {
          let collidePoint = ball.y - (player.y + player.height / 2);
          collidePoint = collidePoint / (player.height / 2);
          let angleRad = collidePoint * Math.PI / 4;
          let direction = ball.x < width / 2 ? 1 : -1;
  
          ball.velocityX = direction * ball.speed * Math.cos(angleRad);
          ball.velocityY = ball.speed * Math.sin(angleRad);
  
          ball.speed += 0.5;
      }
  }
  
  function startGame(room) {
      function update() {
          room.ball.x += room.ball.velocityX;
          room.ball.y += room.ball.velocityY;
  
          const borderSize = 10; // Adjust the border size as needed
          if (room.ball.y + room.ball.radius > height - borderSize || room.ball.y - room.ball.radius < borderSize) {
              room.ball.velocityY = -room.ball.velocityY;
          }
  
          // Check for collision with paddles and update their positions
          updatePlayerCollision(room.ball, room.players[0]);
          updatePlayerCollision(room.ball, room.players[1]);
  
          // update score
          if (room.ball.x - room.ball.radius < 0) {
              room.players[1].score++;
              resetBall(room);
          } else if (room.ball.x + room.ball.radius > width) {
              room.players[0].score++;
              resetBall(room);
          }
          if (room.players[0].score === 5) {
              room.winner = 1;
              rooms = rooms.filter(r => r.id !== room.id);
              // io.to(room.id).emit('gameOver', room);
              socket.to(room.id).emit('gameOver', room);
              clearInterval(gameLoopInterval);
          }
          else if (room.players[1].score === 5) {
              room.winner = 2;
              rooms = rooms.filter(r => r.id !== room.id);
              // io.to(room.id).emit('gameOver', room);
              socket.to(room.id).emit('gameOver', room);
              clearInterval(gameLoopInterval);
          }
          // io.to(room.id).emit('updateGame', room);
          socket.to(room.id).emit('updateGame', room);
      }
  
      // Start the game loop with setInterval
      const gameLoopInterval = setInterval(update, 1000 / 60);
  
  }
  
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
