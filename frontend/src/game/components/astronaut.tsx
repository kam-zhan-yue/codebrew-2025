import { useRef, useState } from "react";
import { AstronautAnimation, AstronautModel } from "../models/astronaut-model";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { PlayerState } from "../types/player";

interface AstronautProps {
  player: PlayerState | null;
}

const MODEL_ROTATE_OFFSET = Math.PI;

const Astronaut = ({ player }: AstronautProps) => {
  const mesh = useRef<Mesh>(null!);
  const currentPos = useRef(new Vector3());
  const [animation, setAnimation] = useState<AstronautAnimation>("idle");

  useFrame(() => {
    if (!mesh.current) return;
    if (!player) return;
    const targetPosition = player.position;
    currentPos.current.lerp(targetPosition, 0.1);
    mesh.current.position.copy(currentPos.current);

    mesh.current.rotation.set(0, player.rotation.y + MODEL_ROTATE_OFFSET, 0);

    if (player.animationState == "idle") {
      setAnimation("idle");
    } else if (player.animationState == "walking") {
      setAnimation("walk");
    }
  });

  return (
    <>
      {player && (
        <mesh ref={mesh}>
          <AstronautModel scale={0.3} animation={animation} />
        </mesh>
      )}
    </>
  );
};

export default Astronaut;
