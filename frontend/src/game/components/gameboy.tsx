import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";
import { Box } from "@react-three/drei";
import { Interactions } from "../types/interactions";
import { useFrame, Vector3 } from "@react-three/fiber";
import { GameboyModel } from "../models/gameboy-model";
import * as THREE from "three";
import { useRef } from "react";
import Tooltip from "./tooltip";

interface GameboyProps {
  position: Vector3;
  rotation: [number, number, number];
}

const Gameboy = ({ position, rotation }: GameboyProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const interactions = useGameStore((s) => s.gameState.interactions);
  const gameboy = interactions.find(
    (interaction) => interaction.id === "gameboy",
  );
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  useFrame((_, delta) => {    // example of box moving up
    if (mesh.current) {
      mesh.current.position.y += 0.05 * delta;
    }
  });

  if (!gameboy) {
    return <></>;
  }

  const isHovering = activeSelection === gameboy.id;
  const data = Interactions[gameboy.id];
  const message = gameboy.active
    ? data.deactivateMessage
    : data.activateMessage;

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation}>
        <group name={gameboy.id}>
          {/* <Box ref={mesh} /> */}
          <GameboyModel />
        </group>
        {isHovering && <Tooltip position={[0, 0.5, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Gameboy;
