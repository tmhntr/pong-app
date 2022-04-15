export default class Paddle {
  constructor(game, side) {
    this.game = game;

    this.width = 20;
    this.height = 150;

    this.maxSpeed = 7;
    this.speed = 0;

    switch (side) {
      case "l":
        this.position = {
          x: 0,
          y: game.GAME_HEIGHT / 2 - this.height / 2,
        };
        break;
      case "r":
        this.position = {
          x: game.GAME_WIDTH - this.width,
          y: game.GAME_HEIGHT / 2 - this.height / 2,
        };
        break;
    }
  }
  update(position) {
    this.position.y = position.y;
  }

  moveUp() {
    this.speed = -this.maxSpeed;
  }

  moveDown() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  //   update(deltaTime) {
  //     this.position.y += (this.speed * deltaTime) / 10;

  //     if (this.position.y < 0) this.position.y = 0;

  //     if (this.position.y + this.height > this.game.gameHeight)
  //       this.position.y = this.game.gameHeight - this.height;
  //   }

  getPosition() {
    return this.position;
  }
}
