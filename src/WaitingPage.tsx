import React, { useState } from "react";
import Pong from "./Pong";
import { ClientGame } from "./utils/game";

const WaitingPage: React.FC<{ game: ClientGame; onPlay: () => void }> = ({
  game,
  onPlay,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("Player");

  const newGame = () => {
    game.io.newGame(name);
    onPlay();
  };
  const joinGame = () => {
    game.io.joinGame(code, name);
    onPlay();
  };

  return (
    <>
      <div>
        <input
          placeholder="display name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        ></input>
      </div>
      <button onClick={newGame}>Start new game</button>
      <p>OR</p>
      <input
        placeholder="game code"
        value={code}
        onChange={({ target }) => setCode(target.value)}
      ></input>
      <button onClick={joinGame}>Join game</button>
    </>
  );
};

export default WaitingPage;
