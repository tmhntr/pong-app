import React, { FC } from "react";

const Paddle: FC<{ x: number; y: number }> = ({ x, y }) => {
  const size = 0.025;
  return (
    <div
      style={{
        width: `${size * 100}%`,
        height: `${size * 100}%`,
        backgroundColor: "blue",
        position: "absolute",
        top: `${(y - size / 2) * 100}%`,
        left: `${(x - size / 2) * 100}%`,
      }}
    ></div>
  );
};

export default Paddle;
