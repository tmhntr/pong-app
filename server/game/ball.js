const detectCollision = require("./collisionDetection");
// import { default as BallImage } from '../../assets/images/ball.svg'
// import Game from "./game";

module.exports = class Ball {
  //   gameWidth: number;
  //   gameHeight: number;
  //   game: Game;
  //   size: number;
  //   position: { x: number, y: number };
  //   speed: { x: number, y: number };
  // image: CanvasImageSource
  constructor(game) {
    // this.image = document.getElementById('img_ball') as HTMLImageElement
    // this.image = new Image(16, 16)
    // this.image.src = BallImage
    // this.image = ballImage
    // console.log(this.image)

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.game = game;
    this.size = 16;
    this.reset();
  }

  reset() {
    this.position = { x: this.gameWidth / 2, y: this.gameHeight / 2 };
    this.speed = { x: 40, y: 30 };
  }

  update(deltaTime) {
    this.position.x += (this.speed.x * deltaTime) / 100;
    this.position.y += (this.speed.y * deltaTime) / 100;

    // wall on left
    if (this.position.x <= 0) {
      this.game.score.right += 1;
      this.reset();
      return;
    }
    // wall on right
    if (this.position.x + this.size > this.gameWidth) {
      this.game.score.left += 1;
      this.reset();
      return;
    }

    // wall on top or bottom
    if (this.position.y + this.size > this.gameHeight || this.position.y <= 0) {
      this.speed.y = -this.speed.y;
    }

    if (detectCollision(this, this.game.lpaddle)) {
      this.speed.x = -this.speed.x;
      this.position.x = this.game.lpaddle.width;
    }
    if (detectCollision(this, this.game.rpaddle)) {
      this.speed.x = -this.speed.x;
      this.position.x = this.gameWidth - (this.game.rpaddle.width + this.size);
    }
  }
};
