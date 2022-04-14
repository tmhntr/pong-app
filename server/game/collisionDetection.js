// import Ball from "./ball";
// import paddle from "./paddle";

module.exports = function detectCollision(ball, gameObject) {
  let bottomOfBall = ball.position.y + ball.size;
  let topOfBall = ball.position.y;
  let leftOfBall = ball.position.x;
  let rightOfBall = ball.position.x + ball.size;

  let topOfObject = gameObject.position.y;
  let leftSideOfObject = gameObject.position.x;
  let rightSideOfObject = gameObject.position.x + gameObject.width;
  let bottomOfObject = gameObject.position.y + gameObject.height;

  if (
    bottomOfBall >= topOfObject &&
    topOfBall <= bottomOfObject &&
    leftOfBall <= rightSideOfObject &&
    rightOfBall >= leftSideOfObject
  ) {
    return true;
  } else {
    return false;
  }
};
