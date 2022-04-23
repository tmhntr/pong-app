import { IO } from "../io";
import { InputHandler, paddle } from "./helpers";
import { Action, Entities, GameState, GameStatus, ServerUpdate } from "./types";

export const CLIENT_UPDATE_FREQ = 30;

export default class ClientGame {
  stateBuffer: ServerUpdate[] = [];
  actionBuffer: Action[] = [];
  pid: string = "";
  updateInterval?: NodeJS.Timer;
  actionIndex = 0;
  input: InputHandler;
  updateFrequency = CLIENT_UPDATE_FREQ;
  status: GameStatus = "paused";
  update: () => void;
  io: IO;
  prevTime: number = 0;

  constructor(
    setState: (state: GameState) => void,
    setNames: (names: { left: string | null; right: string | null }) => void,
    gid: string,
    name: string
  ) {
    this.input = new InputHandler({
      up: "ArrowUp",
      down: "ArrowDown",
    });
    this.io = new IO(setNames, this);
    this.io.joinGame(gid, name);

    this.update = () => {
      let now = Date.now();
      let dt = now - this.prevTime;
      this.prevTime = now;
      let lastState = this.stateBuffer.slice(-1)[0];
      if (this.status === "playing") {
        let entities = {
          ...this.interpolateEntities(),
        };
        let self = this.updateSelf();
        if (self) entities[this.pid] = self;

        setState({
          entities,
          score: lastState.score,
        });
      } else {
        setState({
          entities: lastState.entities,
          score: lastState.score,
        });
      }
      this.pushAction({
        move: this.input.getAction() * (dt / 1000) * paddle.vy,
        entityId: this.pid,
        inputSeqNumber: ++this.actionIndex,
      });
    };
  }

  interpolateEntities() {
    // Compute render timestamp.
    var now = +new Date();
    var render_timestamp = now - 200.0;

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
        if (
          entityId !== this.pid &&
          entityId in this.stateBuffer[1].entities &&
          entityId in this.stateBuffer[0].entities
        ) {
          let entity0 = this.stateBuffer[0].entities[entityId];
          var x0 = this.stateBuffer[0].entities[entityId].x;
          var x1 = this.stateBuffer[1].entities[entityId].x;
          var y0 = this.stateBuffer[0].entities[entityId].y;
          var y1 = this.stateBuffer[1].entities[entityId].y;
          var t0 = this.stateBuffer[0].timestamp;
          var t1 = this.stateBuffer[1].timestamp;
          updatedEntities[entityId] = {
            ...this.stateBuffer[0].entities[entityId],
            x: x0 + ((x1 - x0) * (render_timestamp - t0)) / (t1 - t0),
            y: y0 + ((y1 - y0) * (render_timestamp - t0)) / (t1 - t0),
          };
        }
      }
    }
    return updatedEntities;
  }

  updateSelf() {
    let [lastState] = this.stateBuffer.slice(-1);
    if (lastState) {
      let entity = lastState.entities[this.pid];
      if (entity) {
        this.actionBuffer = this.actionBuffer.filter(
          (val) => val.inputSeqNumber > entity.actionIndex
        );
        entity.y = this.actionBuffer.reduce((prev, current) => {
          return prev + current.move;
        }, entity.y);

        if (entity.y > 1 - paddle.height / 2) {
          entity.y = 1 - paddle.height / 2;
        }
        if (entity.y < paddle.height / 2) {
          entity.y = paddle.height / 2;
        }

        return entity;
      }
    }
    return null;
  }

  setPid(pid: string) {
    this.pid = pid;
  }

  pushState(state: ServerUpdate) {
    this.status = state.status;
    this.stateBuffer.push(state);
  }

  pushAction(action: Action) {
    this.actionBuffer.push(action);
    this.io.action(action);
    // console.log(this.actionBuffer);
  }

  start() {
    this.prevTime = Date.now();
    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000 / this.updateFrequency);
  }
}
