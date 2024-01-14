/* eslint-disable react-hooks/exhaustive-deps */
import styles from '@/app/dashboard/game/page.module.css'
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import { setInterval, clearInterval } from 'timers';
import { useGame } from '@/app/dashboard/game/gameContex';
import { themeAtom } from './theme';
import { useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai';

function Pong()
{
    // game context
    const { updateScores, setPlayer1Elo, setPlayer2Elo, setUserInfo, setOpponentInfo } = useGame();
    
    // canvas    
    const gameRef = useRef<HTMLCanvasElement>(null);
    
    // route
    const router = useRouter();
    
    // theme
    const theme = useAtomValue(themeAtom);
    const setTheme = useSetAtom(themeAtom);
    
    useEffect(() => {
        
        //  socket.io
        const socket = io(`${process.env.API_BASE_URL}/game`, {
            withCredentials: true,
            autoConnect: false,
        });

        const canvas = gameRef.current;
        if (!canvas) return;
        
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        let isGameStarted: boolean = false;
        let intervalId: NodeJS.Timeout;
        let playerNo: number = 0;
        let roomID: number = 0;
        let handleKeyDown: (e: KeyboardEvent) => void;
        let handleKeyUp: (e: KeyboardEvent) => void;

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
                this.speed = speed
                this.velocityX = velocityX
                this.velocityY = velocityY
            }
        }
        const colors = ["#ffffff", "#111111", "#FFF6E5", "#a6492c", "#c13f2d", "#1a5b7e"]

        let player1: Player = new Player(20, 1146 / 2 - 100 / 2, 15, 180, colors[theme]);
        let player2: Player = new Player(1908 - 35, 1146 / 2 - 100 / 2, 15, 180, colors[theme]);
        let ball : Ball = new Ball(1908 / 2, 1908 / 2, 20, 10, 5, 5, colors[theme]);

        // effect components here
        // *****************************************************************************************

        let balls: Balls[] = [];
        const rgbs: string[][] = [
            ["rgb(255, 255, 255)", "rgb(238, 238, 238)", "rgb(221, 221, 221)", "rgb(204, 204, 204)", "rgb(187, 187, 187)", "rgb(170, 170, 170)", "rgb(153, 153, 153)"],
            ["rgb(17, 17, 17)", "rgb(34, 34, 34)", "rgb(51, 51, 51)", "rgb(68, 68, 68)", "rgb(85, 85, 85)", "rgb(102, 102, 102)", "rgb(119, 119, 119)"],
            ["rgb(255, 246, 229)", "rgb(251, 241, 219)", "rgb(246, 236, 208)", "rgb(241, 231, 197)", "rgb(236, 226, 186)", "rgb(231, 221, 175)", "rgb(226, 216, 164)"],
            ["rgb(139, 69, 19)", "rgb(160, 82, 45)", "rgb(205, 133, 63)", "rgb(244, 164, 96)", "rgb(210, 105, 30)", "rgb(139, 69, 19)", "rgb(165, 42, 42)"],
            ["rgb(193, 63, 45)", "rgb(199, 74, 58)", "rgb(205, 85, 71)", "rgb(211, 96, 84)", "rgb(217, 107, 97)", "rgb(223, 118, 110)", "rgb(229, 129, 123)"],
            ["rgb(0, 0, 255)", "rgb(30, 144, 255)", "rgb(70, 130, 180)", "rgb(0, 191, 255)", "rgb(135, 206, 250)", "rgb(70, 130, 180)", "rgb(100, 149, 237)"]
          ];

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

                this.style = rgbs[theme][getRandomInt(0, rgbs[theme].length - 1)];

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
            drawRect(0, 0, 10, canvas.height, colors[theme]);
            drawRect(canvas.width - 10, 0, 10, canvas.height, colors[theme]);
            
            // draw the top and bottom line
            drawRect(0, 0, canvas.width, 10, colors[theme]);
            drawRect(0, canvas.height - 10, canvas.width, 10, colors[theme]);
        
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

        if (socket.connect()) {
            socket.on('userInfo', () => {
                socket.emit('join');
            });
        }

        // get player no
        socket.on('playerNo', (payload) => {
            playerNo = payload.playerNo;
            if (playerNo === 1) {
                setUserInfo(payload.playerNo, payload.user?.username, payload.user?.image);
                setPlayer1Elo(payload.user?.gameElo);
                if (payload.showLoading) {
                    Swal.fire({
                        imageUrl: "/loading.gif",
                        imageWidth: 500,
                        imageHeight: 500,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        customClass: {
                            popup: 'bg-transparent',
                            image: 'opacity-50 bg-transparent',
                        },
                    });
                }
            } else if (playerNo === 2) {
                setOpponentInfo(payload.playerNo, payload.user?.username, payload.user?.image);
                setPlayer2Elo(payload.user?.gameElo);
                Swal.close();
            }
            render();
        });
        
        // starting game
        socket.on('roomIsFull', (flag) => {
            isGameStarted = flag;
        });

        // start game
        socket.on('startedGame', ( id ) => {
            roomID = id;
        },);

        let movement = { up: false, down: false };

        handleKeyDown = (e: KeyboardEvent) => {
            if (isGameStarted) {
                if (e.key === 'ArrowUp') {
                    movement.up = true;
                } else if (e.key === 'ArrowDown') {
                    movement.down = true;
                }
            }
        }
        handleKeyUp = (e: KeyboardEvent) => {
            if (isGameStarted) {
                if (e.key === 'ArrowUp') {
                    movement.up = false;
                } else if (e.key === 'ArrowDown') {
                    movement.down = false;
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Periodically send movement updates
        intervalId = setInterval(() => {
            if (movement.up || movement.down) {
                socket.emit("move", {
                    roomId: roomID,
                    playerNo: playerNo === 1 ? 2 : 1,
                    direction: movement.up ? 'up' : 'down'
                });
            }
        }, 1000 / 60); // Adjust the interval as needed
            
        // update game
        socket.on("updateGame", (update) => {
            if (!ball || !player1 || !player2) return;
            ball.x = update.ball.position.x;
            ball.y = update.ball.position.y;

            for (let i = 0; i < 3; i++) {
                balls.push(new Balls(ball));
            }

            // fix type error
            player1.x = update.players[0].position.x;
            player1.y = update.players[0].position.y;

            player2.x = update.players[1].position.x;
            player2.y = update.players[1].position.y;

            render();
        });

        // update scores
        socket.on('updateScore', (scores) => {
            updateScores(scores.player1, scores.player2);
        });

        // redirect
        socket.on('redirect', (flag) => {
            if (flag) {
                router.push('/dashboard/game');
            }
        });

        // game over
        socket.on('gameOver', ({ winner }) => {
            isGameStarted = false;
            
            if (winner) {
                Swal.fire({
                    title: 'You Win!',
                    text: 'Congratulations! You win the game!',
                    imageUrl: "/game/winner.gif",
                    imageWidth: 400,
                    imageHeight: 200,
                    confirmButtonText: 'Ok',
                    customClass: {
                        popup: 'bg-gradient-to-r from-[#510546]/40 to-[#6958be]/40'
                    }
                }).then(() => {
                    // redirect to game page
                    router.push('/dashboard/game');
                });
            } else {
                Swal.fire({
                    title: 'You Lose!',
                    text: 'You lose the game!',
                    imageUrl: "/game/loser.gif",
                    imageWidth: 400,
                    imageHeight: 200,
                    confirmButtonText: 'Ok',
                    customClass: {
                        popup: 'bg-gradient-to-r from-[#510546]/40 to-[#6958be]/40'
                    }
                }).then(() => {
                    // redirect to game page
                    router.push('/dashboard/game');
                });
            }
            
            socket.emit('leave', {
                roomId: roomID,
                playerNo: playerNo
            });
            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 400);
        });


        return () => {
        // reset theme
        setTheme(-1);

        // remove canvas
        canvas.remove();

        // close swal
        Swal.close();

        // Remove event listeners
        removeEventListener('keydown', handleKeyDown);
        removeEventListener('keyup', handleKeyUp);

        // Clear interval
        clearInterval(intervalId);
        
        // off event listener
        socket.off('playerNo');
        socket.off('roomIsFull');
        socket.off('startedGame');
        socket.off('updateGame');
        socket.off('redirect');
        socket.off('gameOver');
        socket.off('connect');
        socket.disconnect();
           };

    }, []);
    
    const themes = ['b0', 'b1', 'b2', 'b3', 'b4', 'b5']

    return (
        <>
            <div className='flex justify-center items-center w-[80%] shadow-md'>
                <canvas
                    ref={gameRef}
                    className={styles.game_canvas}
                    style={ { backgroundImage: `url(/game/${themes[theme]}.png)` } }
                    >
                </canvas>
            </div>
        </>
    );
}

export default Pong;