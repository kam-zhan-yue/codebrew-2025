import { InteractionType } from "./interactions";
import * as THREE from "three";

export interface DebugState {
  raycastData: {
    object: THREE.Object3D;
    interaction: InteractionType;
  } | null;
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
