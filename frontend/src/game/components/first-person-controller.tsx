import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Controls } from "../game";

const SPEED = 5;

export default function FirstPersonController() {
  const { camera, gl } = useThree();
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward],
  );

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

  return <PointerLockControls args={[camera, gl.domElement]} />;
}
