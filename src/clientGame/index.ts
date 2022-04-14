import { default as Ball } from "./ball";
import { default as Paddle } from "./paddle";
import { v4 as uuid } from "uuid";
import { IO } from "../io";

const { InputHandler } = require("./input");

export type Position = { x: number; y: number };
type Action = 0 | 1 | 2;

export class clientGame {
  action: Action;
  GAME_HEIGHT: number;
  GAME_WIDTH: number;
  ball: Ball;
  lPaddle: Paddle;
  rPaddle: Paddle;
  playerName: null | string;
  oponentName: null | string;
  pid: string;
  ctx?: CanvasRenderingContext2D;
  io: IO;
  gameCountdown() {
    throw new Error("Method not implemented.");
  }
  updateWaitingScreen() {
    throw new Error("Method not implemented.");
  }
  constructor(
    GAME_WIDTH: number,
    GAME_HEIGHT: number,
    ctx?: CanvasRenderingContext2D
  ) {
    this.GAME_HEIGHT = GAME_HEIGHT;
    this.GAME_WIDTH = GAME_WIDTH;
    this.action = 1;
    this.ball = new Ball();
    this.lPaddle = new Paddle(this, "l");
    this.rPaddle = new Paddle(this, "r");
    this.playerName = null;
    this.oponentName = null;
    this.pid = uuid();
    this.ctx = ctx;
    new InputHandler(this, { up: "ArrowUp", down: "ArrowDown" });

    this.io = new IO(this);
  }

  moveUp() {
    this.action = 2;
  }

  moveDown() {
    this.action = 0;
  }

  stop() {
    this.action = 1;
  }

  draw() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
      this.ball.draw(this.ctx);
      this.lPaddle.draw(this.ctx);
      this.rPaddle.draw(this.ctx);
    }
  }

  update(data: {
    ball: { position: Position; velocity: Position };
    lPaddle: Position;
    rPaddle: Position;
  }) {
    this.ball.update(data.ball.position);

    this.lPaddle.update(data.lPaddle);
    this.rPaddle.update(data.rPaddle);

    this.draw();
  }

  setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // setSocketId(id) {
  //   this.socketId = id;
  // }

  getAction() {
    return this.action;
  }

  setAction(action: Action) {
    this.action = action;
  }
}
