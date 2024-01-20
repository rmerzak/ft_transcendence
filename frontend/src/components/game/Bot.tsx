import React, { useRef, useEffect, use } from 'react';
import styles from '@/app/dashboard/game/page.module.css'
import { useRouter } from 'next/navigation';
import { useGame } from '@/app/dashboard/game/context/gameContext';
import Swal from 'sweetalert2';
import { botThemeAtom } from './theme';
import { useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai';

function Bot()
{
    // theme
    const theme = useAtomValue(botThemeAtom);
    const setTheme = useSetAtom(botThemeAtom);

    // game contex
    const { updateScores } = useGame();

    // canvas    
    const gameRef = useRef<HTMLCanvasElement>(null);
    
    // route
    const router = useRouter();

    // game
    useEffect(() => {
        const canvas = gameRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1908;
        canvas.height = 1146;

        const colors = ["#ffffff", "#111111", "#FFF6E5", "#a6492c", "#c13f2d", "#1a5b7e"]

        // user paddle
        const user: {
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            score: number;
        } = {
            x: 20,
            y: canvas.height / 2 - 100 / 2,
            width: 10,
            height: 130,
            color: colors[theme],
            score: 0
        }

        // com paddle
        const com:{
            x: number;
            y: number;
            width: number;
            height: number;
            color: string;
            score: number;
        } = {
            x: canvas.width - 30,
            y: canvas.height / 2 - 100 / 2,
            width: 10,
            height: 130,
            color: colors[theme],
            score: 0
        }

        // create the ball
        const ball: {
            x: number;
            y: number;
            radius: number;
            color: string;
            speed: number;
            velocityX: number;
            velocityY: number;    
        } = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 15,
            color: colors[theme],
            speed: 10,
            velocityX: 5,
            velocityY: 5
        }

        /* Effect Components Start Here */

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

        /* Effect Components End Here  */

        // function to draw a rectangle
        function drawRect(x: number, y: number, w: number, h: number, color: string) {
            if (!ctx) return;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }

        // function to draw a circle
        function drawCircle(x:number, y:number, r:number, color:string) {
            if (!ctx) return;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }

        // render the game
        function render() {
        
        if (!ctx || !canvas) return;
        
        // clear the rect
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        // draw the side line
        drawRect(0, 0, 10, canvas.height, colors[theme]);
        drawRect(canvas.width - 10, 0, 10, canvas.height, colors[theme]);

        // drae the top and bottom line
        drawRect(0, 0, canvas.width, 10,  colors[theme]);
        drawRect(0, canvas.height - 10, canvas.width, 10,  colors[theme]);

        // draw the user and com paddle
        drawRect(user.x, user.y, user.width, user.height, user.color);
        drawRect(com.x, com.y, com.width, com.height, com.color);

        // draw the ball
        drawCircle(ball.x, ball.y, ball.radius, ball.color);

        // draw the effect
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

        addEventListener("wheel", scrollPaddle);

        function scrollPaddle(evt: WheelEvent) {
            if (!canvas) return;

            // You can adjust the sensitivity of the scroll to control paddle speed
            const scrollSpeed = 40;

            // Update the paddle position based on scroll direction
            user.y -= evt.deltaY > 0 ? scrollSpeed : -scrollSpeed;

            // Ensure the paddle stays within the canvas boundaries
            if (user.y < 0) {
                user.y = 0;
            } else if (user.y > canvas.height - user.height) {
                user.y = canvas.height - user.height;
            }
        }

        function collision(b: any, p: any) {
            const ballCenterX = b.x;
            const ballCenterY = b.y;
            const paddleCenterX = p.x + p.width / 2;
            const paddleCenterY = p.y + p.height / 2;
        
            const deltaX = ballCenterX - Math.max(p.x, Math.min(ballCenterX, p.x + p.width));
            const deltaY = ballCenterY - Math.max(p.y, Math.min(ballCenterY, p.y + p.height));
        
            return (deltaX ** 2 + deltaY ** 2) < (b.radius ** 2);
        }

        function resetBall() {
            if (!canvas) return;
            
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            
            ball.speed = 10;
            if (ball.velocityX < 0) {
                ball.velocityX = 5;
            } else {
                ball.velocityX = -5;
            }
            if (ball.velocityY < 0) {
                ball.velocityY = 5;
            }
            else {
                ball.velocityY = -5;
            }
        }

        // update function, include some logic
        function update() {
            
            if (!canvas) return;
            
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            
            for (let i = 0; i < 3; i++) {
                balls.push(new Balls(ball));
            }
            
            // simple AI to control the com paddle
            let computerLevel = 0.1;
            let targetY = ball.y - com.height / 2;

            // Gradually move the com paddle towards the target position
            com.y += (targetY - com.y) * computerLevel;

            // Ensure the com paddle stays within the canvas boundaries
            com.y = Math.max(0, Math.min(canvas.height - com.height, com.y));
            
            const borderSize = 10; // Adjust the border size as needed
            if (
            ball.y + ball.radius > canvas.height - borderSize ||
            ball.y - ball.radius < borderSize
            ) {
                ball.velocityY = - ball.velocityY;
            }
            
            let player = (ball.x < canvas.width / 2) ? user : com;
            
            if (collision(ball, player)) {
            // where the ball hit the player
            let collidePoint = ball.y - (player.y + player.height / 2);
            
            // normalization
            collidePoint = collidePoint / (player.height / 2);
            
            // calculate angle in radian
            let angleRad = collidePoint * Math.PI / 4;
            
            // X direction of the ball when it's hit
            let direction = (ball.x < canvas.width / 2) ? 1 : -1;
            
            // change velocity X and Y
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);
            
            // every time the ball hit a paddle, we increase its speed
            ball.speed += 0.5;
            }
            
            // update the score
            if (ball.x - ball.radius < 0) {
                com.score++;
                updateScores(user.score, com.score);
                resetBall();
            } else if (ball.x + ball.radius > canvas.width) {
                user.score++;
                updateScores(user.score, com.score);
                resetBall();
            }
            if (user.score == 5000 || com.score == 5000) {
                clearInterval(intervalId);
                Swal.fire({
                    title: 'Game Over',
                    text: `You ${user.score > com.score ? 'Win' : 'Lose'}!`,
                    imageUrl: user.score > com.score ? '/game/winner.gif' : '/game/loser.gif',
                    imageWidth: 400,
                    imageHeight: 200,
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    customClass: {
                        popup: 'bg-gradient-to-r from-[#510546]/40 to-[#6958be]/40'
                    }
                }).then(() => {
                    router.push('/dashboard/game');
                });
            }
    }
        // game init
        function game() {
            
            update();
            render();
        }

        // loop
        const framePerSecond = 60;
        const intervalId = setInterval(game, 1000 / framePerSecond);

        return () => {
            // set theme
            setTheme(theme);
            // remove interval
            clearInterval(intervalId);
            // remove event listener
            removeEventListener("wheel", scrollPaddle);
            // remove canvas
            canvas.remove();
            // remove balls
            balls = [];
            // remove frame
        }

    }, [theme]);

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

export default Bot;