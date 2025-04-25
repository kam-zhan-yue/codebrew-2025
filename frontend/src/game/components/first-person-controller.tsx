import { useFrame, useThree, Vector3 } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Controls } from "../game";
import { PlayerState } from "../types/game-state";
import { useGameStore } from "../../store";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { InteractionType } from "../types/interactions";
import { findFirstInteractionHit } from "../utils";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../../api/constants";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

const SPEED = 150;
const DISTANCE_THRESHOLD = 0.01;
const CAMERA_OFFSET = new THREE.Vector3(0, 1.5, 0);

interface FirstPersonControllerProps {
  player: PlayerState;
  sendJsonMessage: SendJsonMessage;
}

export default function FirstPersonController({
  player,
  sendJsonMessage,
}: FirstPersonControllerProps) {
  const { camera, scene } = useThree();
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);
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
  };

  const move = (delta: number) => {
    if (!rigidbodyRef.current) return;
    direction.current.set(0, 0, 0);

    if (forwardPressed) direction.current.z -= 1;
    if (backPressed) direction.current.z += 1;
    if (leftPressed) direction.current.x -= 1;
    if (rightPressed) direction.current.x += 1;

    direction.current.normalize();

    const move = new THREE.Vector3(direction.current.x, 0, direction.current.z);

    if (direction.current.length() > 0) {
      move.applyQuaternion(camera.quaternion);
      move.y = 0;
      move.normalize().multiplyScalar(SPEED * delta);
      // console.info("Moving to ", move);
      rigidbodyRef.current.setLinvel(move, true);
    } else {
      rigidbodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    validate(move);
  };

  const validate = (velocity: THREE.Vector3) => {
    if (!rigidbodyRef.current) return;

    const currentRaw = rigidbodyRef.current.translation();
    const current = new THREE.Vector3(currentRaw.x, currentRaw.y, currentRaw.z);

    if (lastValidPosition.current) {
      const distance = lastValidPosition.current.distanceTo(current);

      if (distance > DISTANCE_THRESHOLD) {
        send(velocity);
      } else {
        send(new THREE.Vector3(0, 0, 0));
      }
    } else {
      send(new THREE.Vector3(0, 0, 0));
    }

    lastValidPosition.current.copy(current);
  };

  const send = (velocity: THREE.Vector3) => {
    console.info("Moving with ", velocity);
    sendJsonMessage({
      player_id: "1",
      velocity: {
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
      },
    });
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
    const coords = new THREE.Vector2(0, 0); // center of screen
    raycaster.current.setFromCamera(coords, camera);

    // Only create the arrow once
    if (!arrowRef.current) {
      const origin = raycaster.current.ray.origin;
      const direction = raycaster.current.ray.direction.clone().normalize();
      const arrow = new THREE.ArrowHelper(direction, origin, 3, 0xff0000);
      arrowRef.current = arrow;
      scene.add(arrow);
    }

    const intersects = raycaster.current.intersectObjects(scene.children, true);
    let hasSelection = false;

    const result = findFirstInteractionHit(intersects);
    if (result) {
      setActiveSelection(result.interaction);
      hasSelection = true;
    }
    if (!hasSelection) {
      setActiveSelection("none");
    }
    visualiseRay();
  };

  const visualiseRay = () => {
    if (!arrowRef.current || !raycaster.current) return;

    const origin = raycaster.current.ray.origin;
    const direction = raycaster.current.ray.direction.clone().normalize();
    arrowRef.current.position.copy(origin);
    arrowRef.current.setDirection(direction);
  };

  return (
    <>
      <RigidBody
        ref={rigidbodyRef}
        colliders={false}
        type="dynamic"
        position={[0, 1, 0]}
        gravityScale={0}
        enabledRotations={[false, false, false]}
        friction={2}
      >
        <CylinderCollider args={[0.9, 0.5]}>
          <meshStandardMaterial color="white" />
        </CylinderCollider>
      </RigidBody>
      <PointerLockControls />
    </>
  );
}
