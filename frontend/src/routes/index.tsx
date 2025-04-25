import { createFileRoute } from "@tanstack/react-router";
import Overlay from "../components/overlay";
import { GameFlow, useGameStore } from "../store";
import PlayerSelection from "../game/components/player-selection";
import Countdown from "../game/components/countdown";
import GameUI from "../game/components/game-ui";
import GameOver from "../game/components/game-over";
import Lobby from "../game/components/lobby";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const flow = useGameStore((s) => s.flow);
  return (
    <Overlay>
      {flow === GameFlow.Selection && <PlayerSelection />}
      {flow === GameFlow.Lobby && <Lobby />}
      {flow === GameFlow.Countdown && <Countdown />}
      {flow === GameFlow.Game && <GameUI />}
      {flow === GameFlow.GameOver && <GameOver />}
    </Overlay>
  );
}
