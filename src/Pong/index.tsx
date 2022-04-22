import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IO } from "../io";
// import { Namespace } from "socket.io";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { v4 as uuid } from "uuid";

import "./Pong.css";
import { Entities, Entity, GameState, Score, ServerUpdate } from "./types";
import ClientGame from "./clientGame";

import "./Pong.css";

const Pong: React.FC<{ name: string }> = ({ name }) => {
  let params = useParams();
  let gameId = params.gameId || uuid().split("-")[0];

  // const [state, setState] = useState<GameState>({
  //   entities: {},
  //   score: { left: 0, right: 0 },
  // });

  const [score, setScore] = useState<Score>({ left: 0, right: 0 });
  const [entities, setEntities] = useState<Entity[]>([]);

  const setState = (state: { entities?: Entities; score?: Score }) => {
    if (state.entities) setEntities(Object.values(state.entities));
    if (state.score) setScore(state.score);
  };

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
    const game = new ClientGame(setState, setNames, gameId, name);

    game.start();
  }, []);

  return (
    <div>
      <div className="scoreboard">
        <div>{names.left}</div>
        <div>
          {score.left}:{score.right}
        </div>
        <div>{names.right}</div>
      </div>
      <div id="game" ref={gameRef}>
        {entities.map((entity, index) =>
          entity.type === "ball" ? <Ball {...entity} /> : <Paddle {...entity} />
        )}
      </div>
    </div>
  );
};

export default Pong;
