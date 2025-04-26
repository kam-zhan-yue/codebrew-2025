import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { TelevisionActiveModel } from "../models/television-active-model";
import { TelevisionInactiveModel } from "../models/television-inactive-model";

interface TelevisionProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const Television = ({ position, rotation, scale }: TelevisionProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const television = interactions?.find((interaction) => interaction.id === "television");
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  if (!television) {
    return <></>;
  }

  const isHovering = activeSelection === television.id;
  const data = Interactions[television.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = television.active ? data.deactivateMessage : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation} scale={scale}>
        <group name={television.id}>
          {television.active && <TelevisionActiveModel />}
          {!television.active && <TelevisionInactiveModel />}
        </group>
        {isHovering && <Tooltip position={[0, 0.8, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Television;