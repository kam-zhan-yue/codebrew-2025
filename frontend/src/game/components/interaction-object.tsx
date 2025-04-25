import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";
import { Html } from "@react-three/drei";
import { Interaction, Interactions } from "../types/interactions";
import { ReactNode } from "react";
import { Vector3 } from "@react-three/fiber";

interface InteractionObjectProps {
  interaction: Interaction;
  textPosition: Vector3;
  children: ReactNode;
}

const InteractionObject = ({
  interaction,
  textPosition,
  children,
}: InteractionObjectProps) => {
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );
  const enabled = activeSelection === interaction.id;
  const data = Interactions[interaction.id];
  const message = interaction.active
    ? data.desactivateMessage
    : data.activateMessage;

  return (
    <Select enabled={enabled}>
      <group>
        {/* Wrap children in a group so we can place the Html relative to it */}
        <group name={interaction.id}>{children}</group>
        {enabled && (
          <Html
            position={textPosition} // Raise this value to move label higher
            center
            distanceFactor={10}
            style={{
              background: "white",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "6px",
              fontWeight: "bold",
              color: "black",
              whiteSpace: "nowrap",
            }}
          >
            {message}
          </Html>
        )}
      </group>
    </Select>
  );
};

export default InteractionObject;
