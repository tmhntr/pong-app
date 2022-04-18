import React, { useState } from "react";
import Pong from "./Pong";
import { clientGame } from "./utils/game";

const WaitingPage: React.FC<{ game: clientGame }> = ({ game }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("Player");
  const [waiting, setWaiting] = useState(true);

  const newGame = () => {
    game.io.newGame(name);
    setWaiting(false);
  };
  const joinGame = () => {
    game.io.joinGame(code, name);
    setWaiting(false);
  };

  return (
    <div className="container">
      <h1>Pong!</h1>
      {waiting ? (
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
      ) : (
        <Pong game={game} />
      )}
    </div>
  );
};

export default WaitingPage;
