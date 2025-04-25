import * as THREE from "three";
import {
  defaultInteractions,
  Interaction,
  InteractionsSchema,
} from "./interactions";
import { RawPlayerSchema, PlayerState, PlayerSchema } from "./player";
import { z } from "zod";

export interface GameState {
  playerOne: PlayerState;
  playerTwo: PlayerState;
  interactions: Interaction[];
  time: number;
}

export const GameStateSchema = z
  .object({
    player_one: RawPlayerSchema,
    player_two: RawPlayerSchema,
    interactions: InteractionsSchema,
    time: z.number(),
  })
  .transform((raw) => ({
    playerOne: PlayerSchema.parse(raw.player_one),
    playerTwo: PlayerSchema.parse(raw.player_two),
    interactions: raw.interactions,
    time: raw.time,
  }));

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
  interactions: defaultInteractions,
  time: 0,
};
