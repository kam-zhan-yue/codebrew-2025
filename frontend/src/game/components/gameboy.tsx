import { GameboyModel } from "../models/gameboy-model";
import { Interaction } from "../types/game-state";

interface GameboyProps {
  interaction: Interaction;
}

const Gameboy = ({ interaction }: GameboyProps) => {
  // console.info("Gameboy is: " + interaction.active);
  return (
    <mesh name="gameboy" position={[0, 3.3, 0]} rotation={[0, 200, 0]}>
      <GameboyModel />
    </mesh>
  );
};

export default Gameboy;
