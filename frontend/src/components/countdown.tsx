import { useGameStore } from "../store";
import Overlay from "./overlay";

const Countdown = () => {
  const countdown = useGameStore((s) => s.gameState.countdown);
  return (
    <>
      {countdown && (
        <Overlay className="inset-y-12">
          <div className="text-2xl">Game Starts in...</div>
          <div className="text-5xl">{Math.ceil(countdown).toFixed(2)}</div>
        </Overlay>
      )}
    </>
  );
};

export default Countdown;
