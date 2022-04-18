import { updatePosition } from ".";
import { GameObject, GameObjectState } from "./types";

export default class Paddle implements GameObject {
  HEIGHT: number = 0.25;
  WIDTH: number = 0.025;
  state: GameObjectState;

  constructor(state: GameObjectState) {
    this.state = state;
  }

  update(dt: number) {
    this.state.position = updatePosition(this.state, dt);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // get canvas dimensions to transform drawing
    let { width, height } = ctx.canvas;

    ctx.fillStyle = "#0ff";
    ctx.fillRect(
      (this.state.position.x - this.WIDTH / 2) * width,
      (this.state.position.y - this.HEIGHT / 2) * height,
      this.WIDTH * width,
      this.HEIGHT * height
    );
  }
}
