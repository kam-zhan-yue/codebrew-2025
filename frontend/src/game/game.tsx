import { Canvas } from "@react-three/fiber";
import "./game.css";
import { Suspense, useEffect, useMemo } from "react";
import { KeyboardControls } from "@react-three/drei";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../api/constants";
import { useGameStore } from "../store";
import { GameState, GameStateSchema } from "./types/game-state";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import FirstPersonController from "./components/first-person-controller";
import Level from "./components/level";
import { Physics } from "@react-three/rapier";

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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = lastJsonMessage as any;
    if (json) {
      const parsed = GameStateSchema.safeParse(json);

      if (!parsed.success) {
        console.error("Invalid game state:", parsed.error);
        return;
      }
      const gameState = parsed.data as GameState;
      setGameState(gameState);
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

  const mainPlayer = playerId === playerOne?.id ? playerOne : playerTwo;

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <color attach="background" args={["#ececec"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <Suspense>
            <Physics debug>
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
                <Level />
              </Selection>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default Game;
