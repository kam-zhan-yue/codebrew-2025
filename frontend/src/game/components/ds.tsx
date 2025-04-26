import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { DSInactiveModel } from "../models/ds-inactive-model";
import { DSActiveModel } from "../models/ds-active-model";

interface DSProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const Ds = ({ position, rotation, scale }: DSProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const interaction = interactions?.find(
    (interaction) => interaction.id === "ds",
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
          {interaction.active && <DSActiveModel />}
          {!interaction.active && <DSInactiveModel position={[0, -0.12, 0]} />}
        </group>
        {isHovering && <Tooltip position={[0, 0.8, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Ds;
