import { Action, Position, Score, ServerUpdate } from "../../src/Pong/types";
// import { InputHandler, RemoteInputHandler } from "./input";

// type gameObject = Ball | Paddle;

const paddle = {
  width: 0.025,
  height: 0.3,
  speed: 0.3,
};

const ball = {
  height: 0.025,
  width: 0.025 * (3 / 4),
};
type Entity = { x: number; y: number; actionIndex: number };
export default class ServerGame {
  actionQueue: Action[] = [];
  updateFrequency = 20;
  sendFrequency = 100;
  paddleSpeed = 0.3;
  entities: {
    ball: { x: number; y: number; vx: number; vy: number; actionIndex: number };
    [index: string]: {
      x: number;
      y: number;
      vx?: number;
      vy?: number;
      actionIndex: number;
    };
  };
  status: "playing" | "paused" = "paused";
  score: Score = { left: 0, right: 0 };
  nextBounce: number = 0;

  constructor() {
    this.entities = {
      ball: { x: 0.5, y: 0.5, vx: 0.3, vy: 0, actionIndex: 0 },
    };
  }

  play() {
    this.status = "playing";
  }

  pause() {
    this.status = "paused";
  }

  applyAction(action: Action) {
    if (action.entityId in this.entities) {
      let entity = this.entities[action.entityId];
      this.entities[action.entityId].y =
        entity.y + (action.move * paddle.speed) / this.updateFrequency;
      if (this.entities[action.entityId].actionIndex < action.inputSeqNumber)
        this.entities[action.entityId].actionIndex = action.inputSeqNumber;
    }
  }

  update() {
    // let dt = now - this.state.timestamp;
    if (this.status === "playing") {
      let action = this.actionQueue.shift();
      while (action) {
        this.applyAction(action);

        action = this.actionQueue.shift();
      }

      if (this.updateBall()) {
        this.nextBounce = -0.3 + 0.6 * Math.random();
      }

      if (this.entities.ball.x > 1) {
        this.resetBall();
        this.score.left++;
      }
      if (this.entities.ball.x < 0) {
        this.resetBall();
        this.score.right++;
      }
    } else {
      this.actionQueue.forEach((action) => {
        if (this.entities[action.entityId].actionIndex < action.inputSeqNumber)
          this.entities[action.entityId].actionIndex = action.inputSeqNumber;
      });
      this.actionQueue = [];
    }
  }

  updateBall() {
    let ballEntity = this.entities.ball;
    let x = ballEntity.x + ballEntity.vx / this.updateFrequency;
    let y = ballEntity.y + ballEntity.vy / this.updateFrequency;

    if (y <= 0 + ball.height / 2) {
      y = 0 + ball.height / 2;
      ballEntity.vy = -ballEntity.vy;
    }
    if (y >= 1 - ball.height / 2) {
      y = 1 - ball.height / 2;
      ballEntity.vy = -ballEntity.vy;
    }

    this.entities.ball = {
      ...ballEntity,
      x,
      y,
    };

    for (let entityId in this.entities) {
      if (entityId !== "ball") {
        if (detectCollision(this.entities.ball, this.entities[entityId])) {
          this.entities.ball.x =
            this.entities.ball.x < 0.5
              ? paddle.width / 2 + ball.width / 2
              : 1 - paddle.width / 2 - ball.width / 2;
          this.entities.ball.vx = -this.entities.ball.vx;
          this.entities.ball.vy = this.nextBounce;
          return true;
        }
      }
    }
    return false;
  }

  resetBall() {
    this.entities.ball = {
      x: 0.5,
      y: 0.5,
      vx: Math.random() > 0.5 ? 0.3 : -0.3,
      vy: -0.02 + 0.04 * Math.random(),
      actionIndex: 0,
    };
  }

  getServerState(): ServerUpdate {
    let entities: { [index: string]: Entity } = {};
    for (let entityId in this.entities) {
      entities[entityId] = {
        x: this.entities[entityId].x,
        y: this.entities[entityId].y,
        actionIndex: this.entities[entityId].actionIndex,
      };
    }
    return {
      entities,
      score: this.score,
      status: this.status,
      timestamp: Date.now(),
    };
  }
}

export const detectCollision = (
  ballEntity: Position,
  paddleEntity: Position
) => {
  let bottomOfBall = ballEntity.y + ball.height / 2;
  let topOfBall = ballEntity.y - ball.height / 2;
  let leftOfBall = ballEntity.x - ball.width / 2;
  let rightOfBall = ballEntity.x + ball.width / 2;

  let topOfObject = paddleEntity.y - paddle.height / 2;
  let leftSideOfObject = paddleEntity.x - paddle.width / 2;
  let rightSideOfObject = paddleEntity.x + paddle.width / 2;
  let bottomOfObject = paddleEntity.y + paddle.height / 2;

  if (
    bottomOfBall >= topOfObject &&
    topOfBall <= bottomOfObject &&
    leftOfBall <= rightSideOfObject &&
    rightOfBall >= leftSideOfObject
  ) {
    return true;
  } else {
    return false;
  }
};
