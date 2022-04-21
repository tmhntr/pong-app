import { useEffect, useState } from "react";
import "./App.css";
import Pong from "./Pong";
import { ClientGame } from "./utils/game";
import WaitingPage from "./WaitingPage";

let game: ClientGame;
const useGame = () => {
  if (!game) {
    game = new ClientGame();
  }
  return game;
};

function App() {
  const [page, setPage] = useState<"waiting" | "pong">("waiting");
  const game = useGame();
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
