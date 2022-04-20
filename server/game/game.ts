import Paddle from "../../src/utils/game/paddle";
import { Action, Game, Score } from "../../src/utils/game/types";
import Ball from "../../src/utils/game/ball";
// import { InputHandler, RemoteInputHandler } from "./input";

// type gameObject = Ball | Paddle;

export default class ServerGame implements Game {
  actionQueue: Action[] = [];

  entities: { left: Paddle; right: Paddle; ball: Ball };
  status: "playing" | "paused" = "paused";
  lastProcessedAction: { left: number; right: number } = {
    left: -1,
    right: -1,
  };
  score: Score = { left: 0, right: 0 };
  nextBounce: number | undefined;

  constructor() {
    this.entities = {
      left: new Paddle({ x: 0, y: 0.5 }, "left", undefined, "server"),
      right: new Paddle({ x: 1, y: 0.5 }, "right", undefined, "server"),
      ball: new Ball({ x: 0.5, y: 0.5 }, this, "server"),
    };
  }

  play() {
    this.status = "playing";
  }

  pause() {
    this.status = "paused";
  }

  update() {
    // let dt = now - this.state.timestamp;
    if (this.status === "playing") {
      let action = this.actionQueue.shift();
      while (action) {
        switch (action.entityId) {
          case "left":
            this.entities.left.applyAction(action);
            this.lastProcessedAction.left = action.inputSeqNumber;
            break;
          case "right":
            this.entities.right.applyAction(action);
            this.lastProcessedAction.right = action.inputSeqNumber;
            break;
          default:
            break;
        }
        action = this.actionQueue.shift();
      }

      if (this.entities.ball.update()) {
        this.entities.ball.nextBounce = -0.3 + 0.6 * Math.random();
        this.nextBounce = this.entities.ball.nextBounce;
      }

      if (this.entities.ball.state.position.x > 1) {
        this.resetBall();
        this.score.left++;
      }
      if (this.entities.ball.state.position.x < 0) {
        this.resetBall();
        this.score.right++;
      }
    } else {
      this.lastProcessedAction.left = Math.max.apply(
        Math,
        this.actionQueue
          .filter(({ entityId }) => entityId === "left")
          .map(function (o) {
            return o.inputSeqNumber;
          })
      );
      this.lastProcessedAction.right = Math.max.apply(
        Math,
        this.actionQueue
          .filter(({ entityId }) => entityId === "right")
          .map(function (o) {
            return o.inputSeqNumber;
          })
      );
      this.actionQueue = [];
    }
  }

  resetBall() {
    this.entities.ball.state = {
      position: { x: 0.5, y: 0.5 },
      velocity: {
        x: Math.random() > 0.5 ? 0.3 : -0.3,
        y: -0.02 + 0.04 * Math.random(),
      },
    };
  }
}
