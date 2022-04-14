export default class Ball {
  // image: CanvasImageSource
  constructor() {
    this.size = 16;
    this.position = { x: 0, y: 0 };
  }

  update(position) {
    this.position = position;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(
      this.position.x + this.size / 2,
      this.position.y + this.size / 2,
      this.size / 2 - 1,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }
}
