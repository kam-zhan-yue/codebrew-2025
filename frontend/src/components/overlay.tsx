import { ReactNode } from "react";

interface OverlayProps {
  children: ReactNode;
  className?: string;
}

const Overlay = ({ children, className = "" }: OverlayProps) => {
  return <div className={`fixed ${className}`.trim()}>{children}</div>;
};

export default Overlay;
