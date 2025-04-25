import { createFileRoute } from "@tanstack/react-router";
import Overlay from "../components/overlay";
import { useGameStore } from "../store";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setPlayerId = useGameStore((s) => s.setPlayerId);
  const started = useGameStore((s) => s.started);

  const handlePlayerOne = () => {
    setPlayerId("1");
  };

  const handlePlayerTwo = () => {
    setPlayerId("2");
  };

  return (
    <Overlay>
      {!started && (
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
      )}
    </Overlay>
  );
}
