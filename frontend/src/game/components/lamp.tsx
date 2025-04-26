import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { LampModel } from "../models/lamp-model";

interface LampProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const Lamp = ({ position, rotation, scale }: LampProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const interaction = interactions?.find(
    (interaction) => interaction.id === "lamp",
  );
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  if (!interaction) {
    return <></>;
  }

  const isHovering = activeSelection === interaction.id;
  const data = Interactions[interaction.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = interaction.active
      ? data.deactivateMessage
      : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation} scale={scale}>
        <group name={interaction.id}>
          <LampModel />
          {interaction.active && (
            <spotLight position={position} intensity={1} />
          )}
        </group>
        {isHovering && <Tooltip position={[0, 2, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Lamp;
