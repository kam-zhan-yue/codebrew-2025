import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { Torii } from "../../components/torii";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../game";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import FirstPersonCamera from "./first-person-camera";

const MOVEMENT_SPEED = 0.1;

export const Player = () => {
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward],
  );
  const rigidbody = useRef<RapierRigidBody>(null!);

  useFrame(() => {
    const impulse = { x: 0, y: 0, z: 0 };
    if (rightPressed) {
      impulse.x += MOVEMENT_SPEED;
    }
    if (leftPressed) {
      impulse.x -= MOVEMENT_SPEED;
    }
    if (backPressed) {
      impulse.z += MOVEMENT_SPEED;
    }
    if (forwardPressed) {
      impulse.z -= MOVEMENT_SPEED;
    }
    console.info(
      "Right Pressed is ",
      rightPressed,
      " Left Pressed is ",
      leftPressed,
    );
    rigidbody.current.applyImpulse(impulse, true);
  });

  return (
    <group>
      <RigidBody
        ref={rigidbody}
        colliders={false}
        scale={[0.5, 0.5, 0.5]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider args={[1, 1]} position={[0, 1.2, 0]} />
        <Torii />
      </RigidBody>
      <FirstPersonCamera />
    </group>
  );
};
