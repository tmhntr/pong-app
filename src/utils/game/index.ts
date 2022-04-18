import { default as Ball } from "./ball";
import { default as Paddle } from "./paddle";
import { IO } from "../io";
import { Action, GameObjectState, GameState, Side } from "./types";

import { InputHandler } from "./input";

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
  actionBuffer: Action[] = [];
  prevVerifiedState: GameState;
  verifiedState: GameState;
  gameObjects: { self: Paddle; opponent: Paddle; ball: Ball };
  side: Side = "left";

  constructor(ctx?: CanvasRenderingContext2D) {
    this.verifiedState = {
      score: { right: 0, left: 0 },
      status: "paused",
      timestamp: Date.now(),
      left: {
        position: { x: 0, y: 0.5 },
        velocity: { x: 0, y: 0 },
      },
      right: {
        position: { x: 1, y: 0.5 },
        velocity: { x: 0, y: 0 },
      },
      ball: {
        position: { x: 0.5, y: 0.5 },
        velocity: { x: 0.01, y: 0.01 },
      },
    };
    this.prevVerifiedState = this.verifiedState;
    this.gameObjects = {
      self: new Paddle(this.verifiedState[this.side]),
      opponent: new Paddle(
        this.verifiedState[this.side === "left" ? "right" : "left"]
      ),
      ball: new Ball(this.verifiedState.ball),
    };
    this.actionBuffer = [];
    this.ctx = ctx;
    new InputHandler(this, { up: "ArrowUp", down: "ArrowDown" });

    this.backgroundImage = new Image();
    this.backgroundImage.src = "/tennis-court.png";

    this.io = new IO(this);
  }

  action(a: Action) {
    this.actionBuffer.push(a);
    this.io.action(a);
  }

  moveUp() {
    this.action({
      payload: { velocity: { x: 0, y: -0.3 } },
      timestamp: Date.now(),
    });
  }

  moveDown() {
    this.action({
      payload: { velocity: { x: 0, y: 0.3 } },
      timestamp: Date.now(),
    });
  }

  stop() {
    this.action({
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
      Object.values(this.gameObjects).forEach(
        (obj) => this.ctx && obj.draw(this.ctx)
      );
    }
  }

  update() {
    let now = Date.now();
    if (this.verifiedState.status === "playing") {
      if (!this.gameObjects.ball)
        this.gameObjects.ball = new Ball(this.verifiedState.ball);
      // filer out actions that occur in the future and sort in chronological order
      let actions = this.actionBuffer
        .filter((value) => value.timestamp < now)
        .sort((a, b) => a.timestamp - b.timestamp);

      // reset object states to last verified state
      this.gameObjects.self.state = this.verifiedState[this.side];
      this.gameObjects.ball.state = this.verifiedState.ball;

      // set starting time as verified timestamp
      let prevTime = this.verifiedState.timestamp;

      // update state from action to action
      let dt: number;
      for (const action of actions) {
        dt = action.timestamp - prevTime;

        this.gameObjects.self.update(dt);
        this.gameObjects.ball.update(dt);

        this.gameObjects.self.state = {
          ...this.gameObjects.self.state,
          ...action.payload,
        };

        prevTime = action.timestamp;
      }
      this.gameObjects.self.update(now - prevTime);
      this.gameObjects.ball.update(now - prevTime);

      this.gameObjects.opponent.interpolate(
        this.prevVerifiedState[this.side === "left" ? "right" : "left"],
        this.prevVerifiedState.timestamp,
        this.verifiedState[this.side === "left" ? "right" : "left"],
        this.verifiedState.timestamp,
        now - 100
      );
    }
  }

  setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
}
