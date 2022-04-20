import React, { useEffect, useRef } from "react";
import { ClientGame } from "./utils/game";

const Pong: React.FC<{ game: ClientGame }> = ({ game }) => {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  let ctx: CanvasRenderingContext2D | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const gid = useMemo(() => game.gid, [game]);

  useEffect(() => {
    // let canvas = document.getElementById('canvas') as HTMLCanvasElement
    // const DISPLAY = true
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        game.setContext(ctx);
        game.render();
        setInterval(() => {
          game.update();
          game.render();
        }, 20);
      }
    }
  }, []);

  return (
    <div>
      <p id="gameId"></p>
      <canvas
        id="canvas"
        ref={canvasRef}
        height={GAME_HEIGHT}
        width={GAME_WIDTH}
      />
    </div>
  );
};

export default Pong;
