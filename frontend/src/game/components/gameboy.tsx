import { useRef } from "react";
import * as THREE from "three";
import { GameboyModel } from "../models/gameboy-model";
import { Interaction } from "../types/game-state";

interface GameboyProps {
  interaction: Interaction;
}

const Gameboy = ({ interaction }: GameboyProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <group
      ref={meshRef}
      name="gameboy"
      position={[0, 3.3, 0]}
      rotation={[0, 200, 0]}
    >
      <GameboyModel />
    </group>
  );
};

export default Gameboy;
