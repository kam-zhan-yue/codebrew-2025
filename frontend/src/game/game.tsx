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

  // // Proxy websocket before the backend is setup
  // const playerTwoZ = useRef(0);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     playerTwoZ.current += 0.01;
  //     const rawJson = JSON.stringify({
  //       playerOne: {
  //         id: "player1",
  //         position: [2, 0, 0],
  //         animationState: "idle",
  //       },
  //       playerTwo: {
  //         id: "player2",
  //         position: [0, 0, playerTwoZ.current],
  //         animationState: "walking",
  //       },
  //       interactions: {
  //         gameboy: { type: "gameboy", active: false },
  //       },
  //       time: Date.now(),
  //     });

  //     const parsed = JSON.parse(rawJson);

  //     const rawState = {
  //       playerOne: {
  //         id: parsed.playerOne.id,
  //         position: new THREE.Vector3(...parsed.playerOne.position),
  //         animationState: parsed.playerOne.animationState,
  //       },
  //       playerTwo: {
  //         id: parsed.playerTwo.id,
  //         position: new THREE.Vector3(...parsed.playerTwo.position),
  //         animationState: parsed.playerTwo.animationState,
  //       },
  //       interactions: {
  //         gameboy: {
  //           type: parsed.interactions.gameboy.type,
  //           active: parsed.interactions.gameboy.active,
  //         },
  //       },
  //       time: parsed.time,
  //     } as GameState;

  //     setGameState(rawState);
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [setGameState]);

  useEffect(() => {
    //@ts-expect-error
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
          animationState: json.player_one.animationState,
        },
        playerTwo: {
          id: json.player_two.id,
          position: new THREE.Vector3(
            json.player_two.position.x,
            json.player_two.position.y,
            json.player_two.position.z,
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
      console.info(rawState);
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
  // const gameboy = useGameStore((s) => s.gameState.interactions.gameboy);

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
                player={playerOne}
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
                {/* <InteractionObject
                  interaction={gameboy}
                  textPosition={[0, 1.5, 0]}
                >
                  <GameboyModel position={[0, 1, 0]} rotation={[0, -90, 0]} />
                </InteractionObject> */}
              </Selection>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Game;
