import { Vector2 } from "@react-three/fiber";

export interface PlayerState {
  position: Vector2
}

export interface GameState {
  // playerOne: PlayerState,
  // playerTwo: PlayerState,
  time: number,
  tick: (deltaTime: number) => void,
}
