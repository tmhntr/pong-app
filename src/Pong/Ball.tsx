import React, { FC } from "react";
import { ball } from "./helpers";

const Ball: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        width: `${ball.width * 100}%`,
        height: `${ball.height * 100}%`,
        backgroundColor: "#fff",
        borderRadius: "50%",
        position: "absolute",
        top: `${(y - ball.height / 2) * 100}%`,
        left: `${(x - ball.width / 2) * 100}%`,
        boxShadow: "0 0 8px #fff, 0 0 16px rgba(255,255,255,0.5)",
      }}
    ></div>
  );
};

export default Ball;
