import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NamePage from "./NamePage";
import Pong from "./Pong";
import WaitingPage from "./WaitingPage";

function App() {
  const [name, setName] = useState<string | null>(null);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="container">
        <h1>Pong!</h1>
        {!name ? (
          <NamePage setName={setName} />
        ) : (
          <Routes>
            <Route path="/" element={<WaitingPage />}></Route>
            <Route path="/:gameId" element={<Pong name={name} />}></Route>
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
