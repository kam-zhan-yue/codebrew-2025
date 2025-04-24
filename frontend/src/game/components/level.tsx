import { Cylinder } from "@react-three/drei";
import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import Astronaut from "../components/astronaut";
import { useGameStore } from "../../store";

const Level = () => {
  const playerTwo = useGameStore((s) => s.gameState.playerTwo);
  return (
    <Physics debug>
      <Astronaut player={playerTwo} />
      <RigidBody colliders={false} type="fixed" position-y={-0.5}>
        <CylinderCollider args={[0.5, 5]} />
        <Cylinder scale={[5, 1, 5]} receiveShadow>
          <meshStandardMaterial color="white" />
        </Cylinder>
      </RigidBody>
    </Physics>
  );
};

export default Level;
