import { Html } from "@react-three/drei";
import { ReactNode } from "react";

interface TooltipProps {
  position: [number, number, number];
  children: ReactNode;
}

const Tooltip = ({ children, position }: TooltipProps) => {
  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      style={{
        background: "white",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "6px",
        fontWeight: "bold",
        color: "black",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Html>
  );
};

export default Tooltip;
