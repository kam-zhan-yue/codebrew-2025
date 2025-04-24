import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Controls } from "../game";
import { PlayerState } from "../types/game-state";

const SPEED = 5;
const CAMERA_OFFSET = new THREE.Vector3(0, 3.3, 0);

interface FirstPersonControllerProps {
  player: PlayerState;
}

export default function FirstPersonController({
  player,
}: FirstPersonControllerProps) {
  const { camera } = useThree();
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward],
  );
  const currentPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!player) return;
    // Interpolate the camera's position to the player
    const targetPosition = player.position.clone().add(CAMERA_OFFSET);
    currentPos.current.lerp(targetPosition, 0.1);
    camera.position.copy(currentPos.current);

    // Send movement input
    direction.current.set(0, 0, 0);

    if (forwardPressed) direction.current.z -= 1;
    if (backPressed) direction.current.z += 1;
    if (leftPressed) direction.current.x -= 1;
    if (rightPressed) direction.current.x += 1;

    direction.current.normalize();

    if (direction.current.length() > 0) {
      const move = new THREE.Vector3(
        direction.current.x,
        0,
        direction.current.z,
      );
      move.applyQuaternion(camera.quaternion);
      move.y = 0;
      move.normalize().multiplyScalar(SPEED * delta);
      console.info("Moving to ", move);
    }
  });

  return <PointerLockControls />;
}
