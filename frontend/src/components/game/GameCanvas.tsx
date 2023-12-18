
'use client'
import Link from 'next/link'
import styles from '../../app/dashboard/game/page.module.css'
import Image from 'next/image'
import { useEffect, useRef } from 'react';


function Game({imgIndex}: {imgIndex: number}){

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const score_p1 = useRef<HTMLHeadingElement>(null);
	const score_p2 = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const keysPressed: { [key: string]: boolean } = {}; // Change the type of keysPressed
				let KEY_UP = 'ArrowUp';
				let KEY_DOWN = 'ArrowDown';

				window.addEventListener('keydown', function (e) {
					if (e.key === KEY_UP || e.key === KEY_DOWN) {
						keysPressed[e.key] = true; // Access boolean values using string keys
					}
				});

				window.addEventListener('keyup', function (e) {
					if (e.key === KEY_UP || e.key === KEY_DOWN) {
						keysPressed[e.key] = false; // Access boolean values using string keys
					}
				});

				const width = 1908; //canvas.width;
				const height = 1146; //canvas.height;

				let balls: any[] = [];

				let rgb: string | any[] = []
				

				if (imgIndex === 0)
				{
					rgb = [
						"rgb(20, 20, 20)",
						"rgb(50, 50, 50)",
						"rgb(100, 100, 100)",
						"rgb(125, 125, 125)",
						"rgb(160, 160, 160)",
						"rgb(200, 200, 200)",
						"rgb(230, 230, 230)"
					]
				}
				else if (imgIndex === 1)
				{
					rgb = [
						"rgb(0, 0, 0)",
						"rgb(10, 10, 10)",
						"rgb(20, 20, 20)",
						"rgb(30, 30, 30)",
						"rgb(40, 40, 40)",
						"rgb(50, 50, 50)",
						"rgb(60, 60, 60)"
					]
				}



				const getRandomInt = (min: number, max: number) => {
					return Math.round(Math.random() * (max - min)) + min;
				}

				const easeOutQuart = (x: number) => {
					return 1 - Math.pow(1 - x, 4);
				}

				const drawBalls = () => {
					for (let i = 0; i < balls.length; i++) {
						balls[i].update();
						balls[i].draw();
					}
				}

				class Balls {
					start: { x: number; y: number; size: number; };
					end: { x: any; y: any; };
					x: any;
					y: any;
					size: any;
					style: string;
					time: number;
					ttl: number;
					constructor(ball: { pos: { x: number; y: number; }; }) {
						this.start = {
							x: ball.pos.x + getRandomInt(-20, 20),
							y: ball.pos.y + getRandomInt(-20, 20),
							size: getRandomInt(10, 25)
						}
						this.end = {
							x: this.start.x + getRandomInt(-300, 300),
							y: this.start.y + getRandomInt(-300, 300)
						}

						this.x = this.start.x;
						this.y = this.start.y;
						this.size = this.start.size;

						this.style = rgb[getRandomInt(0, rgb.length - 1)];

						this.time = 0;
						this.ttl = 120;
					}
					draw() {
						if (ctx) {
							ctx.fillStyle = this.style;
							ctx.beginPath();
							ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
							ctx.closePath();
							ctx.fill();
						}
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

				canvas.width = width;
				canvas.height = height;

				const drawGameScreen = () => {
					if (ctx) {
						if (imgIndex === 0)
						{
							ctx.fillStyle = '#000000';
						} 
						else if (imgIndex === 1)
						{
							ctx.fillStyle = '#ffffff';
						}


						// Top solid line
						ctx.beginPath();
						ctx.lineWidth = 10;
						ctx.moveTo(0, 0);
						ctx.lineTo(width, 0);
						ctx.stroke();

						// Bottom solid line
						ctx.beginPath();
						ctx.lineWidth = 10;
						ctx.moveTo(0, height);
						ctx.lineTo(width, height);
						ctx.stroke();

						// Middle dashed line
						// ctx.setLineDash([10, 10]); // Set the line dash pattern
						// ctx.beginPath();
						// ctx.lineWidth = 5;
						// ctx.moveTo(width / 2, 0);
						// ctx.lineTo(width / 2, height);
						// ctx.stroke();
						// ctx.setLineDash([]); // Reset the line dash to default (solid)

						// Left solid line
						ctx.beginPath();
						ctx.lineWidth = 15;
						ctx.moveTo(0, 0);
						ctx.lineTo(0, height);
						ctx.stroke();

						// Right solid line
						ctx.beginPath();
						ctx.lineWidth = 15;
						ctx.moveTo(width, 0);
						ctx.lineTo(width, height);
						ctx.stroke();

						// draw cercle in the meddle
						// ctx.beginPath();
						// ctx.lineWidth = 10;
						// ctx.arc(width / 2, height / 2, 100, 0, 2 * Math.PI);
						// ctx.stroke();
					}

				};

				const vec2 = (x: any, y: any) => {
					return { x: x, y: y }
				};


				class ball {
					pos: { x: number; y: number };
					velocity: { x: number; y: number };
					radius: number;

					constructor(pos: { x: number; y: number }, velocity: { x: number; y: number }, radius: number) {
						this.pos = pos;
						this.velocity = velocity;
						this.radius = radius;
					}

					update() {
						this.pos.x += this.velocity.x;
						this.pos.y += this.velocity.y;

						for (let i = 0; i < 3; i++) {
							balls.push(new Balls(this));
						}
					}

					draw(ctx: CanvasRenderingContext2D) {
						if (imgIndex === 0)
						{
							ctx.fillStyle = '#ffffff';
							ctx.strokeStyle = '#ffffff';
						}
						else if (imgIndex === 1)
						{
							ctx.fillStyle = '#000000';
							ctx.strokeStyle = '#000000';
						}
						ctx.beginPath();
						ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
						ctx.fill();
						ctx.stroke();
					}
				}

				class paddle {
					pos: { x: number; y: number };
					velocity: { x: number; y: number };
					width: number;
					height: number;
					score: number;

					constructor(pos: { x: number; y: number }, velocity: { x: number; y: number }, width: number, height: number) {
						this.pos = pos;
						this.velocity = velocity;
						this.width = width;
						this.height = height;
						this.score = 0;
					}

					update(keysPressed: { [key: string]: boolean }) {
						if (keysPressed[KEY_UP]) {
							this.pos.y -= this.velocity.y;
						}

						if (keysPressed[KEY_DOWN]) {
							this.pos.y += this.velocity.y;
						}
					}

					draw(ctx: CanvasRenderingContext2D) {
						if (imgIndex === 1)
							ctx.fillStyle = '#000000';
						else 
							ctx.fillStyle = '#ffffff';
						// ctx.fillStyle = '#ffffff';
						ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
					}

					getHalfWidth() {
						return this.width / 2;
					}

					getHalfHeight() {
						return this.height / 2;
					}

					getCenter() {
						return {
							x: this.pos.x + this.getHalfWidth(),
							y: this.pos.y + this.getHalfHeight(),
						};
					}
				}


				const ballCollisionWithTheEges = (ball: { pos: { y: number; }; radius: number; velocity: { y: number; }; }) => {
					if (ball.pos.y + ball.radius >= height) {
						ball.velocity.y *= -1;
					}

					if (ball.pos.y - ball.radius <= 0) {
						ball.velocity.y *= -1;
					}

					// if (ball.pos.x + ball.radius >= width)
					// {
					//     ball.velocity.x *= -1;
					// }

					// if (ball.pos.x - ball.radius <= 0)
					// {
					//     ball.velocity.x *= -1;
					// }
				};


				const paddleCollisionWithTheEges = (paddle: { pos: { y: number; }; height: number; }) => {
					if (paddle.pos.y <= 0) {
						paddle.pos.y = 0;
					}

					if (paddle.pos.y + paddle.height >= height) {
						paddle.pos.y = height - paddle.height;
					}
				};

				// const ballCollisionWithThePaddle = (
				// 	ball: { pos: { x: number; y: number }; radius: number; velocity: { x: number; y: number } },
				// 	paddle: { getCenter: () => { x: number; y: number }; getHalfWidth: () => number; getHalfHeight: () => number }
				// ) => {
				// 	const dx = Math.abs(ball.pos.x - paddle.getCenter().x);
				// 	const dy = Math.abs(ball.pos.y - paddle.getCenter().y);
				// 	const overlapX = ball.radius + paddle.getHalfWidth() - dx;
				// 	const overlapY = ball.radius + paddle.getHalfHeight() - dy;

				// 	if (dx < ball.radius + paddle.getHalfWidth() && dy < ball.radius + paddle.getHalfHeight()) {
				// 		ball.velocity.x *= -1;

				// 		// Adjust the ball's position based on the overlap
				// 		if (overlapX < overlapY) {
				// 			ball.pos.x += ball.pos.x < paddle.getCenter().x ? -overlapX : overlapX;
				// 		} else {
				// 			ball.pos.y += ball.pos.y < paddle.getCenter().y ? -overlapY : overlapY;
				// 			ball.velocity.y *= -1;

				// 			// Adjust the speed of the ball (you can experiment with the multiplier)
				// 		}
				// 		ball.velocity.y *= 1.1; // Adjust the multiplier as needed
				// 		ball.velocity.x *= 1.1; // Adjust the multiplier as needed
				// 	}
				// };

				const ballCollisionWithThePaddle = (
					ball: { pos: { x: number; y: number }; radius: number; velocity: { x: number; y: number } },
					paddle: { getCenter: () => { x: number; y: number }; getHalfWidth: () => number; getHalfHeight: () => number },
					canvasHeight: number
				  ) => {
					const dx = Math.abs(ball.pos.x - paddle.getCenter().x);
					const dy = Math.abs(ball.pos.y - paddle.getCenter().y);
					const overlapX = ball.radius + paddle.getHalfWidth() - dx;
					const overlapY = ball.radius + paddle.getHalfHeight() - dy;
				  
					if (dx < ball.radius + paddle.getHalfWidth() && dy < ball.radius + paddle.getHalfHeight()) {
					  // Ball collides with the paddle
					  if (overlapX < overlapY) {
						ball.velocity.x *= -1;
				  
						// Adjust the ball's position based on the overlap
						ball.pos.x += ball.pos.x < paddle.getCenter().x ? -overlapX : overlapX;
					  } else {
						ball.velocity.y *= -1;
				  
						// Adjust the ball's position based on the overlap
						ball.pos.y += ball.pos.y < paddle.getCenter().y ? -overlapY : overlapY;
					  }
					  	ball.velocity.y *= 1.05; // Adjust the multiplier as needed
						ball.velocity.x *= 1.05; // Adjust the multiplier as needed
					}
				  
					// Check for collisions with the top and bottom edges
					if (ball.pos.y - ball.radius <= 0 || ball.pos.y + ball.radius >= canvasHeight) {
					  ball.velocity.y *= -1;
					}
				  };
				  
									


				const player2AI = (ball: { velocity: { x: number; }; pos: { y: number; }; }, paddle: { pos: { y: number; }; velocity: { y: number; }; height: number; }) => {
					if (ball.velocity.x > 0) {
						if (ball.pos.y > paddle.pos.y) {
							paddle.pos.y += paddle.velocity.y;

							if (paddle.pos.y + paddle.height >= height) {
								paddle.pos.y = height - paddle.height;
							}
						}

						if (ball.pos.y < paddle.pos.y) {
							paddle.pos.y -= paddle.velocity.y;

							if (paddle.pos.y <= 0) {
								paddle.pos.y = 0;
							}
						}
					}
				};
				const playerAI1 = (
					ball: { velocity: { x: number; }; pos: { y: number; }; },
					paddle: { pos: { y: number; }; velocity: { y: number; }; height: number; },
					height: number
				) => {
					if (ball.velocity.x < 0) { // Adjusted for AI1 based on the ball's velocity
						if (ball.pos.y > paddle.pos.y + paddle.height / 2) {
							paddle.pos.y += paddle.velocity.y;

							if (paddle.pos.y + paddle.height >= height) {
								paddle.pos.y = height - paddle.height;
							}
						}

						if (ball.pos.y < paddle.pos.y + paddle.height / 2) {
							paddle.pos.y -= paddle.velocity.y;

							if (paddle.pos.y <= 0) {
								paddle.pos.y = 0;
							}
						}
					}
				};

				const respawnBall = (ball: { velocity: { x: number; y: number; }; pos: { x: number; y: number; }; }) => {
					if (ball.velocity.x > 0) {
						// ball.pos.x = width - 200;
						ball.pos.x = width / 2;
						ball.pos.y = (Math.random() * (height - 200)) + 100;
						// ball.pos.y = height / 2;
						ball.velocity.x = 7;
						ball.velocity.y = 5;
					}

					if (ball.velocity.x < 0) {
						// ball.pos.x = 200;
						ball.pos.x = width / 2;
						ball.pos.y = (Math.random() * (height - 200)) + 100;
						// ball.pos.y = height / 2;

						ball.velocity.x = -7;
						ball.velocity.y = -5;
					}
					// ball.velocity.x = 5;
					// ball.velocity.y = 5;

					ball.velocity.x *= -1;
					ball.velocity.y *= -1;
				};


				const increaseScore = (ball: { pos: { x: number; y: number }; radius: number; velocity: { x: number; y: number } }, paddle1: { score: number }, paddle2: { score: number }) => {
					if (ball.pos.x >= width + ball.radius) {
						paddle1.score++;
						// Update the h3 tag for player 1 score
						//   score_p1.current!.innerHTML = paddle1.score.toString();
						// Respawn the ball
						respawnBall(ball);
					}

					if (ball.pos.x <= 0 - ball.radius) {
						paddle2.score++;
						// Update the h3 tag for player 2 score

						//   score_p2.current!.innerHTML = paddle2.score.toString();
						// Respawn the ball
						respawnBall(ball);
					}
				};

				let ballObj = new ball(vec2(100, 100), vec2(7, 5), 15);
				let paddle1 = new paddle(vec2(25, 50), vec2(15, 15), 15, 150);
				let paddle2 = new paddle(vec2(width - 40, 50), vec2(15, 15), 15, 150);

				const gameUpdate = (keysPressed: { [key: string]: boolean }) => {
					ballObj.update();
					// paddle1.update(keysPressed);

					paddleCollisionWithTheEges(paddle1);
					ballCollisionWithTheEges(ballObj);
					ballCollisionWithThePaddle(ballObj, paddle1, height);
					ballCollisionWithThePaddle(ballObj, paddle2, height);
					player2AI(ballObj, paddle2);
					playerAI1(ballObj, paddle1, height);
					increaseScore(ballObj, paddle1, paddle2);
				};

				const gameDraw = () => {
					drawGameScreen();
					paddle1.draw(ctx);
					paddle2.draw(ctx);
					ballObj.draw(ctx);
				};

				const gameLoop = () => {
					// if (paddle1.score >= 3 || paddle2.score >= 3) {
					// You may want to perform some actions when the game stops,
					// such as showing a game over message, resetting the scores, etc.
					// 	console.log("Game Over!");
					// 	return;
					//   }
					ctx.clearRect(0, 0, width, height);

					ctx.globalCompositeOperation = 'lighter';

					drawBalls();

					let temp = [];
					for (let i = 0; i < balls.length; i++) {
						if (balls[i].time <= balls[i].ttl) {
							temp.push(balls[i]);
						}
					}
					balls = temp;

					// ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
					// ctx.fillRect(0, 0, width, height);
					requestAnimationFrame(gameLoop);

					gameUpdate(keysPressed);
					gameDraw();
				}

				gameLoop();

			}
		}
	}, [imgIndex]);

	// declare array of images
	const bgimages = ['A1', 'B1', 'C1', 'D1'];

	// const backimage = 'A1';
	return (
		<div className={styles.canvas_container}>
			<canvas
				ref={canvasRef}
				className={styles.game_canvas}
				style={{ backgroundImage: `url('/${bgimages[imgIndex]}.png')` }}
			>
			</canvas>
		</div>
	);
}

export default Game;