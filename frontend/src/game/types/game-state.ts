import * as THREE from "three";
import { InteractionType } from "./interactions";

export type AnimState = "idle" | "walking";

export interface PlayerState {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  animationState: AnimState;
}

export interface Interaction {
  type: InteractionType;
  active: boolean;
}

export interface InteractionState {
  gameboy: Interaction;
}

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

export interface GameState {
  playerOne: PlayerState;
  playerTwo: PlayerState;
  interactions: InteractionState;
  time: number;
}

export const defaultUIState: UIState = {
  debug: null,
  selection: {
    activeSelection: "none",
  },
};

export const defaultGameState: GameState = {
  playerOne: {
    id: "player1",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    animationState: "idle",
  },
  playerTwo: {
    id: "player2",
    position: new THREE.Vector3(2, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    animationState: "idle",
  },
  interactions: {
    gameboy: { type: "gameboy", active: true },
  },
  time: 0,
};
