import { Canvas } from "@react-three/fiber";
import "./game.css";
import { Suspense, useEffect, useMemo, useState } from "react";
import { KeyboardControls, KeyboardControlsEntry } from "@react-three/drei";
import useWebSocket from "react-use-websocket";
import { PRODUCTION, WS_URL } from "../api/constants";
import { GameFlow, useGameStore } from "../store";
import { GameState, GameStateSchema } from "./types/game-state";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import FirstPersonController from "./components/first-person-controller";
import Level from "./components/level";
import { Physics } from "@react-three/rapier";
import { Controls } from "./types/controls";

const Game = () => {
  const setGameState = useGameStore((state) => state.setGameState);
  const playerId = useGameStore((s) => s.playerId);
  const [socketUrl, setSocketUrl] = useState("wss://echo.websocket.org");

  const flow = useGameStore((s) => s.flow);
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );
  const crosshairSelected = activeSelection !== "none";
  const canShowCrosshair =
    flow === GameFlow.Lobby ||
    flow === GameFlow.Countdown ||
    flow === GameFlow.Game;
  const debug = !PRODUCTION;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    socketUrl,
    {},
    true,
  );

  useEffect(() => {
    if (playerId !== "0") {
      setSocketUrl(WS_URL + "/" + playerId);
    }
  }, [playerId]);

  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (socketUrl === "wss://echo.websocket.org") return;
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
  }, [setGameState, lastJsonMessage, socketUrl]);

  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.interact, keys: ["KeyE"], up: true },
    ],
    [],
  );

  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <color attach="background" args={["#b2d8d8"]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <Suspense>
            <Physics debug={debug}>
              <FirstPersonController sendJsonMessage={sendJsonMessage} />
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
        {canShowCrosshair && (
          <div
            style={{
              // TODO: make invisible before game starts, after game ends
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              border: "2px solid",
              borderColor: crosshairSelected ? "green" : "white",
            }}
          />
        )}
      </KeyboardControls>
    </>
  );
};

export default Game;
