import React, { useEffect, useRef, useState } from "react";
import { clientGame as Game } from "./clientGame";
import { IO } from "./io";
import useGame from "./clientGame/useGame";

const Pong: React.FC<{}> = ({}) => {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const game = useGame();
  let ctx: CanvasRenderingContext2D | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gid, setGid] = useState("");

  useEffect(() => {
    // let canvas = document.getElementById('canvas') as HTMLCanvasElement
    // const DISPLAY = true
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        game.setContext(ctx);
        game.draw();
      }
    }
  }, []);

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        height={GAME_HEIGHT}
        width={GAME_WIDTH}
      />
      <button onClick={() => game.io.newGame()}>New game</button>
      <input
        type="text"
        value={gid}
        onChange={({ target }) => {
          setGid(target.value);
        }}
      />
      <button
        onClick={() => {
          game.io.joinGame(gid);
          setGid("");
        }}
      >
        Join game
      </button>
    </div>
  );
};

export default Pong;
