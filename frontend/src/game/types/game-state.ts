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

export const defaultGameState: GameState = {
  playerOne: {
    id: "player1",
    position: new THREE.Vector3(0, 0, 0),
  },
  playerTwo: {
    id: "player2",
    position: new THREE.Vector3(2, 0, 0),
  },
  time: 0,
};
