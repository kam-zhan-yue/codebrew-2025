import { z } from "zod";

export const Interactions = {
  none: {
    label: "",
    description: "",
    activateMessage: "",
    deactivateMessage: "",
    activateGoal: "",
    deactivateGoal: "",
  },
  gameboy: {
    label: "Gameboy",
    description: "An old school handheld console.",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Play some retro games",
    deactivateGoal: "Get off the games!",
  },
  television: {
    label: "Television",
    description: "An old school handheld console.",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Watch some telly",
    deactivateGoal: "Silence the noisy talk show",
  },
} as const;

export type InteractionType = keyof typeof Interactions;

export interface Interaction {
  id: InteractionType;
  active: boolean;
}

// Sucks that we can't use InteractionType here, but whatever.
const interactionTypes = z.enum(
  Object.keys(Interactions) as [keyof typeof Interactions],
);

const InteractionSchema = z.object({
  id: interactionTypes,
  active: z.boolean(),
});

export const InteractionsSchema = z.array(InteractionSchema);

export const defaultInteractions: Interaction[] = Object.keys(Interactions).map(
  (key) => ({
    id: key as keyof typeof Interactions,
    active: false,
  }),
);
