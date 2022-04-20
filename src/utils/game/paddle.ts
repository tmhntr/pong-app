import ClientGame from "./clientGame";
import {
  Action,
  CoordinateData,
  GameObject,
  GameObjectState,
  Side,
} from "./types";

export default class Paddle implements GameObject {
  HEIGHT: number = 0.25;
  WIDTH: number = 0.025;
  speed: number = 0.3;
  move: -1 | 0 | 1 = 0;
  state: GameObjectState;
  positionBuffer: { position: CoordinateData; timestamp: number }[] = [];
  last_ts: number | undefined;
  inputSeqNumber: number = 0;
  entityId: Side;
  actionBuffer: Action[] = [];
  game?: ClientGame;
  mode: "client" | "server";

  constructor(
    position: CoordinateData,
    id: Side,
    game?: ClientGame,
    mode: "client" | "server" = "client"
  ) {
    this.state = { position };
    this.entityId = id;
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
      moveTime: dt_sec * -this.move,
      inputSeqNumber: this.inputSeqNumber++,
      entityId: this.entityId,
    };

    // Do client-side prediction.
    this.applyAction(action);

    // Save this input for later reconciliation.
    this.mode === "client" && this.actionBuffer.push(action);

    if (!!this.game && this.game.side === this.entityId)
      this.game.io.socket.emit("clientAction", { action });
  }

  applyAction(action: Action) {
    let y = this.state.position.y + this.speed * action.moveTime;
    y =
      y >= 1 - this.HEIGHT / 2
        ? 1 - this.HEIGHT / 2
        : y <= 0 + this.HEIGHT / 2
        ? 0 + this.HEIGHT / 2
        : y;
    this.state.position = {
      x: this.state.position.x,
      y: y,
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
