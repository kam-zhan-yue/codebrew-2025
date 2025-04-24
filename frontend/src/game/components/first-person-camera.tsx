import { useThree, useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface FirstPersonCameraProps {
  targetRef: React.RefObject<RapierRigidBody>;
  offset?: [number, number, number];
}

export const FirstPersonCamera = ({
  targetRef,
  offset = [0, 1.6, 0],
}: FirstPersonCameraProps) => {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      yaw.current -= event.movementX * 0.002;
      pitch.current -= event.movementY * 0.002;
      pitch.current = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, pitch.current),
      ); // clamp
    };

    const handleClick = () => {
      gl.domElement.requestPointerLock();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, [gl]);

  useFrame(() => {
    const target = targetRef.current;
    if (!target) return;

    const pos = target.translation();
    const camX = pos.x + offset[0];
    const camY = pos.y + offset[1];
    const camZ = pos.z + offset[2];

    camera.position.set(camX, camY, camZ);

    // Construct camera quaternion from yaw & pitch
    const quat = new THREE.Quaternion();
    quat.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, "YXZ"));
    camera.quaternion.copy(quat);
  });

  return null;
};
