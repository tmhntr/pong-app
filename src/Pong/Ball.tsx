import React, { FC } from "react";
import { ball } from "./helpers";

const Ball: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        width: `${ball.width * 100}%`,
        height: `${ball.height * 100}%`,
        backgroundColor: "white",
        borderRadius: "50%",
        position: "absolute",
        top: `${(y - ball.height / 2) * 100}%`,
        left: `${(x - ball.width / 2) * 100}%`,
      }}
    ></div>
  );
};

export default Ball;
