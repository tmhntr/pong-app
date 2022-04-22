import { Key } from "react";
import { Entities, GameState, ServerUpdate } from "./types";

export class InputHandler {
  currentTouchId: number | null;
  action: -1 | 0 | 1;
  touchHandler(ref: React.RefObject<HTMLDivElement>) {
    let div = ref.current;
    if (div) {
      div.addEventListener("touchstart", (event) => {
        event.preventDefault();

        if (this.currentTouchId === null) {
          let canvasRect = div?.getBoundingClientRect();

          let touch = event.changedTouches[0];
          this.currentTouchId = touch.identifier;

          if (canvasRect) {
            if (touch.clientY < (canvasRect.top + canvasRect.bottom) / 2) {
              this.action = 1;
            } else if (
              touch.clientY >=
              (canvasRect.top + canvasRect.bottom) / 2
            ) {
              this.action = -1;
            }
          }
        }
      });

      div.addEventListener("touchend", (event) => {
        event.preventDefault();
        // console.log(this.currentTouchId);
        // console.log(event.changedTouches.item(0));

        for (let i = 0; i < event.changedTouches.length; i++) {
          if (
            event.changedTouches.item(i)?.identifier === this.currentTouchId
          ) {
            this.currentTouchId = null;
            this.action = 0;
          }
        }
      });

      div?.addEventListener("touchcancel", (event) => {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
          if (
            event.changedTouches.item(i)?.identifier === this.currentTouchId
          ) {
            this.currentTouchId = null;
            this.action = 0;
          }
        }
      });

      div.addEventListener("touchmove", (event) => {
        event.preventDefault();
        // console.log(this.currentTouchId);

        // event.preventDefault();

        if (this.currentTouchId) {
          for (let i = 0; i < event.changedTouches.length; i++) {
            if (
              event.changedTouches.item(i)?.identifier === this.currentTouchId
            ) {
              let touch = event.changedTouches.item(i);
              let canvasRect = div?.getBoundingClientRect();

              if (canvasRect && touch) {
                if (touch.clientY < (canvasRect.top + canvasRect.bottom) / 2) {
                  this.action = 1;
                } else if (
                  touch.clientY >=
                  (canvasRect.top + canvasRect.bottom) / 2
                ) {
                  this.action = -1;
                }
              }
            }
          }
        }
      });
    }
  }

  constructor(
    keys: { up: Key; down: Key },
    ref?: React.RefObject<HTMLDivElement>
  ) {
    this.currentTouchId = null;
    this.action = 0;

    ref && this.touchHandler(ref);

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case keys.up:
          event.preventDefault();
          this.action = 1;
          break;

        case keys.down:
          event.preventDefault();
          this.action = -1;
          break;
        default:
          break;

        // case 'P':
        //   game.togglePause()
        //   break

        // case 'Enter':
        //   game.start()
        //   break
      }
    });

    document.addEventListener("keyup", (event) => {
      switch (event.key) {
        case keys.up:
          if (this.action === 1) this.action = 0;
          break;

        case keys.down:
          if (this.action === -1) this.action = 0;
          break;
        default:
          break;
      }
    });
  }

  getAction() {
    return this.action;
  }
}
