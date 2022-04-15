const Paddle = require("./paddle");
// import { InputHandler, RemoteInputHandler } from "./input";
const Ball = require("./ball");

// type gameObject = Ball | Paddle;

module.exports = class Game {
  pause() {
    this.state = "pause";
  }
  play() {
    this.state = "play";
  }
  reset() {
    this.state = "reset";
  }
  constructor() {
    this.gameWidth = 800;
    this.gameHeight = 600;
    this.ball = new Ball(this);
    this.lpaddle = new Paddle(this, "l");
    this.rpaddle = new Paddle(this, "r");
    this.gameObjects = [];
    this.score = { left: 0, right: 0 };
    this.lastTime = Date.now();
    this.left = null;
    this.right = null;
    this.state = "pause";
  }

  start() {
    this.play();
    this.ball.reset();
    this.gameObjects = [this.ball, this.lpaddle, this.rpaddle];
    this.lastTime = Date.now();
  }

  update() {
    let newTime = Date.now();
    let deltaTime = newTime - this.lastTime;
    this.lastTime = newTime;
    this.state == "play" &&
      this.gameObjects.forEach((object) => object.update(deltaTime));
  }

  observe() {
    return {
      ball: {
        position: this.ball.position,
        velocity: this.ball.speed,
      },
      lPaddle: this.lpaddle.position,
      rPaddle: this.rpaddle.position,
      score: this.score,
    };
  }
};
