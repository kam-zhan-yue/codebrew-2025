import { Canvas } from "@react-three/fiber";
import "./game.css";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { KeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../api/constants";
import { useGameStore } from "../store";
import { GameState } from "./types/game-state";
import Gameboy from "./components/gameboy";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import FirstPersonController from "./components/first-person-controller";
import Level from "./components/level";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
  interact: "interact",
} as const;

const Game = () => {
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
          animationState: "idle",
        },
        playerTwo: {
          id: "player2",
          position: [0, 0, playerTwoZ.current],
          animationState: "walking",
        },
        interactions: {
          gameboy: { type: "gameboy", active: false },
        },
        time: Date.now(),
      });

      const parsed = JSON.parse(rawJson);

      const rawState = {
        playerOne: {
          id: parsed.playerOne.id,
          position: new THREE.Vector3(...parsed.playerOne.position),
          animationState: parsed.playerOne.animationState,
        },
        playerTwo: {
          id: parsed.playerTwo.id,
          position: new THREE.Vector3(...parsed.playerTwo.position),
          animationState: parsed.playerTwo.animationState,
        },
        interactions: {
          gameboy: {
            type: parsed.interactions.gameboy.type,
            active: parsed.interactions.gameboy.active,
          },
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
      { name: Controls.interact, keys: ["KeyE"] },
    ],
    [],
  );

  const playerOne = useGameStore((s) => s.gameState.playerOne);
  const gameboy = useGameStore((s) => s.gameState.interactions.gameboy);

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <color attach="background" args={["#ececec"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <Suspense>
            <Level />
            <FirstPersonController player={playerOne} />
            <Selection>
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                  blur
                  visibleEdgeColor={0xffffff}
                  edgeStrength={100}
                  width={500}
                />
              </EffectComposer>
              <Gameboy interaction={gameboy} />
            </Selection>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Game;
