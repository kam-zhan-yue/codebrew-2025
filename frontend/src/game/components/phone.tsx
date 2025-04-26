import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import { Vector3 } from "@react-three/fiber";
import { GameboyModel } from "../models/gameboy-model";
import Tooltip from "./tooltip";
import { ReactNode } from "@tanstack/react-router";

interface PhoneProps {
  active: ReactNode;
  inactive: ReactNode;
}

const Phone = ({ active, inactive }: PhoneProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const phone = interactions?.find((interaction) => interaction.id === "phone");
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  if (!phone) {
    return <></>;
  }

  const isHovering = activeSelection === phone.id;
  const data = Interactions[phone.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = phone.active ? data.deactivateMessage : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group name={phone.id}>
        {phone.active && active}
        {!phone.active && inactive}
        <GameboyModel />
      </group>
      {isHovering && <Tooltip position={[0, 0.5, 0]}>{message}</Tooltip>}
    </Select>
  );
};

export default Phone;
