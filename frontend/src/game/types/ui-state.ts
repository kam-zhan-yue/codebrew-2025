import { InteractionType } from "./interactions";
import * as THREE from "three";

export interface DebugState {
  raycastData: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>;
}

export interface SelectionState {
  activeSelection: InteractionType;
}

export interface UIState {
  debug: DebugState | null;
  selection: SelectionState;
}

export const defaultUIState: UIState = {
  debug: null,
  selection: {
    activeSelection: "none",
  },
};
