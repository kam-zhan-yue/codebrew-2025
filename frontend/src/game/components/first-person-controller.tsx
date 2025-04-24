import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Controls } from "../game";

const SPEED = 5;

interface FirstPersonControllerProps {
  startPosition: THREE.Vector3;
}

export default function FirstPersonController({
  startPosition,
}: FirstPersonControllerProps) {
  const { camera } = useThree();
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward],
  );

  useEffect(() => {
    camera.position.copy(startPosition);
  }, [camera, startPosition]);

  useFrame((_, delta) => {
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
      move.applyQuaternion(camera.quaternion); // Move relative to camera orientation
      move.y = 0; // Prevent vertical movement
      move.normalize().multiplyScalar(SPEED * delta);
      camera.position.add(move);
    }
  });

  return <PointerLockControls />;
}
