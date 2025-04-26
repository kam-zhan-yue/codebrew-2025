import {
  PLAYER_ONE,
  PLAYER_ONE_NAME,
  PLAYER_TWO_NAME,
} from "../game/constants";
import { useGameStore } from "../store";
import Overlay from "./overlay";

const GameOver = () => {
  const winnerId = useGameStore((s) => s.gameState.winnerId);
  if (!winnerId) {
    return (
      <Overlay className="inset-y-64">
        <div className="text-5xl">Game Over</div>
      </Overlay>
    );
  }

  const displayName =
    winnerId === PLAYER_ONE ? PLAYER_ONE_NAME : PLAYER_TWO_NAME;
  const colour = winnerId === PLAYER_ONE ? "text-red-500" : "text-blue-500";
  return (
    <Overlay className="inset-y-64">
      <div className="text-5xl mb-6">Game Over</div>
      <div className="text-2xl text-center">
        <span className={colour}>{displayName}</span> wins!
      </div>
    </Overlay>
  );
};

export default GameOver;
