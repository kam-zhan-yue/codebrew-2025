import {
  defaultInteractions,
  Interaction,
  InteractionsSchema,
} from "./interactions";
import { RawPlayerSchema, PlayerState, PlayerSchema } from "./player";
import { z } from "zod";

export interface GameState {
  playerOne: PlayerState | null;
  playerTwo: PlayerState | null;
  interactions: Interaction[];
  time: number;
  countdown: number | null;
}

export const GameStateSchema = z
  .object({
    player_one: RawPlayerSchema.optional(),
    player_two: RawPlayerSchema.optional(),
    interactions: InteractionsSchema,
    time: z.number(),
  })
  .transform((raw) => ({
    playerOne: raw.player_one ? PlayerSchema.parse(raw.player_one) : undefined,
    playerTwo: raw.player_two ? PlayerSchema.parse(raw.player_two) : undefined,
    interactions: raw.interactions,
    time: raw.time,
  }));

export const defaultGameState: GameState = {
  playerOne: null,
  playerTwo: null,
  interactions: defaultInteractions,
  time: 0,
  countdown: null,
};
