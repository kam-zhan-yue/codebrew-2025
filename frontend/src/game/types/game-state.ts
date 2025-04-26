import { Interaction, InteractionsSchema } from "./interactions";
import { RawPlayerSchema, PlayerState, PlayerSchema } from "./player";
import { z } from "zod";

export interface GameState {
  playerOne: PlayerState | null;
  playerTwo: PlayerState | null;
  interactions: Interaction[] | null;
  countdown: number | null;
  winnerId: string | null;
}

export const GameStateSchema = z
  .object({
    player_one: RawPlayerSchema.nullable().optional(),
    player_two: RawPlayerSchema.nullable().optional(),
    interactions: InteractionsSchema.optional(),
    countdown: z.number().nullable().optional(),
    winner_id: z.string().nullable().optional(),
  })
  .transform((raw) => ({
    playerOne: raw.player_one ? PlayerSchema.parse(raw.player_one) : undefined,
    playerTwo: raw.player_two ? PlayerSchema.parse(raw.player_two) : undefined,
    interactions: raw.interactions ? raw.interactions : undefined,
    countdown: raw.countdown ? raw.countdown : undefined,
    winnerId: raw.winner_id,
  }));

export const defaultGameState: GameState = {
  playerOne: null,
  playerTwo: null,
  interactions: null,
  countdown: null,
  winnerId: null,
};
