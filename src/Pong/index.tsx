import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Ball from "./Ball";
import Paddle from "./Paddle";
import { v4 as uuid } from "uuid";
import { Entities, Entity, Score } from "./types";
import ClientGame from "./clientGame";

import "./Pong.css";

const Pong: React.FC<{ name: string }> = ({ name }) => {
  let params = useParams();
  let gameId = params.gameId || uuid().split("-")[0];

  const [score, setScore] = useState<Score>({ left: 0, right: 0 });
  const [entities, setEntities] = useState<Entity[]>([]);
  const [winner, setWinner] = useState<"left" | "right" | null>(null);

  const setState = (state: { entities?: Entities; score?: Score }) => {
    if (state.entities) setEntities(Object.values(state.entities));
    if (state.score) setScore(state.score);
  };

  const [names, setNames] = useState<{
    left: string | null;
    right: string | null;
  }>({ left: "", right: "" });

  const gameRef = useRef<ClientGame | null>(null);

  useEffect(() => {
    const game = new ClientGame(setState, setNames, setWinner, gameId, name);
    gameRef.current = game;
    game.start();
  }, []);

  const handleRematch = () => {
    if (gameRef.current) {
      gameRef.current.io.rematch();
      setWinner(null);
    }
  };

  return (
    <div>
      <div className="scoreboard">
        <div>{names.left}</div>
        <div>
          {score.left}:{score.right}
        </div>
        <div>{names.right}</div>
      </div>
      <div id="game">
        {entities.map((entity, index) =>
          entity.type === "ball" ? (
            <Ball key={index} {...entity} />
          ) : (
            <Paddle key={index} {...entity} />
          )
        )}
        {winner && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>{winner === "left" ? names.left : names.right} wins!</h2>
              <button className="rematch-btn" onClick={handleRematch}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pong;
