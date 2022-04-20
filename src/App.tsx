import "./App.css";
import { ClientGame } from "./utils/game";
import WaitingPage from "./WaitingPage";

function App() {
  const game = new ClientGame();
  return (
    <div className="App">
      <header className="App-header"></header>
      <WaitingPage game={game} />
    </div>
  );
}

export default App;
