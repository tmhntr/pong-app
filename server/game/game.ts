import Paddle from "../../src/utils/game/paddle";
import {
  CoordinateData,
  GameObjectState,
  GameState,
} from "../../src/utils/game/types";
import Ball from "../../src/utils/game/ball";
import { detectCollision } from "../../src/utils/game/detectCollision";
// import { InputHandler, RemoteInputHandler } from "./input";

// type gameObject = Ball | Paddle;

export type ServerAction = {
  player: "left" | "right";
  timestamp: number;
  payload: {
    velocity: CoordinateData;
  };
};
export type ServerGameState = {
  timestamp: number;
  score: { left: number; right: number };
  left: GameObjectState;
  right: GameObjectState;
  ball: GameObjectState;
};

export default class ServerGame {
  actionBuffer: ServerAction[] = [];
  state: GameState;
  gameObjects: { left: Paddle; right: Paddle; ball: Ball };

  constructor() {
    this.state = {
      status: "paused",
      timestamp: Date.now(),
      score: { left: 0, right: 0 },
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
        velocity: { x: 0.05, y: 0.05 },
      },
    };
    this.gameObjects = {
      left: new Paddle(this.state.left),
      right: new Paddle(this.state.right),
      ball: new Ball(this.state.ball),
    };
  }

  play() {
    this.state.status = "playing";
  }

  pause() {
    this.state.status = "paused";
  }

  _updateGameObjects(dt: number) {
    Object.values(this.gameObjects).forEach((obj) => obj.update(dt));

    // detect ball out of bounds
    if (this.gameObjects.ball.state.position.x <= 0) {
      this.resetBall();
      this.state.score.right += 1;
    }
    if (this.gameObjects.ball.state.position.x >= 1) {
      this.resetBall();
      this.state.score.left += 1;
    }

    // detect bounce left
    if (detectCollision(this.gameObjects.ball, this.gameObjects.left)) {
      this.gameObjects.ball.state = {
        position: {
          x: this.gameObjects.left.WIDTH / 2 + this.gameObjects.ball.WIDTH / 2,
          y: this.gameObjects.ball.state.position.y,
        },
        velocity: {
          x: -this.gameObjects.ball.state.velocity.x,
          y: this.gameObjects.ball.state.velocity.y,
        },
      };
    }

    // detect bounce right
    if (detectCollision(this.gameObjects.ball, this.gameObjects.right)) {
      this.gameObjects.ball.state = {
        position: {
          x:
            1 -
            this.gameObjects.right.WIDTH / 2 -
            this.gameObjects.ball.WIDTH / 2,
          y: this.gameObjects.ball.state.position.y,
        },
        velocity: {
          x: -this.gameObjects.ball.state.velocity.x,
          y: this.gameObjects.ball.state.velocity.y,
        },
      };
    }
  }

  update() {
    let now = Date.now();
    // let dt = now - this.state.timestamp;

    if (this.state.status === "playing") {
      let actions = this.actionBuffer
        .filter((value) => value.timestamp < now)
        .sort((a, b) => a.timestamp - b.timestamp);

      let prevTime = this.state.timestamp;
      let dt: number;
      for (const action of actions) {
        dt = action.timestamp - prevTime;

        this._updateGameObjects(dt);

        this.gameObjects[action.player].state = {
          ...this.gameObjects[action.player].state,
          ...action.payload,
        };

        prevTime = action.timestamp;
      }

      // final update for all objects
      this._updateGameObjects(now - prevTime);
    }

    this.state = {
      ...this.state,
      timestamp: now,
      ball: this.gameObjects.ball.state,
      left: this.gameObjects.left.state,
      right: this.gameObjects.right.state,
    };

    this.actionBuffer = this.actionBuffer.filter((val) => val.timestamp > now);
  }

  resetBall() {
    this.gameObjects.ball.state = {
      position: { x: 0.5, y: 0.5 },
      velocity: {
        x: Math.random() > 0.5 ? 0.01 : -0.01,
        y: -0.02 + 0.04 * Math.random(),
      },
    };
  }
}
