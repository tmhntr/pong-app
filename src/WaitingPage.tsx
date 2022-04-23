import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

const WaitingPage: React.FC = () => {
  const [code, setCode] = useState("");

  let navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/" + uuid().split("-")[0])}>
        Start new game
      </button>
      <p>OR</p>
      <input
        placeholder="game code"
        value={code}
        onChange={({ target }) => setCode(target.value)}
      ></input>
      <button onClick={() => navigate("/" + code)}>Join game</button>
    </>
  );
};

export default WaitingPage;
