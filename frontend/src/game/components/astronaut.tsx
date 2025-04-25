import { useRef, useState } from "react";
import { AstronautAnimation, AstronautModel } from "../models/astronaut-model";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store";

const MODEL_ROTATE_OFFSET = Math.PI;

const Astronaut = () => {
  const mesh = useRef<Mesh>(null!);
  const currentPos = useRef(new Vector3());
  const [animation, setAnimation] = useState<AstronautAnimation>("idle");
  const getOtherPlayer = useGameStore((s) => s.getOtherPlayer);
  const player = getOtherPlayer();

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
