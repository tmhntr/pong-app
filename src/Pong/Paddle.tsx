import React, { FC } from "react";
import { paddle } from "./helpers";

const Paddle: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        width: `${paddle.width * 100}%`,
        height: `${paddle.height * 100}%`,
        backgroundColor: "blue",
        position: "absolute",
        top: `${(y - paddle.height / 2) * 100}%`,
        left: `${(x - paddle.width / 2) * 100}%`,
      }}
    ></div>
  );
};

export default Paddle;
