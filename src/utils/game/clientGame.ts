import { IO } from "../io";
import Ball from "./ball";
import { InputHandler } from "./input";
import Paddle from "./paddle";
import { Game, GameObject, GameState, GameStatus, Score, Side } from "./types";
export type EntityId = "ball" | Side;
class ClientGame implements Game {
  side: Side = "left";
  entities: { left: Paddle; right: Paddle; ball: Ball };
  status: GameStatus = "paused";
  score: Score = { left: 0, right: 0 };
  playerName: null | string = null;
  oponentName: null | string = null;
  gid: string | null = null;
  ctx?: CanvasRenderingContext2D;
  io: IO;
  backgroundImage: HTMLImageElement;

  constructor(ctx?: CanvasRenderingContext2D) {
    this.entities = {
      left: new Paddle({ x: 0, y: 0.5 }, "left", this),
      right: new Paddle({ x: 1, y: 0.5 }, "right", this),
      ball: new Ball({ x: 0.5, y: 0.5 }, this),
    };

    this.ctx = ctx;
    new InputHandler(this, { up: "ArrowUp", down: "ArrowDown" });

    this.backgroundImage = new Image();
    this.backgroundImage.src = "/tennis-court.png";

    this.io = new IO(this);
  }

  interpolateEntity(entity: GameObject) {
    // Compute render timestamp.
    var now = +new Date();
    var render_timestamp = now - 1000.0 / 10;

    // Find the two authoritative positions surrounding the rendering timestamp.

    // Drop older positions.
    while (
      entity.positionBuffer.length >= 2 &&
      entity.positionBuffer[1].timestamp <= render_timestamp
    ) {
      entity.positionBuffer.shift();
    }

    // Interpolate between the two surrounding authoritative positions.
    if (
      entity.positionBuffer.length >= 2 &&
      entity.positionBuffer[0].timestamp <= render_timestamp &&
      render_timestamp <= entity.positionBuffer[1].timestamp
    ) {
      var x0 = entity.positionBuffer[0].position.x;
      var x1 = entity.positionBuffer[1].position.x;
      var y0 = entity.positionBuffer[0].position.y;
      var y1 = entity.positionBuffer[1].position.y;
      var t0 = entity.positionBuffer[0].timestamp;
      var t1 = entity.positionBuffer[1].timestamp;

      entity.state.position.x =
        x0 + ((x1 - x0) * (render_timestamp - t0)) / (t1 - t0);
      entity.state.position.y =
        y0 + ((y1 - y0) * (render_timestamp - t0)) / (t1 - t0);
    }
  }

  serverUpdate(state: GameState) {
    this.status = state.status;
    this.score = state.score;
    if (state.nextBounce) this.entities.ball.nextBounce = state.nextBounce;

    let oppSide: Side = this.side === "left" ? "right" : "left";

    // Received the authoritative position of this client's entity.
    Object.values(this.entities).forEach((entity) => {
      if (entity.entityId === oppSide) {
        var timestamp = +new Date();
        entity.positionBuffer.push({
          timestamp,
          position: state.entities[oppSide].position,
        });
      } else {
        entity.state = state.entities[entity.entityId];

        // Server Reconciliation. Re-apply all the inputs not yet processed by
        // the server.
        var j = 0;
        while (j < entity.actionBuffer.length) {
          var action = entity.actionBuffer[j];
          if (action.inputSeqNumber <= state.index) {
            // Already processed. Its effect is already taken into account into the world update
            // we just got, so we can drop it.
            entity.actionBuffer.splice(j, 1);
          } else {
            // Not processed by the server yet. Re-apply it.
            entity.applyAction(action);
            j++;
          }
        }
      }
    });
  }

  update() {
    if (this.status === "paused") {
      Object.values(this.entities).forEach(
        (entity) => (entity.last_ts = Date.now())
      );
      return;
    }

    this.entities[this.side].update();
    this.entities.ball.update();

    this.interpolateEntity(
      this.entities[this.side === "left" ? "right" : "left"]
    );
  }

  render() {
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
      Object.values(this.entities).forEach(
        (entity) => this.ctx && entity.draw(this.ctx)
      );
    }
  }

  moveUp() {
    this.entities[this.side].move = 1;
  }

  moveDown() {
    this.entities[this.side].move = -1;
  }

  stop() {
    this.entities[this.side].move = 0;
  }

  pause() {
    this.status = "paused";
  }

  play() {
    this.status = "playing";
  }

  setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
}

export default ClientGame;
