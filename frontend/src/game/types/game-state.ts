import * as THREE from "three";

export type AnimState = "idle" | "walking";
export interface PlayerState {
  id: string;
  position: THREE.Vector3;
  animationState: AnimState;
}

export interface Interaction {
  active: boolean;
}

export interface InteractionState {
  gameboy: Interaction;
}

export interface GameState {
  playerOne: PlayerState;
  playerTwo: PlayerState;
  interactions: InteractionState;
  time: number;
}

export const defaultGameState: GameState = {
  playerOne: {
    id: "player1",
    position: new THREE.Vector3(0, 0, 0),
    animationState: "idle",
  },
  playerTwo: {
    id: "player2",
    position: new THREE.Vector3(2, 0, 0),
    animationState: "idle",
  },
  interactions: {
    gameboy: { active: true },
  },
  time: 0,
};
