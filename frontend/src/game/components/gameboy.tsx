import { Select } from "@react-three/postprocessing";
import { useGameStore } from "../../store";
import { Html } from "@react-three/drei";
import { Interactions } from "../types/interactions";
import { Vector3 } from "@react-three/fiber";
import { GameboyModel } from "../models/gameboy-model";

interface GameboyProps {
  position: Vector3;
  rotation: [number, number, number];
}

const Gameboy = ({ position, rotation }: GameboyProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const gameboy = interactions.find(
    (interaction) => interaction.id === "gameboy",
  )!;
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  if (!gameboy) {
    return <></>;
  }

  const enabled = activeSelection === gameboy.id;
  const data = Interactions[gameboy.id];
  const message = gameboy.active
    ? data.desactivateMessage
    : data.activateMessage;

  return (
    <Select enabled={enabled}>
      <group position={position} rotation={rotation}>
        <group name={gameboy.id}>
          <GameboyModel />
        </group>
        {enabled && (
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
