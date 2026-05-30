import React, { FC } from "react";
import { paddle } from "./helpers";

const Paddle: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        width: `${paddle.width * 100}%`,
        height: `${paddle.height * 100}%`,
        backgroundColor: "#00ff88",
        position: "absolute",
        top: `${(y - paddle.height / 2) * 100}%`,
        left: `${(x - paddle.width / 2) * 100}%`,
        boxShadow: "0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.4)",
      }}
    ></div>
  );
};

export default Paddle;
