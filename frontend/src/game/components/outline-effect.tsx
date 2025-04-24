import { useThree } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { useMemo } from "react";
import * as THREE from "three";

const OutlineEffect = () => {
  const { scene } = useThree();

  // Collect all meshes once the scene is ready
  const allMeshes = useMemo(() => {
    const meshes: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child);
      }
    });
    return meshes;
  }, [scene]);

  return (
    <EffectComposer>
      <Outline
        selection={allMeshes}
        visibleEdgeColor={0xffffff}
        hiddenEdgeColor={0x000000}
        edgeStrength={100}
        blur
      />
    </EffectComposer>
  );
};

export default OutlineEffect;
