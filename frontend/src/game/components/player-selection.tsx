import { useGameStore } from "../../store";

const PlayerSelection = () => {
  const setPlayerId = useGameStore((s) => s.setPlayerId);

  const handlePlayerOne = () => {
    setPlayerId("1");
  };

  const handlePlayerTwo = () => {
    setPlayerId("2");
  };
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex justify-between w-64">
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
    </div>
  );
};

export default PlayerSelection;
