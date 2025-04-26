import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PointerLockControls,
  useKeyboardControls,
} from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GameFlow, useGameStore } from "../../store";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { findFirstInteractionHit, toThreeVector3 } from "../utils";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { AnimState } from "../types/player";
import {
  InteractionMessageSchema,
  MessageType,
  PlayerMessageSchema,
  RestartMessageSchema,
} from "../types/messages";
import { Controls } from "../types/controls";
import { Interactions } from "../types/interactions";

const ORBIT_ORIGIN = new THREE.Vector3(1.5, 2, 2);
const ORBIT_MAX_DISTANCE = 20;
const INTERACT_THRESHOLD = 3;
const SPEED = 3;
const INTERPOLATION_SPEED = 10;
const DISTANCE_THRESHOLD = 0.01;
const CAMERA_OFFSET = new THREE.Vector3(0, 1, 0);

interface FirstPersonControllerProps {
  sendJsonMessage: SendJsonMessage;
}

export default function FirstPersonController({
  sendJsonMessage,
}: FirstPersonControllerProps) {
  const { camera, scene } = useThree();
  const [inited, setInited] = useState(false);
  const rigidbodyRef = useRef<RapierRigidBody>(null!);
  const prevFlow = useRef<GameFlow>(GameFlow.Selection);
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
  const playerId = useGameStore((s) => s.playerId);
  const setActiveSelection = useGameStore((s) => s.setActiveSelection);
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  const lastValidPosition = useRef(new THREE.Vector3());
  const flow = useGameStore((s) => s.flow);
  const started = flow !== GameFlow.Selection;
  const interactions = useGameStore((s) => s.gameState.interactions);
  const restart = useGameStore((s) => s.uiState.restart);
  const setRestart = useGameStore((s) => s.setRestart);

  const getPlayer = useGameStore((s) => s.getPlayer);
  const player = getPlayer();
  const interactionSoundRef = useRef<THREE.Audio | null>(null);

  // SFX STUFF
  const playSFX = useCallback(() => {
    if (interactionSoundRef.current) {
      interactionSoundRef.current.play();
    }
  }, []);

  useEffect(() => {
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    audioLoader.load("/sounds/interaction.mp3", (buffer) => {
      interactionSound.setBuffer(buffer);
      interactionSound.setVolume(0.5);
      interactionSound.setLoop(false);
      interactionSoundRef.current = interactionSound;
    });
    const interactionSound = new THREE.Audio(listener);
    camera.add(listener);
  }, [camera]);

  const [sub] = useKeyboardControls<Controls>();

  const select = useCallback(() => {
    if (activeSelection === "none") return;

    const interaction = interactions?.find((i) => i.id === activeSelection);
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
  }, [activeSelection, interactions, playerId, sendJsonMessage]);

  const sendRestart = useCallback(() => {
    const shouldRestart = restart;
    const data = {
      message_id: MessageType.restart,
      player_id: playerId,
      restart: shouldRestart,
    };
    setRestart(!shouldRestart);
    try {
      RestartMessageSchema.parse(data);
      sendJsonMessage(data);
    } catch (error) {
      console.error("Validation failed for restart message:", error);
    }
  }, [restart, sendJsonMessage, setRestart, playerId]);

  // Selection Code
  useEffect(() => {
    return sub(
      (state) => state[Controls.interact],
      (pressed) => {
        if (pressed) {
          if (flow === GameFlow.Game) {
            select();
            playSFX();
          } else if (flow === GameFlow.GameOver) {
            sendRestart();
          }
        }
      },
    );
  }, [select, sub, playSFX, flow, sendRestart]);

  useEffect(() => {
    camera.position.copy(new THREE.Vector3(5, 10, 10));
    camera.lookAt(ORBIT_ORIGIN);
  }, [camera]);

  useEffect(() => {
    if (flow === GameFlow.Lobby && prevFlow.current === GameFlow.Selection) {
      camera.position.copy(new THREE.Vector3(0, 0, 0));
      setInited(true);
    }
    prevFlow.current = flow;
  }, [camera.position, flow]);

  useFrame((_, delta) => {
    if (!inited) return;
    if (!started) return;
    if (!player) return;
    interpolate(delta);
    raycast();
    handleInputs();
  });

  const interpolate = (delta: number) => {
    if (!player) return;
    const targetPosition = player.position.clone().add(CAMERA_OFFSET);
    currentPos.current.lerp(targetPosition, INTERPOLATION_SPEED * delta);
    camera.position.copy(currentPos.current);
  };

  const handleInputs = () => {
    move();
  };

  const move = () => {
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
      move.normalize().multiplyScalar(SPEED);
      rigidbodyRef.current.setLinvel(move, true);
    } else {
      rigidbodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    validate();
  };

  const validate = () => {
    if (!rigidbodyRef.current) return;

    if (forwardPressed) direction.current.z -= 1;
    if (backPressed) direction.current.z += 1;
    if (leftPressed) direction.current.x -= 1;
    if (rightPressed) direction.current.x += 1;

    direction.current.normalize();
    const animation: AnimState =
      direction.current.length() > 0 ? "walking" : "idle";

    const currentRaw = rigidbodyRef.current.translation();
    const current = new THREE.Vector3(currentRaw.x, currentRaw.y, currentRaw.z);

    send(current, animation);

    lastValidPosition.current.copy(current);
  };

  const send = (position: THREE.Vector3, animation: AnimState) => {
    // Always send the rotation. Need to do some weird world rotation here.
    camera.rotation.order = "YXZ";
    const rotation = camera.rotation;
    console.log(position);

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

  const raycast = () => {
    const coords = new THREE.Vector2(0, 0); // center of screen
    raycaster.current.setFromCamera(coords, camera);

    const intersects = raycaster.current.intersectObjects(scene.children, true);
    let hasSelection = false;

    const result = findFirstInteractionHit(intersects);
    setDebug({ raycastData: result });
    if (result) {
      const currentPosition = toThreeVector3(
        rigidbodyRef.current.translation(),
      );

      // Hard code interaction position because I'm dumb
      const interaction = Interactions[result.interaction];
      const targetPosition = new THREE.Vector3(...interaction.position);
      const distance = currentPosition.distanceTo(targetPosition);
      if (distance <= INTERACT_THRESHOLD) {
        // console.info("Active interaction is ", result.interaction);
        setActiveSelection(result.interaction);
        hasSelection = true;
      }
    }
    if (!hasSelection) {
      setActiveSelection("none");
    }
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
      {!player && (
        <OrbitControls
          target={ORBIT_ORIGIN}
          maxDistance={ORBIT_MAX_DISTANCE}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      )}
    </>
  );
}
