import React, { FC } from "react";

const Paddle: FC<{ x: number; y: number }> = ({ x, y }) => {
  const size = 20;
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "red",
        position: "absolute",
        top: y - size / 2,
        left: x - size / 2,
      }}
    ></div>
  );
};

export default Paddle;
