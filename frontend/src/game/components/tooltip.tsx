import { Html } from "@react-three/drei";
import { ReactNode } from "react";

interface TooltipProps {
  position: [number, number, number];
  children: ReactNode;
}

const Tooltip = ({ children, position }: TooltipProps) => {
  return (
    <Html position={position} center distanceFactor={10} className="tooltip">
      {children}
    </Html>
  );
};

export default Tooltip;
