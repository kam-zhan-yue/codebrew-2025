import { Canvas } from "@react-three/fiber";
import "./game.css";
import { Suspense, useMemo } from "react";
import { Cylinder, KeyboardControls } from "@react-three/drei";
import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import { Player } from "./components/player";
import FirstPersonController from "./components/first-person-controller";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
} as const;

function Game() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    [],
  );
  return (
    <>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <color attach="background" args={["#ececec"]} />
          <ambientLight intensity={1} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            color={"#9e69da"}
          />
          <Suspense>
            <Physics debug>
              <FirstPersonController />
              <RigidBody colliders={false} type="fixed" position-y={-0.5}>
                <CylinderCollider args={[0.5, 5]} />
                <Cylinder scale={[5, 1, 5]} receiveShadow>
                  <meshStandardMaterial color="white" />
                </Cylinder>
              </RigidBody>
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default Game;
