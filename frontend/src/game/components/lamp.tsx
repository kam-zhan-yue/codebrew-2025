import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { Vector3 } from "three";

interface LampProps {
  position: Vector3;
  rotation: [number, number, number];
}

const Lamp = ({ position, rotation }: LampProps) => {
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

  // console.info("Active Selection ", activeSelection, " ID ", phone.id);

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation}>
        <group name={interaction.id}>
          {interaction.active && <LampActiveModel />}
          {!interaction.active && <LampInactiveModel />}
        </group>
        {isHovering && <Tooltip position={[0, 5, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Lamp;
