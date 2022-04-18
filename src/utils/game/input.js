export class InputHandler {
  constructor(game, keys) {
    this.action = 1;
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case keys.up:
          this.action !== 2 && game.moveUp();
          this.action = 2;
          break;

        case keys.down:
          this.action !== 0 && game.moveDown();
          this.action = 0;
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
      }
    });
  }
}
