import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import { Vector3 } from "@react-three/fiber";
import { GameboyModel } from "../models/gameboy-model";
import { BoomboxMoe}
import Tooltip from "./tooltip";

interface BoomboxProps {
  position: Vector3;
  rotation: [number, number, number];
}

const Boombox = ({ position, rotation }: BoomboxProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const boombox = interactions?.find(
    (interaction) => interaction.id === "boombox",
  );
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  if (!boombox) {
    return <></>;
  }

  const isHovering = activeSelection === boombox.id;
  const data = Interactions[boombox.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = boombox.active ? data.deactivateMessage : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation}>
        <group name={boombox.id}>
          <GameboyModel />
        </group>
        {isHovering && <Tooltip position={[0, 1, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Boombox;
