import { useRef } from "react";
import * as THREE from "three";
import { GameboyModel } from "../models/gameboy-model";
import { Interaction } from "../types/game-state";
import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";
import { Html } from "@react-three/drei";

interface GameboyProps {
  interaction: Interaction;
}

const Gameboy = ({ interaction }: GameboyProps) => {
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );
  const enabled = activeSelection === interaction.type;

  return (
    <Select enabled={enabled}>
      <group
        name={interaction.type}
        position={[0, 1, 0]}
        rotation={[0, 200, 0]}
      >
        <GameboyModel />

        {/* Only show this if selected */}
        {enabled && (
          <Html
            position={[0, 0.5, 0]} // Adjust position above the Gameboy
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
            Press E to interact
          </Html>
        )}
      </group>
    </Select>
  );
};

export default Gameboy;
