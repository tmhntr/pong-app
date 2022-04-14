export class InputHandler {
  constructor(game, keys) {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case keys.up:
          game.moveUp();
          break;

        case keys.down:
          game.moveDown();
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
          if (game.action === 2) game.stop();
          break;

        case keys.down:
          if (game.action === 0) game.stop();
          break;
      }
    });
  }
}
