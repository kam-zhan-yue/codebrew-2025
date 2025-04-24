import { Outline } from "@react-three/postprocessing";

const OutlineEffect = () => {
  return (
    <Outline
      blur
      edgeStrength={100}
      visibleEdgeColor={0x000000}
      hiddenEdgeColor={0x000000}
    />
  );
};

export default OutlineEffect;
