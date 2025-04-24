import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Controls } from "../game";
import { PlayerState } from "../types/game-state";
import { useGameStore } from "../../store";

const SPEED = 5;
const CAMERA_OFFSET = new THREE.Vector3(0, 3.3, 0);

interface FirstPersonControllerProps {
  player: PlayerState;
}

export default function FirstPersonController({
  player,
}: FirstPersonControllerProps) {
  const { camera, scene } = useThree();
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward],
  );
  const currentPos = useRef(new THREE.Vector3());

  const setDebug = useGameStore((s) => s.setDebug);

  useFrame((_, delta) => {
    interpolate();
    move(delta);
    raycast();
  });

  const interpolate = () => {
    if (!player) return;
    // Interpolate the camera's position to the player
    const targetPosition = player.position.clone().add(CAMERA_OFFSET);
    currentPos.current.lerp(targetPosition, 0.1);
    camera.position.copy(currentPos.current);
  };

  const move = (delta: number) => {
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
  };

  const raycast = () => {
    const coords = new THREE.Vector2(0, 0); // center of the screen
    raycaster.current.setFromCamera(coords, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      setDebug({ raycastData: intersects[0] });
    }
  };

  return <PointerLockControls />;
}
