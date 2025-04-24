import {
  Canvas,
  Color,
  ThreeEvent,
  useFrame,
  Vector3,
} from "@react-three/fiber";
import "./game.css";
import { Suspense, useRef, useState } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

interface CubeProps {
  position: Vector3;
  size?: [number, number, number];
  colour: Color;
}

const Cube = ({ position, size, colour }: CubeProps) => {
  const ref = useRef<Mesh>(null!);

  useFrame((_state, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta * 2.0;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshToonMaterial color={colour} />
      {/* <meshStandardMaterial color={colour} /> */}
    </mesh>
  );
};

interface SphereProps {
  position: Vector3;
  radius: number;
  heightSegments: number;
  widthSegments: number;
  colour: Color;
}

const Sphere = ({
  position,
  radius,
  heightSegments,
  widthSegments,
  colour,
}: SphereProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const ref = useRef<Mesh>(null!);

  useFrame((_state, delta) => {
    const speed = isHovered ? 5 : 0.2;
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta * speed;
  });

  const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(false);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsClicked((prev) => !prev);
  };

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      scale={isClicked ? 3 : 1}
    >
      <sphereGeometry args={[radius, heightSegments, widthSegments]} />
      <meshStandardMaterial color={colour} wireframe />
    </mesh>
  );
};

interface TorusProps {
  position: Vector3;
  radius: number;
  tube: number;
  radialSegments: number;
  tubularSegments: number;
  arc: number;
  colour: Color;
}

const Torus = ({
  position,
  radius,
  tube,
  radialSegments,
  tubularSegments,
  arc,
  colour,
}: TorusProps) => {
  const ref = useRef<Mesh>(null!);
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry
        args={[radius, tube, radialSegments, tubularSegments, arc]}
      />
      <meshStandardMaterial color={colour} />
    </mesh>
  );
};

function Game() {
  return (
    <>
      <Canvas>
        <Suspense>
          <Physics debug>
            <ambientLight />
            <directionalLight position={[0, 0, 2]} />
            <group position={[0, 0, 0]}>
              <Cube position={[2, 0, 0]} size={[2, 2, 2]} colour="orange" />
              <Sphere
                position={[0, 0, 0]}
                radius={1}
                widthSegments={30}
                heightSegments={30}
                colour="pink"
              />
              <Torus
                position={[-2, 0, 0]}
                radius={0.5}
                tube={0.1}
                radialSegments={30}
                tubularSegments={30}
                arc={3.14}
                colour="blue"
              />
            </group>
            <OrbitControls enableZoom={false} />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default Game;
