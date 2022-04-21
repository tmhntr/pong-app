import React, { useEffect, useRef, useState } from "react";
import { ClientGame } from "./utils/game";

import "./Pong.css";
import { stringify } from "querystring";

const Pong: React.FC<{ game: ClientGame }> = ({ game }) => {
  // let GAME_WIDTH = 800;
  // const GAME_HEIGHT = 600;
  let ctx: CanvasRenderingContext2D | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const calculateGameWidth = (width: number) => {
  //   return width > 1000 ? 800 : width * 0.8;
  // };
  // const [width, setWidth] = useState<number>(
  //   calculateGameWidth(window.innerWidth)
  // );
  const [names, setNames] = useState<{
    left: string | null;
    right: string | null;
  }>({
    left: "",
    right: "",
  });

  const [score, setScore] = useState<{ left: number; right: number }>({
    left: 0,
    right: 0,
  });

  function handleWindowSizeChange() {
    if (canvasRef.current) {
      canvasRef.current.width = Math.min(1000, window.innerWidth * 0.9);
      canvasRef.current.height = canvasRef.current.width * (3 / 4);
    }
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
      canvasRef.current.width = Math.min(1000, window.innerWidth * 0.9);
      canvasRef.current.height = canvasRef.current.width * (3 / 4);
      ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        game.setContext(ctx);
        game.render();
        // console.log(game);
        setInterval(() => {
          // console.log(game);

          game.update();
          game.render();
          if (game.score !== score) setScore(game.score);
          if (
            game.playerName !== names[game.side] ||
            game.oponentName !== names[game.side === "left" ? "right" : "left"]
          ) {
            setNames({
              left: game.side === "left" ? game.playerName : game.oponentName,
              right: game.side === "right" ? game.playerName : game.oponentName,
            });
          }
        }, 20);
      }
    }
  }, []);

  return (
    <div>
      <p id="gameId">{game.gid}</p>
      <div className="scoreboard">
        <p>{names.left}</p>
        <p>
          {score.left}:{score.right}
        </p>
        <p>{names.right}</p>
      </div>
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
};

export default Pong;
