import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import { Vector3 } from "@react-three/fiber";
import { GameboyModel } from "../models/gameboy-model";
import Tooltip from "./tooltip";

interface GameboyProps {
  position: Vector3;
  rotation: [number, number, number];
}

const Gameboy = ({ position, rotation }: GameboyProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const gameboy = interactions?.find(
    (interaction) => interaction.id === "gameboy",
  );
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  if (!gameboy) {
    return <></>;
  }

  const isHovering = activeSelection === gameboy.id;
  const data = Interactions[gameboy.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = gameboy.active ? data.deactivateMessage : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation}>
        <group name={gameboy.id}>
          <GameboyModel />
        </group>
        {isHovering && <Tooltip position={[0, 0.5, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Gameboy;
