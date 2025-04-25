import { Cylinder } from "@react-three/drei";
import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import Astronaut from "../components/astronaut";
import { useGameStore } from "../../store";
import { EnvironmentModel } from "../models/environment-model";

const Level = () => {
  const playerTwo = useGameStore((s) => s.gameState.playerTwo);
  return (
    <Physics debug>
      <EnvironmentModel />
      <Astronaut player={playerTwo} />
    </Physics>
  );
};

export default Level;
