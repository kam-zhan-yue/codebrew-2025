import { Canvas } from "@react-three/fiber";
import "./game.css";
import { Suspense, useEffect, useMemo } from "react";
import { KeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../api/constants";
import { useGameStore } from "../store";
import { GameState } from "./types/game-state";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import FirstPersonController from "./components/first-person-controller";
import Level from "./components/level";
import { Physics } from "@react-three/rapier";
import InteractionObject from "./components/interaction-object";
import { GameboyModel } from "./models/gameboy-model";

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
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    share: true,
  });
  console.log("socket url:", WS_URL);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = lastJsonMessage as any;
    if (json) {
      const rawState = {
        playerOne: {
          id: json.player_one.id,
          position: new THREE.Vector3(
            json.player_one.position.x,
            json.player_one.position.y,
            json.player_one.position.z,
          ),
          rotation: new THREE.Euler(
            json.player_one.rotation.y,
            json.player_one.rotation.y,
            json.player_one.rotation.z,
          ),
          animationState: json.player_one.animationState,
        },
        playerTwo: {
          id: json.player_two.id,
          position: new THREE.Vector3(
            json.player_two.position.x,
            json.player_two.position.y,
            json.player_two.position.z,
          ),
          rotation: new THREE.Euler(
            json.player_two.rotation.y,
            json.player_two.rotation.y,
            json.player_two.rotation.z,
          ),
          animationState: json.player_two.animationState,
        },
        interactions: {
          gameboy: {
            type: "gameboy",
            active: true,
          },
        },
      } as GameState;
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
  const playerTwo = useGameStore((s) => s.gameState.playerTwo);
  const playerId = useGameStore((s) => s.playerId);
  const gameboy = useGameStore((s) => s.gameState.interactions.gameboy);

  const mainPlayer = playerId === playerOne.id ? playerOne : playerTwo;

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <color attach="background" args={["#ececec"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <Suspense>
            <Physics debug>
              <Level />
              <FirstPersonController
                player={mainPlayer}
                sendJsonMessage={sendJsonMessage}
              />
              <Selection>
                <EffectComposer multisampling={8} autoClear={false}>
                  <Outline
                    blur
                    visibleEdgeColor={0xffffff}
                    edgeStrength={100}
                    width={500}
                  />
                </EffectComposer>
                <InteractionObject
                  interaction={gameboy}
                  textPosition={[0, 1.5, 0]}
                >
                  <GameboyModel position={[0, 1, 0]} rotation={[0, -90, 0]} />
                </InteractionObject>
              </Selection>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Game;
