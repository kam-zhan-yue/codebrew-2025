import { GameboyModel } from "../../components/gameboy-model";
import { Interaction } from "../types/game-state";

interface GameboyProps {
  interaction: Interaction;
}

const Gameboy = ({ interaction }: GameboyProps) => {
  console.info("Gameboy is: " + interaction.active);
  return (
    <mesh>
      <GameboyModel />
    </mesh>
  );
};

export default Gameboy;
