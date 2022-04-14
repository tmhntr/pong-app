// import Game from "./game";
// type Side = "l" | "r";

module.exports = class Paddle {
  //   gameWidth: number;
  //   width: number;
  //   height: number;
  //   maxSpeed: number;
  //   speed: number;
  //   position: { x: number, y: number };
  //   game: Game;
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
          y: game.gameHeight / 2 - this.height / 2,
        };
        break;
      case "r":
        this.position = {
          x: game.gameWidth - this.width,
          y: game.gameHeight / 2 - this.height / 2,
        };
        break;
    }
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

  update(deltaTime) {
    this.position.y += (this.speed * deltaTime) / 10;

    if (this.position.y < 0) this.position.y = 0;

    if (this.position.y + this.height > this.game.gameHeight)
      this.position.y = this.game.gameHeight - this.height;
  }

  getPosition() {
    return this.position;
  }
};
