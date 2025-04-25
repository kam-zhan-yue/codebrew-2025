import { useRef, useState } from "react";
import { AstronautAnimation, AstronautModel } from "../models/astronaut-model";
import { PlayerState } from "../types/game-state";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AstronautProps {
  player: PlayerState;
}

const Astronaut = ({ player }: AstronautProps) => {
  const mesh = useRef<Mesh>(null!);
  const currentPos = useRef(new Vector3());
  const [animation, setAnimation] = useState<AstronautAnimation>("idle");

  useFrame(() => {
    if (!mesh.current) return;
    if (!player) return;
    const targetPosition = player.position;
    currentPos.current.lerp(targetPosition, 0.1);
    mesh.current.position.copy(currentPos.current);

    const cameraRotation = new THREE.Quaternion();
    cameraRotation.setFromEuler(new THREE.Euler(0, -player.rotation.y, 0));
    console.info("Rotation Y is ", player.rotation.y);
    // Apply the Y-axis rotation to the mesh
    mesh.current.quaternion.copy(cameraRotation);

    if (player.animationState == "idle") {
      setAnimation("idle");
    } else if (player.animationState == "walking") {
      setAnimation("walk");
    }
  });

  return (
    <mesh ref={mesh}>
      <AstronautModel scale={0.3} animation={animation} />
    </mesh>
  );
};

export default Astronaut;
