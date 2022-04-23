import {
  Action,
  Entities,
  Position,
  Score,
  ServerUpdate,
} from "../../src/Pong/types";
import { CLIENT_UPDATE_FREQ } from "../../src/Pong/clientGame";
// import { InputHandler, RemoteInputHandler } from "./input";
import { v4 as uuid } from "uuid";
import { ball, paddle } from "../../src/Pong/helpers";
// type gameObject = Ball | Paddle;

export default class ServerGame {
  actionQueue: Action[] = [];
  updateFrequency = 10;
  sendFrequency = 10;
  entities: Entities = {};
  status: "playing" | "paused" = "paused";
  score: Score = { left: 0, right: 0 };
  nextBounce: number = 0;

  constructor() {
    this.entities = {};
    this.resetBall();
  }

  play() {
    this.status = "playing";
  }

  pause() {
    this.status = "paused";
  }

  applyAction(action: Action) {
    try {
      if (this.entities[action.entityId]) {
        this.entities[action.entityId].y += action.move;
        if (
          !this.entities[action.entityId].actionIndex ||
          this.entities[action.entityId].actionIndex < action.inputSeqNumber
        )
          this.entities[action.entityId].actionIndex = action.inputSeqNumber;
      }
    } catch (error) {
      console.log(error);
    }
  }

  update() {
    // let dt = now - this.state.timestamp;

    if (this.status === "playing") {
      while (this.actionQueue.length > 0) {
        let action = this.actionQueue.shift();
        action && this.applyAction(action);
      }

      Object.keys(this.entities).forEach((key) => {
        if (this.entities[key].type === "paddle") {
          if (this.entities[key].y > 1 - paddle.height / 2) {
            this.entities[key].y = 1 - paddle.height / 2;
          }
          if (this.entities[key].y < paddle.height / 2) {
            this.entities[key].y = paddle.height / 2;
          }
        }
      });

      let ballEntity = this.updateBall();

      if (ballEntity) {
        if (ballEntity.x > 1) {
          this.resetBall();
          this.score.left++;
        }
        if (ballEntity.x < 0) {
          this.resetBall();
          this.score.right++;
        }
      }
    } else {
      this.actionQueue = [];
    }
  }

  updateBall() {
    let ballId = Object.keys(this.entities).find(
      (key) => this.entities[key].type === "ball"
    );

    if (ballId) {
      this.entities[ballId].x =
        this.entities[ballId].x + ball.vx / this.updateFrequency;
      this.entities[ballId].y =
        this.entities[ballId].y - ball.vy / this.updateFrequency;

      if (this.entities[ballId].y <= 0 + ball.height / 2) {
        this.entities[ballId].y = 0 + ball.height / 2;
        ball.vy = -ball.vy;
      }
      if (this.entities[ballId].y >= 1 - ball.height / 2) {
        this.entities[ballId].y = 1 - ball.height / 2;
        ball.vy = -ball.vy;
      }

      for (let entityId in this.entities) {
        if (entityId !== ballId) {
          if (detectCollision(this.entities[ballId], this.entities[entityId])) {
            if (this.entities[ballId].x < 0.5) {
              this.entities[ballId].x = paddle.width / 2 + ball.width / 2;
              ball.vx = Math.abs(ball.vx);
            }
            if (this.entities[ballId].x > 0.5) {
              this.entities[ballId].x = 1 - paddle.width / 2 - ball.width / 2;
              ball.vx = -Math.abs(ball.vx);
            }
            ball.vy = this.nextBounce;
            this.nextBounce = -0.2 + 0.4 * Math.random();
          }
        }
      }

      return this.entities[ballId];
    }
    return null;
  }

  resetBall() {
    Object.keys(this.entities).forEach((id) => {
      if (this.entities[id].type === "ball") delete this.entities[id];
    });
    ball.vy = this.nextBounce;
    ball.vx = Math.random() < 0.5 ? -0.25 : 0.25;
    this.nextBounce = -0.2 + 0.4 * Math.random();
    this.entities[uuid().split("-")[0]] = {
      x: 0.5,
      y: 0.5,
      actionIndex: 0,
      type: "ball",
    };
  }

  getServerState(): ServerUpdate {
    return {
      entities: this.entities,
      score: this.score,
      status: this.status,
      timestamp: Date.now(),
    };
  }
}

const detectCollision = (ballEntity: Position, paddleEntity: Position) => {
  let topOfBall = ballEntity.y - ball.height / 2;
  let bottomOfBall = ballEntity.y + ball.height / 2;
  let leftOfBall = ballEntity.x - ball.width / 2;
  let rightOfBall = ballEntity.x + ball.width / 2;

  let topOfObject = paddleEntity.y - paddle.height / 2;
  let bottomOfObject = paddleEntity.y + paddle.height / 2;
  let leftSideOfObject = paddleEntity.x - paddle.width / 2;
  let rightSideOfObject = paddleEntity.x + paddle.width / 2;

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
