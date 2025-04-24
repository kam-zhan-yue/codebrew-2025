import { Vector3 } from "@react-three/fiber";

export interface PlayerState {
  position: Vector3;
}

export interface GameState {
  // playerOne: PlayerState,
  // playerTwo: PlayerState,
  time: number;
  tick: (deltaTime: number) => void;
}
