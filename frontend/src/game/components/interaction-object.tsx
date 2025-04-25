import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";
import { Interaction } from "../types/game-state";
import { Html } from "@react-three/drei";
import { Interactions } from "../types/interactions";
import { ReactNode } from "react";

interface InteractionObjectProps {
  interaction: Interaction;
  children: ReactNode;
}

const InteractionObject = ({
  interaction,
  children,
}: InteractionObjectProps) => {
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );
  const enabled = activeSelection === interaction.type;
  const data = Interactions[interaction.type];
  const message = interaction.active
    ? data.desactivateMessage
    : data.activateMessage;

  return (
    <Select enabled={enabled}>
      {children}
      {enabled && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={10}
          style={{
            background: "white",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "6px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {message}
        </Html>
      )}
    </Select>
  );
};

export default InteractionObject;
