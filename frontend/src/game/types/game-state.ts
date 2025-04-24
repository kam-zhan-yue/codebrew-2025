import * as THREE from "three";

export interface PlayerState {
  id: string;
  position: THREE.Vector3;
}

export interface GameState {
  playerOne: PlayerState;
  playerTwo: PlayerState;
  time: number;
}
