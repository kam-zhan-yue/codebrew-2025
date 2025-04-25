import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";
import { Box, Html } from "@react-three/drei";
import { Interactions } from "../types/interactions";
import { useFrame, Vector3 } from "@react-three/fiber";
import { GameboyModel } from "../models/gameboy-model";
import * as THREE from "three";
import { useRef } from "react";

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

  useFrame((_, delta) => {
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
          <Box ref={mesh} />
          <GameboyModel />
        </group>
        {isHovering && (
          <Html
            position={[0, 1, 0]}
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

export default Gameboy;
