import { useRef } from "react";
import * as THREE from "three";
import { GameboyModel } from "../models/gameboy-model";
import { Interaction } from "../types/game-state";
import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";

interface GameboyProps {
  interaction: Interaction;
}

const Gameboy = ({ interaction }: GameboyProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );
  const enabled = activeSelection === interaction.type;

  return (
    <Select enabled={enabled}>
      <group
        ref={meshRef}
        name={interaction.type}
        position={[0, 3.3, 0]}
        rotation={[0, 200, 0]}
      >
        <GameboyModel />
      </group>
    </Select>
  );
};

export default Gameboy;
