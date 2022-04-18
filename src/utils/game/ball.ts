import { updatePosition } from ".";
import { CoordinateData, GameObject, GameObjectState } from "./types";

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
  WIDTH: number = 0.025;
  state: GameObjectState;

  constructor(state: GameObjectState) {
    this.state = state;
  }

  update(dt: number) {
    this.state.position = updatePosition(this.state, dt);
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