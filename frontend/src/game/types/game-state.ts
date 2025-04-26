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
  countdown: number | null;
}

export const GameStateSchema = z
  .object({
    player_one: RawPlayerSchema.optional(),
    player_two: RawPlayerSchema.optional(),
    interactions: InteractionsSchema,
    countdown: z.number().optional(),
  })
  .transform((raw) => ({
    playerOne: raw.player_one ? PlayerSchema.parse(raw.player_one) : undefined,
    playerTwo: raw.player_two ? PlayerSchema.parse(raw.player_two) : undefined,
    interactions: raw.interactions,
    countdown: raw.countdown,
  }));

export const defaultGameState: GameState = {
  playerOne: null,
  playerTwo: null,
  interactions: defaultInteractions,
  countdown: null,
};
