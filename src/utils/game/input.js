export class InputHandler {
  touchHandler(game) {
    if (game.ctx) {
      let canvas = game.ctx.canvas;
      canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        let canvas = document.getElementById("canvas");
        if (canvas) {
          // event.preventDefault();

          if (this.currentTouchId === null) {
            let canvasRect = canvas.getBoundingClientRect();

            let touch = event.changedTouches[0];
            this.currentTouchId = touch.identifier;

            if (touch.clientY < (canvasRect.top + canvasRect.bottom) / 2) {
              game.moveUp();
            } else if (
              touch.clientY >=
              (canvasRect.top + canvasRect.bottom) / 2
            ) {
              game.moveDown();
            }
          }
        }
      });

      canvas.addEventListener("touchend", (event) => {
        event.preventDefault();
        // console.log(this.currentTouchId);
        // console.log(event.changedTouches.item(0));

        for (let i = 0; i < event.changedTouches.length; i++) {
          if (event.changedTouches.item(i).identifier === this.currentTouchId) {
            this.currentTouchId = null;
            game.stop();
          }
        }
      });

      canvas.addEventListener("touchcancel", (event) => {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
          if (event.changedTouches.item(i).identifier === this.currentTouchId) {
            this.currentTouchId = null;
            game.stop();
          }
        }
      });

      canvas.addEventListener("touchmove", (event) => {
        let canvas = document.getElementById("canvas");
        event.preventDefault();
        // console.log(this.currentTouchId);

        if (canvas) {
          // event.preventDefault();

          if (this.currentTouchId) {
            for (let i = 0; i < event.changedTouches.length; i++) {
              if (
                event.changedTouches.item(i).identifier === this.currentTouchId
              ) {
                let touch = event.changedTouches.item(i);
                let canvasRect = canvas.getBoundingClientRect();

                if (touch.clientY < (canvasRect.top + canvasRect.bottom) / 2) {
                  game.moveUp();
                  this.action = 1;
                } else if (
                  touch.clientY >=
                  (canvasRect.top + canvasRect.bottom) / 2
                ) {
                  game.moveDown();
                  this.action = -1;
                }
              }
            }
          }
        }
      });
    }
  }

  constructor(game, keys) {
    this.currentTouchId = null;
    this.action = 0;

    this.touchHandler(game);

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case keys.up:
          event.preventDefault();
          game.moveUp();
          this.action = 2;
          break;

        case keys.down:
          game.moveDown();
          event.preventDefault();
          this.action = 0;
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
          if (this.action === 2) game.stop();
          this.action = 1;
          break;

        case keys.down:
          if (this.action === 0) game.stop();
          this.action = 1;
          break;
        default:
          break;
      }
    });
  }
}
