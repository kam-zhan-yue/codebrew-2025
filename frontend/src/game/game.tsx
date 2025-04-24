import { Canvas } from "@react-three/fiber";
import "./game.css";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Cylinder, KeyboardControls } from "@react-three/drei";
import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import FirstPersonController from "./components/first-person-controller";
import Astronaut from "./components/astronaut";
import * as THREE from "three";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../api/constants";
import { useGameStore } from "../store";
import { GameState } from "./types/game-state";
import Gameboy from "./components/gameboy";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
} as const;

function Game() {
  const setGameState = useGameStore((state) => state.setGameState);
  const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  const wsUrl = `${wsProtocol}${WS_URL}`;
  const { lastJsonMessage } = useWebSocket(wsUrl, {
    share: true,
  });

  // Proxy websocket before the backend is setup
  const playerTwoZ = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      playerTwoZ.current += 0.01;
      const rawJson = JSON.stringify({
        playerOne: {
          id: "player1",
          position: [2, 0, 0],
        },
        playerTwo: {
          id: "player2",
          position: [0, 0, playerTwoZ.current],
        },
        interactions: {
          gameboy: { active: false },
        },
        time: Date.now(),
      });

      const parsed = JSON.parse(rawJson);

      const rawState = {
        playerOne: {
          id: parsed.playerOne.id,
          position: new THREE.Vector3(...parsed.playerOne.position),
        },
        playerTwo: {
          id: parsed.playerTwo.id,
          position: new THREE.Vector3(...parsed.playerTwo.position),
        },
        interactions: {
          gameboy: { active: parsed.interactions.gameboy.active },
        },
        time: parsed.time,
      } as GameState;

      setGameState(rawState);
    }, 100);

    return () => clearInterval(interval);
  }, [setGameState]);

  useEffect(() => {
    if (lastJsonMessage) {
      const rawState = lastJsonMessage as unknown as GameState;
      setGameState(rawState);
    }
  }, [setGameState, lastJsonMessage]);

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    [],
  );

  const playerOne = useGameStore((s) => s.gameState.playerOne);
  const playerTwo = useGameStore((s) => s.gameState.playerTwo);
  const gameboy = useGameStore((s) => s.gameState.interactions.gameboy);

  // console.info("Player One is ", playerOne.position);
  // console.info("Player Two is ", playerTwo.position);

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <color attach="background" args={["#ececec"]} />
          <ambientLight intensity={1} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            color={"#9e69da"}
          />
          <Suspense>
            <Physics debug>
              <FirstPersonController player={playerOne} />
              <Gameboy interaction={gameboy} />
              <Astronaut player={playerTwo} />
              <RigidBody colliders={false} type="fixed" position-y={-0.5}>
                <CylinderCollider args={[0.5, 5]} />
                <Cylinder scale={[5, 1, 5]} receiveShadow>
                  <meshStandardMaterial color="white" />
                </Cylinder>
              </RigidBody>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default Game;
