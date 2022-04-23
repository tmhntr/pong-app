import React, { FC } from "react";

const Paddle: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div
      style={{
        width: "2.5%",
        height: "25%",
        backgroundColor: "blue",
        position: "absolute",
        top: `${(y - 0.125) * 100}%`,
        left: `${(x - 0.0125) * 100}%`,
      }}
    ></div>
  );
};

export default Paddle;
