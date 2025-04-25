import Debug from "./debug";
import { GameFlow, useGameStore } from "../store";
import Countdown from "./countdown";
import GameOver from "./game-over";
import GameUI from "./game-ui";
import Lobby from "./lobby";
import PlayerSelection from "./player-selection";
import { PRODUCTION } from "../api/constants";

const Flow = () => {
  const flow = useGameStore((s) => s.flow);
  return (
    <>
      {flow === GameFlow.Selection && <PlayerSelection />}
      {flow === GameFlow.Lobby && <Lobby />}
      {flow === GameFlow.Countdown && <Countdown />}
      {flow === GameFlow.Game && <GameUI />}
      {flow === GameFlow.GameOver && <GameOver />}
      {!PRODUCTION && <Debug />}
    </>
  );
};

export default Flow;
