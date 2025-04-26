import { PLAYER_ONE, PLAYER_TWO } from "../game/constants";
import { useGameStore } from "../store";
import Overlay from "./overlay";

const PlayerSelection = () => {
  const setPlayerId = useGameStore((s) => s.setPlayerId);

  const handlePlayerOne = () => {
    setPlayerId(PLAYER_ONE);
  };

  const handlePlayerTwo = () => {
    setPlayerId(PLAYER_TWO);
  };

  return (
    <Overlay className="fixed inset-10 flex items-end justify-center pb-8 pointer-events-none">
      <div className="flex gap-4 pointer-events-auto">
        <button
          onClick={handlePlayerOne}
          className="px-6 py-3 text-white text-lg bg-blue-500 rounded-md"
        >
          Player One
        </button>
        <button
          onClick={handlePlayerTwo}
          className="px-6 py-3 text-white text-lg bg-green-500 rounded-md"
        >
          Player Two
        </button>
      </div>
    </Overlay>
  );
};

export default PlayerSelection;
