import { FirstPersonControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { FirstPersonControls as FirstPersonControlsImpl } from "three-stdlib";

const FirstPersonCamera = () => {
  const { camera } = useThree();
  const controls = useRef<FirstPersonControlsImpl>(null!);
  return <FirstPersonControls object={camera} ref={controls} autoForward />;
};

export default FirstPersonCamera;
