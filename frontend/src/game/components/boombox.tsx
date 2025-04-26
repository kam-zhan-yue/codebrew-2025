import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { BoomboxModel } from "../models/boombox-model";

interface BoomboxProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const Boombox = ({ position, rotation, scale }: BoomboxProps) => {
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
      <group position={position} rotation={rotation} scale={scale}>
        <group name={boombox.id}>
          <BoomboxModel />
        </group>
        {isHovering && <Tooltip position={[0, 1.8, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Boombox;
