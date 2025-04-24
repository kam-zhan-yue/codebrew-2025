import { useRef } from "react";
import { AstronautModel } from "../../components/astronaut-model";
import { PlayerState } from "../types/game-state";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface AstronautProps {
  player: PlayerState;
}

const Astronaut = ({ player }: AstronautProps) => {
  const mesh = useRef<Mesh>(null!);
  const currentPos = useRef(new Vector3());

  useFrame(() => {
    if (!mesh.current) return;
    if (!player) return;
    const targetPosition = player.position;
    currentPos.current.lerp(targetPosition, 0.1);
    mesh.current.position.copy(currentPos.current);
  });

  return (
    <mesh ref={mesh}>
      <AstronautModel />
    </mesh>
  );
};

export default Astronaut;
