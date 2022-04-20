import { GameObject } from "./types";

export const detectCollision = (ball: GameObject, paddle: GameObject) => {
  let bottomOfBall = ball.state.position.y + ball.HEIGHT / 2;
  let topOfBall = ball.state.position.y - ball.HEIGHT / 2;
  let leftOfBall = ball.state.position.x - ball.WIDTH / 2;
  let rightOfBall = ball.state.position.x + ball.WIDTH / 2;

  let topOfObject = paddle.state.position.y - paddle.HEIGHT / 2;
  let leftSideOfObject = paddle.state.position.x - paddle.WIDTH / 2;
  let rightSideOfObject = paddle.state.position.x + paddle.WIDTH / 2;
  let bottomOfObject = paddle.state.position.y + paddle.HEIGHT / 2;

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
