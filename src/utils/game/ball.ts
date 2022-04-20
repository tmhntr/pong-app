import { EntityId } from "./clientGame";
import { detectCollision } from "./detectCollision";
import {
  Action,
  CoordinateData,
  Game,
  GameObject,
  GameObjectState,
} from "./types";

// const Ball = {
//   HEIGHT: 16,
//   WIDTH: 16,
//   draw: (position: CoordinateData, ctx: CanvasRenderingContext2D) => {
//     ctx.beginPath();
//     ctx.fillStyle = "red";
//     ctx.arc(position.x, position.y, Ball.HEIGHT / 2 - 1, 0, 2 * Math.PI);
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = 1;
//     ctx.fill();
//     ctx.stroke();
//   },
// };
// export default Ball;

export default class Ball implements GameObject {
  HEIGHT: number = 0.025;
  WIDTH: number = 0.025 * (3 / 4);
  nextBounce: number = 0;
  state: GameObjectState;
  positionBuffer: { position: CoordinateData; timestamp: number }[] = [];
  last_ts: number | undefined;
  inputSeqNumber: number = 0;
  entityId: EntityId = "ball";
  actionBuffer: Action[] = [];
  game: Game;
  mode: "client" | "server";

  constructor(
    position: CoordinateData,
    game: Game,
    mode: "client" | "server" = "client"
  ) {
    this.state = { position, velocity: { x: 0.3, y: 0 } };
    this.game = game;
    this.mode = mode;
  }

  update() {
    // Compute delta time since last update.
    var now_ts = Date.now();
    var last_ts = this.last_ts || now_ts;
    var dt_sec = (now_ts - last_ts) / 1000.0;
    this.last_ts = now_ts;

    // Package player's input.
    var action = {
      moveTime: dt_sec,
      inputSeqNumber: this.inputSeqNumber++,
      entityId: this.entityId,
    };

    // Do client-side prediction.

    // Save this input for later reconciliation.
    this.mode === "client" && this.actionBuffer.push(action);

    return this.applyAction(action);
  }

  applyAction(action: Action) {
    if (this.state.velocity) {
      let x = this.state.position.x + this.state.velocity.x * action.moveTime;
      let y = this.state.position.y + this.state.velocity.y * action.moveTime;

      if (y <= 0 + this.HEIGHT / 2) {
        y = 0 + this.HEIGHT / 2;
        this.state.velocity.y = -this.state.velocity.y;
      }
      if (y >= 1 - this.HEIGHT / 2) {
        y = 1 - this.HEIGHT / 2;
        this.state.velocity.y = -this.state.velocity.y;
      }

      this.state.position = {
        x: x,
        y: y,
      };

      if (detectCollision(this, this.game.entities.left)) {
        this.state.position.x =
          this.game.entities.left.WIDTH / 2 + this.WIDTH / 2;
        this.state.velocity = {
          x: -this.state.velocity.x,
          y: this.nextBounce,
        };
        return true;
      }
      if (detectCollision(this, this.game.entities.right)) {
        this.state.position.x =
          1 - (this.game.entities.right.WIDTH / 2 + this.WIDTH / 2);
        this.state.velocity = {
          x: -this.state.velocity.x,
          y: this.nextBounce,
        };
        return true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let { width, height } = ctx.canvas;

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(
      this.state.position.x * width,
      this.state.position.y * height,
      (this.HEIGHT * height) / 2 - 1,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }
}
