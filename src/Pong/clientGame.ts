import { isEntityName } from "typescript";
import { InputHandler } from "./helpers";
import { Action, Entities, GameState, GameStatus, ServerUpdate } from "./types";

export default class ClientGame {
  stateBuffer: ServerUpdate[] = [];
  actionBuffer: Action[] = [];
  pid: string = "";
  updateInterval?: NodeJS.Timer;
  actionIndex = 0;
  setState: (state: GameState) => void;
  input: InputHandler;
  updateFrequency = 20;
  status: GameStatus = "paused";

  constructor(setState: (state: GameState) => void) {
    this.input = new InputHandler({
      up: "ArrowUp",
      down: "ArrowDown",
    });
    this.setState = setState;
  }

  interpolateEntities() {
    // Compute render timestamp.
    var now = +new Date();
    var render_timestamp = now - 1000.0 / 10;

    const updatedEntities: Entities = {};

    // Find the two authoritative positions surrounding the rendering timestamp.

    // Drop older positions.
    while (
      this.stateBuffer.length >= 2 &&
      this.stateBuffer[1].timestamp <= render_timestamp
    ) {
      this.stateBuffer.shift();
    }

    // Interpolate between the two surrounding authoritative positions.
    if (
      this.stateBuffer.length >= 2 &&
      this.stateBuffer[0].timestamp <= render_timestamp &&
      render_timestamp <= this.stateBuffer[1].timestamp
    ) {
      for (let entityId in this.stateBuffer[0].entities) {
        if (entityId !== this.pid && entityId in this.stateBuffer[1].entities) {
          var x0 = this.stateBuffer[0].entities[entityId].x;
          var x1 = this.stateBuffer[1].entities[entityId].x;
          var y0 = this.stateBuffer[0].entities[entityId].y;
          var y1 = this.stateBuffer[1].entities[entityId].y;
          var t0 = this.stateBuffer[0].timestamp;
          var t1 = this.stateBuffer[1].timestamp;
          updatedEntities[entityId] = {
            x: x0 + ((x1 - x0) * (render_timestamp - t0)) / (t1 - t0),
            y: y0 + ((y1 - y0) * (render_timestamp - t0)) / (t1 - t0),
          };
        }
      }
    }
    return updatedEntities;
  }

  updateSelf() {
    this.pushAction({
      move: this.input.getAction(),
      entityId: this.pid,
      inputSeqNumber: this.actionIndex++,
    });
    let [lastState] = this.stateBuffer.slice(-1);
    if (lastState) {
      let entity = lastState.entities[this.pid];
      if (entity) {
        while (
          this.actionBuffer.length > 0 &&
          this.actionBuffer[0].inputSeqNumber <= entity.actionIndex
        ) {
          this.actionBuffer.shift();
        }
        this.actionBuffer.forEach((action) => {
          entity.x += (action.move * 0.3) / this.updateFrequency;
        });
        return entity;
      }
    }

    return {};
  }

  update() {
    if (this.status === "playing") {
      this.setState({
        entities: {
          ...this.interpolateEntities(),
          ...this.updateSelf(),
        },
        score: this.stateBuffer.slice(-1)[0].score,
      });
    }
  }

  setPid(pid: string) {
    this.pid = pid;
  }

  pushState(state: ServerUpdate) {
    console.log(this);

    this.status = state.status;
    this.stateBuffer.push(state);
  }

  pushAction(action: Action) {
    this.actionBuffer.push(action);
  }

  start() {
    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000 / this.updateFrequency);
  }
}
