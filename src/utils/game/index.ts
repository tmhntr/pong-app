import { default as Ball } from "./ball";
import { default as Paddle } from "./paddle";
import { IO } from "../io";
import { Action, GameObjectState, GameState } from "./types";

const { InputHandler } = require("./input");

export function updatePosition(state: GameObjectState, dt: number) {
  return {
    x: state.position.x + (dt / 1000) * state.velocity.x,
    y: state.position.y + (dt / 1000) * state.velocity.y,
  };
}

export class clientGame {
  playerName: null | string = null;
  oponentName: null | string = null;
  gid: string | null = null;
  ctx?: CanvasRenderingContext2D;
  io: IO;
  backgroundImage: HTMLImageElement;
  score = { right: 0, left: 0 };
  actionBuffer: Action[] = [];
  verifiedState: GameState;
  self: Paddle;
  opponent: Paddle;
  ball: Ball;
  gameObjects: (Ball | Paddle)[];

  constructor(ctx?: CanvasRenderingContext2D) {
    this.verifiedState = {
      timestamp: Date.now(),
      index: 1,
      self: {
        position: {
          x: 0,
          y: 0.5,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      },
      opponent: {
        position: {
          x: 1,
          y: 0.5,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      },
      ball: {
        position: {
          x: 0.5,
          y: 0.5,
        },
        velocity: {
          x: 0.01,
          y: 0.01,
        },
      },
    };
    this.self = new Paddle(this.verifiedState.self);
    this.opponent = new Paddle(this.verifiedState.opponent);
    this.ball = new Ball(this.verifiedState.ball);
    this.gameObjects = [this.self, this.opponent, this.ball];
    this.actionBuffer = [];
    this.ctx = ctx;
    new InputHandler(this, { up: "ArrowUp", down: "ArrowDown" });

    this.backgroundImage = new Image();
    this.backgroundImage.src = "/tennis-court.png";

    this.io = new IO(this);
  }

  moveUp() {
    console.log("move up");

    this.actionBuffer.push({
      target: "self",
      payload: { velocity: { x: 0, y: -0.3 } },
      timestamp: Date.now(),
    });
  }

  moveDown() {
    console.log("move down");

    this.actionBuffer.push({
      target: "self",
      payload: { velocity: { x: 0, y: 0.3 } },
      timestamp: Date.now(),
    });
  }

  stop() {
    console.log("stop");

    this.actionBuffer.push({
      target: "self",
      payload: { velocity: { x: 0, y: 0 } },
      timestamp: Date.now(),
    });
  }

  draw() {
    if (this.ctx) {
      // Try draw the background first
      try {
        this.ctx.drawImage(
          this.backgroundImage,
          0,
          0,
          this.backgroundImage.naturalWidth,
          this.backgroundImage.naturalHeight,
          0,
          0,
          this.ctx.canvas.width,
          this.ctx.canvas.height
        );
      } catch (error) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      }

      // Draw the game objects
      this.gameObjects.forEach((obj) => this.ctx && obj.draw(this.ctx));
    }
  }

  update() {
    let now = Date.now();

    // filer out actions that occur in the future and sort in chronological order
    let actions = this.actionBuffer
      .filter((value) => value.timestamp < now)
      .sort((a, b) => a.timestamp - b.timestamp);

    // reset object states to last verified state
    this.self.state = this.verifiedState.self;
    this.opponent.state = this.verifiedState.opponent;
    this.ball.state = this.verifiedState.ball;

    // set starting time as verified timestamp
    let prevTime = this.verifiedState.timestamp;

    // update state from action to action
    let dt: number;
    for (const action of actions) {
      dt = action.timestamp - prevTime;

      this.gameObjects.forEach((obj) => obj.update(dt));

      this[action.target].state = {
        ...this[action.target].state,
        ...action.payload,
      };

      prevTime = action.timestamp;
    }
    this.gameObjects.forEach((obj) => obj.update(now - prevTime));
  }

  setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
}
