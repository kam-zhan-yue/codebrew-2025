import { useState } from "react";
import { AstronautModel } from "../../components/astronaut-model";
import { PlayerState } from "../types/game-state";

const Astronaut = () => {
  const [playerState] = useState<PlayerState>(null!);

  return (
    <mesh position={playerState?.position}>
      <AstronautModel />
    </mesh>
  );
};

export default Astronaut;
