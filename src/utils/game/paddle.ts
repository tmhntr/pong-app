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
    if (this.state.position.y <= 0 + this.HEIGHT / 2) {
      this.state.position.y = 0 + this.HEIGHT / 2;
    }
    if (this.state.position.y >= 1 - this.HEIGHT / 2) {
      this.state.position.y = 1 - this.HEIGHT / 2;
    }
  }

  _interpolateOne(
    v_1: number,
    v_2: number,
    t_1: number,
    t_2: number,
    t: number
  ) {
    return v_1 + ((t - t_1) / (t_2 - t_1)) * (v_2 - v_1);
  }
  interpolate(
    pastState: GameObjectState,
    pastTime: number,
    futureState: GameObjectState,
    futureTime: number,
    now: number
  ) {
    this.state.position = {
      x: this._interpolateOne(
        pastState.position.x,
        futureState.position.x,
        pastTime,
        futureTime,
        now
      ),
      y: this._interpolateOne(
        pastState.position.y,
        futureState.position.y,
        pastTime,
        futureTime,
        now
      ),
    };
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
