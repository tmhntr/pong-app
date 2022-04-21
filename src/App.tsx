import { useState } from "react";
import "./App.css";
import Pong from "./Pong";
import { ClientGame } from "./utils/game";
import WaitingPage from "./WaitingPage";

const game = new ClientGame();

function App() {
  const [page, setPage] = useState<"waiting" | "pong">("waiting");
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="container">
        <h1>Pong!</h1>
        {page === "waiting" ? (
          <WaitingPage game={game} onPlay={() => setPage("pong")} />
        ) : (
          <Pong game={game} />
        )}
      </div>
    </div>
  );
}

export default App;
