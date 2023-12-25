'use client'
import styles from '@/app/dashboard/game/page.module.css'
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function Pong()
{
    const gameRef = useRef<HTMLCanvasElement>(null);

     // socket.io
     const socket = io('http://localhost:3000', {
        transports: ['websocket'],
    });

    useEffect(() => {
        console.log('Hello from Pong.tsx');
        const canvas = gameRef.current;
        if (!canvas) return;

        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        let isGameStarted = false;
        let playerNo = 0;
        let roomID = 0;

       

        class Player {
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            score: number;
            constructor(x: number, y: number, width: number, height: number, color: string) {
                this.x = x
                this.y = y
                this.width = width
                this.height = height
                this.color = color
                this.score = 0
            }
        }
        
        class Ball {
            x: number;
            y: number;
            radius: number;
            speed: number;
            velocityX: number;
            velocityY: number;
            color: string;
            constructor(x: number, y: number, radius: number, speed: number, velocityX: number, velocityY: number, color: string) {
                this.x = x
                this.y = y
                this.radius = radius
                this.color = color
                this.speed = 5
                this.velocityX = 5
                this.velocityY = 5
            }
        }
        
        let player1: Player;
        let player2: Player
        let ball : Ball;

        // effect components here
        // *****************************************************************************************

        let balls: Balls[] = [];

        // let rgb = [
        // 	"rgb(20, 20, 20)",
        // 	"rgb(50, 50, 50)",
        // 	"rgb(100, 100, 100)",
        // 	"rgb(125, 125, 125)",
        // 	"rgb(160, 160, 160)",
        // 	"rgb(200, 200, 200)",
        // 	"rgb(230, 230, 230)"
        // ]

        let rgb = [
            "rgb(139, 69, 19)",
            "rgb(160, 82, 45)",
            "rgb(205, 133, 63)",
            "rgb(244, 164, 96)",
            "rgb(210, 105, 30)",
            "rgb(139, 69, 19)",
            "rgb(165, 42, 42)"
        ];

        // let rgb = [
        //     "rgb(255, 223, 186)",
        //     "rgb(255, 182, 193)",
        //     "rgb(144, 238, 144)",
        //     "rgb(173, 216, 230)",
        //     "rgb(255, 228, 196)",
        //     "rgb(221, 160, 221)",
        //     "rgb(173, 216, 230)"
        // ];


        // let rgb = [
        //     "rgb(0, 0, 255)",
        //     "rgb(30, 144, 255)",
        //     "rgb(70, 130, 180)",
        //     "rgb(0, 191, 255)",
        //     "rgb(135, 206, 250)",
        //     "rgb(70, 130, 180)",
        //     "rgb(100, 149, 237)"
        // ];

        function getRandomInt(min: number, max: number) {
            return Math.round(Math.random() * (max - min)) + min;
        }
        
        function easeOutQuart(x: number) {
            return 1 - Math.pow(1 - x, 4);
        }
        
        function drawBalls() {
            for (let i = 0; i < balls.length; i++) {
                balls[i].update();
                balls[i].draw();
            }
        }

        class Balls {
            start: {x: number, y: number, size: number};
            end: {x: number, y: number};
            x: number;
            y: number;
            size: number;
            style: string;
            time: number;
            ttl: number;
            constructor(ball: {x: number, y: number}) {
                this.start = {
                    x:  ball.x + getRandomInt(-15, 15),
                    y:  ball.y + getRandomInt(-15, 15),
                    size: getRandomInt(10,25)
                }
                this.end = {
                    x: this.start.x + getRandomInt(-200, 200),
                    y: this.start.y + getRandomInt(-200, 200)
                }

                this.x = this.start.x;
                this.y = this.start.y;
                this.size = this.start.size;

                this.style = rgb[getRandomInt(0, rgb.length - 1)];

                this.time = 0;
                this.ttl = 120;
            }
            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.style;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            update() {
                if (this.time <= this.ttl) {
                    let progress = 1 - (this.ttl - this.time) / this.ttl;

                    this.size = this.start.size * (1 - easeOutQuart(progress));
                    this.x = this.x + (this.end.x - this.x) * 0.01;
                    this.y = this.y + (this.end.y - this.y) * 0.01;
                }
                this.time++;
            }
        }
        // *****************************************************************************************

        canvas.width = 1908;
        canvas.height = 1146;

        // function to draw a rectangle
        function drawRect(x: number, y: number, w: number, h: number, color: string) {
            if (!ctx) return;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }

        // function to draw a circle
        function drawCircle(x: number, y: number, r: number , color: string) {
            if (!ctx) return;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }

        // render funcetion
        function render() {

            if (!canvas || !ctx) return;
            // clear the rect
            ctx.clearRect(0, 0, canvas.width, canvas.height);
           
            // draw the side line
            drawRect(0, 0, 10, canvas.height, "white");
            drawRect(canvas.width - 10, 0, 10, canvas.height, "white");
            
            // draw the top and bottom line
            drawRect(0, 0, canvas.width, 10, "white");
            drawRect(0, canvas.height - 10, canvas.width, 10, "white");
        
            // draw the user and com paddle
            drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
            drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
        
            // draw the ball
            drawCircle(ball.x, ball.y, ball.radius, ball.color);
            ctx.globalCompositeOperation = 'lighter';
            drawBalls();
        
            let temp = [];
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].time <= balls[i].ttl) {
                    temp.push(balls[i]);
                }
            }
            balls = temp;
        }

        // get player no
        socket.on('playerNo', (newPlayerNo) => {
            playerNo = newPlayerNo;
        });

        // starting game
        socket.on('startingGame', () => {
            console.log ('Im here');
            isGameStarted = true;
        });


        // start game
        socket.on('startedGame', (room) => {
            console.log(room);
            roomID = room.id;
            player1 = new Player(room.players[0].x, room.players[0].y, room.players[0].width, room.players[0].height, room.players[0].color);
            player2 = new Player(room.players[1].x, room.players[1].y, room.players[1].width, room.players[1].height, room.players[1].color);
            ball = new Ball(room.ball.x, room.ball.y, room.ball.radius, room.ball.speed, room.ball.velocityX, room.ball.velocityY, room.ball.color);

            player1.score = room.players[0].score;
            player2.score = room.players[1].score;

            let movement = { up: false, down: false };

            window.addEventListener('keydown', (e) => {
                if (isGameStarted) {
                    if (e.key === 'ArrowUp') {
                        movement.up = true;
                    } else if (e.key === 'ArrowDown') {
                        movement.down = true;
                    }
                }
            });

            window.addEventListener('keyup', (e) => {
                if (isGameStarted) {
                    if (e.key === 'ArrowUp') {
                        movement.up = false;
                    } else if (e.key === 'ArrowDown') {
                        movement.down = false;
                    }
                }
            });

            // Periodically send movement updates
            setInterval(() => {
                if (movement.up || movement.down) {
                    socket.emit("move", {
                        roomID: roomID,
                        playerNo: playerNo,
                        direction: movement.up ? 'up' : 'down'
                    });
                }
            }, 1000 / 60); // Adjust the interval as needed
        },);

        // update game
        socket.on("updateGame", (room) => {
            if (!ball || !player1 || !player2) return;
            ball.x = room.ball.x;
            ball.y = room.ball.y;

            for (let i = 0; i < 3; i++) {
                balls.push(new Balls(ball));
            }

            player1.x = room.players[0].x;
            player1.y = room.players[0].y;

            player2.x = room.players[1].x;
            player2.y = room.players[1].y;

            player1.score = room.players[0].score;
            player2.score = room.players[1].score;
            render();
        });

        // game over
        socket.on('gameOver', (room) => {
            isGameStarted = false;
            socket.emit('leave', roomID);

            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 4000);
        });

        // startGame();
        if (socket.connect())
        {
            socket.emit('join');
        }
        return () => {
            // off event listener
            socket.off('playerNo');
            socket.off('startingGame');
            socket.off('startedGame');
            socket.off('updateGame');
            socket.off('gameOver');
            socket.off('join');
            socket.off('leave');
            socket.off('move');
            socket.disconnect();
                // socket.off('disconnect');
            };
    }, []);
    return (
        <>
            <div className= {styles.canvas_container}>
                <canvas
                    ref={gameRef}
                    className={styles.game_canvas}
                    style={ { backgroundImage: `url('/A1.png')` } }
                    >
                </canvas>
            </div>
        </>
    );
}

export default Pong;