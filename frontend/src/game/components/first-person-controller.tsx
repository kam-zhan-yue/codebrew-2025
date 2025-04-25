import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Controls } from "../game";
import { InteractionType, PlayerState } from "../types/game-state";
import { useGameStore } from "../../store";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

const SPEED = 5;
const CAMERA_OFFSET = new THREE.Vector3(0, 1.5, 0);

interface FirstPersonControllerProps {
  player: PlayerState;
}

export default function FirstPersonController({
  player,
}: FirstPersonControllerProps) {
  const { camera, scene } = useThree();
  const rigidbodyRef = useRef<RapierRigidBody>(null!);
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const interactPressed = useKeyboardControls(
    (state) => state[Controls.interact],
  );
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward],
  );
  const currentPos = useRef(new THREE.Vector3());

  const setDebug = useGameStore((s) => s.setDebug);
  const setActiveSelection = useGameStore((s) => s.setActiveSelection);
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  const lastValidPosition = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    interpolate();
    raycast();
    handleInputs(delta);
  });

  const interpolate = () => {
    if (!player) return;
    // Interpolate the camera's position to the player
    const targetPosition = player.position.clone().add(CAMERA_OFFSET);
    currentPos.current.lerp(targetPosition, 0.1);
    camera.position.copy(currentPos.current);
  };

  const handleInputs = (delta: number) => {
    move(delta);
    select();
    // validate();
  };

  const move = (delta: number) => {
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

      const current = rigidbodyRef.current.translation();

      lastValidPosition.current.copy(current);
      const newPos = new THREE.Vector3(current.x, current.y, current.z).add(
        move,
      );

      rigidbodyRef.current.setTranslation(
        {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
        },
        true,
      );
    }
  };

  const validate = () => {
    if (!rigidbodyRef.current) return;

    const actual = rigidbodyRef.current.translation();
    const expected = lastValidPosition.current;
    const distance = expected.distanceTo(
      new THREE.Vector3(actual.x, actual.y, actual.z),
    );

    if (distance < 0.01) {
      console.info("Move Successful");
    } else {
      console.warn("Move blocked");
    }
  };

  const select = () => {
    if (!interactPressed) return;
    switch (activeSelection) {
      case "gameboy":
        console.info("Send Interact Information");
        break;
    }
  };

  const raycast = () => {
    const coords = new THREE.Vector2(0, 0); // center of the screen
    raycaster.current.setFromCamera(coords, camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    let hasSelection = false;
    if (intersects.length > 0) {
      setDebug({ raycastData: intersects[0] });
      const firstHit = intersects[0]?.object;
      if (firstHit && firstHit.parent && firstHit.parent.parent) {
        const interaction = firstHit.parent.parent.name;
        hasSelection = true;
        setActiveSelection(interaction as InteractionType);
      }
    }

    if (!hasSelection) {
      setActiveSelection("none");
    }
  };

  return (
    <>
      <RigidBody
        ref={rigidbodyRef}
        colliders={false}
        type="dynamic" // important
        position={[0, 1, 0]}
      >
        <CylinderCollider args={[1, 0.5]}>
          <meshStandardMaterial color="white" />
        </CylinderCollider>
      </RigidBody>
      <PointerLockControls />
    </>
  );
}
