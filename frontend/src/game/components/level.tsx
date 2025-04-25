import Astronaut from "../components/astronaut";
import { useGameStore } from "../../store";
import { EnvironmentModel } from "../models/environment-model";

const Level = () => {
  const playerTwo = useGameStore((s) => s.gameState.playerTwo);
  return (
    <>
      <EnvironmentModel />
      <Astronaut player={playerTwo} />
    </>
  );
};

export default Level;
