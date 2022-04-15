import React, { useEffect, useState } from "react";
import Pong from "./Pong";
import { clientGame } from "./utils/game";

const WaitingPage: React.FC<{ game: clientGame }> = ({ game }) => {
  const [code, setCode] = useState("");
  const [waiting, setWaiting] = useState(true);

  const newGame = () => {
    game.io.newGame();
    setWaiting(false);
  };
  const joinGame = () => {
    game.io.joinGame(code);
    setWaiting(false);
  };

  return (
    <div className="container">
      <h1>Pong!</h1>
      {waiting ? (
        <>
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
