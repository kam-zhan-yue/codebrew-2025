import Astronaut from "../components/astronaut";
import { useGameStore } from "../../store";
import { EnvironmentModel } from "../models/environment-model";
import Gameboy from "./gameboy";

const Level = () => {
  const playerOne = useGameStore((s) => s.gameState.playerOne);
  const playerTwo = useGameStore((s) => s.gameState.playerTwo);
  const playerId = useGameStore((s) => s.playerId);
  const otherPlayer = playerId === playerOne?.id ? playerTwo : playerOne;

  return (
    <>
      <EnvironmentModel />
      <Gameboy position={[0, 1, 0]} rotation={[0, 0, 0]} />
      <Astronaut player={otherPlayer} />
    </>
  );
};

export default Level;
