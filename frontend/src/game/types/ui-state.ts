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

export interface Task {
  interactionId: InteractionType;
  targetState: boolean;
}

export interface UIState {
  debug: DebugState | null;
  selection: SelectionState;
  restart: boolean;
}

export const defaultUIState: UIState = {
  debug: null,
  selection: {
    activeSelection: "none",
  },
  restart: true,
};
