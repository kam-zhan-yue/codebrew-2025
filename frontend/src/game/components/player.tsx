import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../store";
import { RedPlayerModel } from "../models/red-player-model";
import { PLAYER_ONE, PlayerAnimation } from "../constants";
import { BluePlayerModel } from "../models/blue-player-model";

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
      setAnimation("idle");
    } else if (player.animationState == "walking") {
      setAnimation("running");
    }
  });

  const isRed = player?.id === PLAYER_ONE;

  return (
    <>
      {player && (
        <mesh ref={mesh}>
          {isRed && (
            <RedPlayerModel
              position={[0, -0.6, 0]}
              scale={0.3}
              animation={animation}
            />
          )}
          {!isRed && (
            <BluePlayerModel
              position={[0, -0.6, 0]}
              scale={0.3}
              animation={animation}
            />
          )}
        </mesh>
      )}
    </>
  );
};

export default Player;
