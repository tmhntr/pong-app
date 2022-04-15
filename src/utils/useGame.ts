import { clientGame } from "./game";
let game: clientGame;

const useGame = () => {
  if (!game) game = new clientGame(800, 600);
  return game;
};

export default useGame;
