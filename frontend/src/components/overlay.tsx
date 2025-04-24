import { ReactNode } from "react";

interface OverlayProps {
  children: ReactNode;
}

const Overlay = ({ children }: OverlayProps) => {
  return <div className="fixed inset-0 w-full h-full">{children}</div>;
};

export default Overlay;
