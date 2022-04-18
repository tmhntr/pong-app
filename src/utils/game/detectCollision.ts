import { GameObject } from "./types";

const detectCollision = (ball: GameObject, paddle: GameObject) => {
  let bottomOfBall = ball.state.position.y + ball.HEIGHT;
  let topOfBall = ball.state.position.y;
  let leftOfBall = ball.state.position.x;
  let rightOfBall = ball.state.position.x + ball.WIDTH;

  let topOfObject = paddle.state.position.y;
  let leftSideOfObject = paddle.state.position.x;
  let rightSideOfObject = paddle.state.position.x + paddle.WIDTH;
  let bottomOfObject = paddle.state.position.y + paddle.HEIGHT;

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
