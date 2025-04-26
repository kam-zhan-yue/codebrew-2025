import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store";
import { PlayerAnimation } from "../models/player-model";
import { RedPlayerModel } from "../models/red-player-model";

const MODEL_ROTATE_OFFSET = Math.PI;

const Player = () => {
  const mesh = useRef<Mesh>(null!);
  const currentPos = useRef(new Vector3());
  const [animation, setAnimation] = useState<PlayerAnimation>("idle");
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
      console.info("Setting animation to idle");
      setAnimation("idle");
    } else if (player.animationState == "walking") {
      console.info("Setting animation to walking");
      setAnimation("running");
    }
  });

  return (
    <>
      {player && (
        <mesh ref={mesh}>
          <RedPlayerModel
            position={[0, -1, 0]}
            scale={0.5}
            animation={animation}
          />
        </mesh>
      )}
    </>
  );
};

export default Player;
