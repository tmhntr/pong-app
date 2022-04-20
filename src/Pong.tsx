import React, { useEffect, useRef, useState } from "react";
import { ClientGame } from "./utils/game";

const Pong: React.FC<{ game: ClientGame }> = ({ game }) => {
  // let GAME_WIDTH = 800;
  // const GAME_HEIGHT = 600;
  let ctx: CanvasRenderingContext2D | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const calculateGameWidth = (width: number) => {
    return width > 1000 ? 800 : width * 0.8;
  };
  const [width, setWidth] = useState<number>(
    calculateGameWidth(window.innerWidth)
  );

  function handleWindowSizeChange() {
    setWidth(calculateGameWidth(window.innerWidth));
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

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
        width={width}
        height={width * (3 / 4)}
      />
    </div>
  );
};

export default Pong;
