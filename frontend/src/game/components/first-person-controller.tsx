import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PointerLockControls,
  useKeyboardControls,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Controls } from "../game";
import { useGameStore } from "../../store";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { findFirstInteractionHit, toThreeVector3 } from "../utils";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { AnimState, PlayerState } from "../types/player";
import {
  InteractionMessageSchema,
  MessageType,
  PlayerMessageSchema,
} from "../types/messages";

const INTERACT_THRESHOLD = 2;
const SPEED = 300;
const DISTANCE_THRESHOLD = 0.01;
const CAMERA_OFFSET = new THREE.Vector3(0, 0.5, 0);

interface FirstPersonControllerProps {
  player: PlayerState | null;
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
  const playerId = useGameStore((s) => s.playerId);
  const setActiveSelection = useGameStore((s) => s.setActiveSelection);
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  const lastValidPosition = useRef(new THREE.Vector3());
  const started = useGameStore((s) => s.started);
  const interactions = useGameStore((s) => s.gameState.interactions);

  /*
  NOTE(Alex): Every time we get a server update, we store data that is required
  for interpolation. Last Server Update will allow us to track how much time was
  spend between each update. Then, we lerp this using a constant value.
  The interpolation duration needs to be at the same tick as the server.
  Then, it is a matter of lerping between the previous position captured with the
  position of the current server call.
  */
  const lastServerUpdate = useRef<number>(performance.now());
  const interpolationStart = useRef<THREE.Vector3>(new THREE.Vector3());
  const interpolationEnd = useRef<THREE.Vector3>(new THREE.Vector3());
  const interpolationDuration = 1000 / 120;
  const getPlayer = useGameStore((s) => s.getPlayer);
  const playerState = getPlayer();

  useEffect(() => {
    if (!playerState) return;

    const newTarget = new THREE.Vector3(
      playerState.position.x + CAMERA_OFFSET.x,
      playerState.position.y + CAMERA_OFFSET.y,
      playerState.position.z + CAMERA_OFFSET.z,
    );

    interpolationStart.current.copy(currentPos.current);
    interpolationEnd.current.copy(newTarget);
    lastServerUpdate.current = performance.now();
  }, [playerState]);

  useFrame((_, delta) => {
    if (!started) return;
    if (!player) return;
    interpolate();
    raycast();
    handleInputs(delta);
  });

  const interpolate = () => {
    const now = performance.now();
    const elapsed = now - lastServerUpdate.current;
    const t = Math.min(elapsed / interpolationDuration, 1);

    currentPos.current.lerpVectors(
      interpolationStart.current,
      interpolationEnd.current,
      t,
    );

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
      rigidbodyRef.current.setLinvel(move, true);
    } else {
      rigidbodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    validate();
  };

  const validate = () => {
    if (!rigidbodyRef.current) return;

    const currentRaw = rigidbodyRef.current.translation();
    const current = new THREE.Vector3(currentRaw.x, currentRaw.y, currentRaw.z);

    if (lastValidPosition.current) {
      const distance = lastValidPosition.current.distanceTo(current);

      if (distance > DISTANCE_THRESHOLD) {
        send(current, "walking");
      } else {
        send(current, "idle");
      }
    } else {
      send(current, "idle");
    }

    lastValidPosition.current.copy(current);
  };

  const send = (position: THREE.Vector3, animation: AnimState) => {
    // Always send the rotation. Need to do some weird world rotation here.
    camera.rotation.order = "YXZ";
    const rotation = camera.rotation;

    const data = {
      message_id: MessageType.player,
      player_id: playerId,
      position: {
        x: position.x,
        y: position.y,
        z: position.z,
      },
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
      },
      animation_state: animation,
    };
    try {
      PlayerMessageSchema.parse(data);
      sendJsonMessage(data);
    } catch (error) {
      console.error("Validation failed for player message: ", error);
    }
  };

  const select = () => {
    if (!interactPressed) return;
    if (activeSelection === "none") return;

    const interaction = interactions.find((i) => i.id === activeSelection);
    if (!interaction) return;

    const data = {
      message_id: MessageType.interaction,
      player_id: playerId,
      interaction_id: interaction.id,
      // NOTE(Alex): This is where we try to toggle off the interaction
      active: !interaction.active,
    };

    try {
      InteractionMessageSchema.parse(data);
      sendJsonMessage(data);
    } catch (error) {
      console.error("Validation failed for interaction message:", error);
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
    setDebug({ raycastData: result });
    if (result) {
      const currentPosition = toThreeVector3(
        rigidbodyRef.current.translation(),
      );
      const distance = currentPosition.distanceTo(result.object.position);
      if (distance <= INTERACT_THRESHOLD) {
        setActiveSelection(result.interaction);
        hasSelection = true;
      }
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
      {player && (
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
          <PointerLockControls enabled={started} />
        </>
      )}
      {!player && <OrbitControls />}
    </>
  );
}
