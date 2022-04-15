import "./App.css";
import { clientGame } from "./utils/game";
import WaitingPage from "./WaitingPage";

function App() {
  const game = new clientGame(800, 600);
  return (
    <div className="App">
      <header className="App-header"></header>
      <WaitingPage game={game} />
    </div>
  );
}

export default App;
