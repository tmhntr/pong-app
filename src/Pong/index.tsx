import React, { useEffect, useRef, useState } from "react";
import { ClientGame } from "../utils/game";
import Ball from "./Ball";
import Paddle from "./Paddle";

import "./Pong.css";

type Position = { x: number; y: number };
export type GameState = {
  paddles: { [index: string]: Position };
  ball: Position;
  score: { left: number; right: number };
};

const Pong: React.FC<{ game: ClientGame }> = ({ game }) => {
  const [state, setState] = useState<GameState>({
    paddles: {},
    ball: { x: 0.5, y: 0.5 },
    score: { left: 0, right: 0 },
  });
  const gameRef = useRef<HTMLDivElement>();

  function handleWindowSizeChange() {
    // handle window resize
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    // let canvas = document.getElementById('canvas') as HTMLCanvasElement
    // const DISPLAY = true
  }, []);

  return (
    <div>
      <div className="scoreboard">
        <div>{}</div>
      </div>
      <div id="game" ref={gameRef}>
        {Object.values(state.paddles).map((paddle, index) => (
          <Paddle key={index} {...paddle} />
        ))}
        <Ball {...state.ball} />
      </div>
    </div>
  );
};

export default Pong;
