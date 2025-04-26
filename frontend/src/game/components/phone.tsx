import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { PhoneInactiveModel } from "../models/phone-inactive-model";
import { PhoneActiveModel } from "../models/phone-active-model";

interface PhoneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const Phone = ({ position, rotation, scale }: PhoneProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const interaction = interactions?.find(
    (interaction) => interaction.id === "phone",
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
          {interaction.active && <PhoneActiveModel />}
          {!interaction.active && <PhoneInactiveModel />}
        </group>
        {isHovering && <Tooltip position={[0, 0.6, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Phone;
