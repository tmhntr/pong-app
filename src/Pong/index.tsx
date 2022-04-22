import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IO } from "../io";
// import { Namespace } from "socket.io";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { v4 as uuid } from "uuid";

import "./Pong.css";
import { GameState, ServerUpdate } from "./types";
import ClientGame from "./clientGame";

import "./Pong.css";

const Pong: React.FC<{ name: string }> = ({ name }) => {
  let params = useParams();
  let gameId = params.gameId || uuid().split("-")[0];

  const [state, setState] = useState<GameState>({
    entities: {},
    score: { left: 0, right: 0 },
  });
  const [pid, setPid] = useState<string | null>(null);
  const [names, setNames] = useState<{
    left: string | null;
    right: string | null;
  }>({ left: "", right: "" });

  const gameRef = useRef<HTMLDivElement>(null);

  // function handleWindowSizeChange() {
  //   // handle window resize
  // }

  // useEffect(() => {
  //   window.addEventListener("resize", handleWindowSizeChange);
  //   return () => {
  //     window.removeEventListener("resize", handleWindowSizeChange);
  //   };
  // }, []);

  useEffect(() => {
    const game = new ClientGame(setState);

    const IOhandler = new IO(setPid, setNames, game);
    IOhandler.joinGame(gameId, name);
    game.start();
    setInterval(() => console.log(state), 5000);
  }, []);

  return (
    <div>
      <div className="scoreboard">
        <div>{names.left}</div>
        <div>
          {state.score.left}:{state.score.right}
        </div>
        <div>{names.right}</div>
      </div>
      <div id="game" ref={gameRef}>
        {Object.keys(state.entities).map((entityId, index) =>
          entityId === "ball" ? (
            <Ball {...state.entities[entityId]} />
          ) : (
            <Paddle {...state.entities[entityId]} />
          )
        )}
      </div>
    </div>
  );
};

export default Pong;
