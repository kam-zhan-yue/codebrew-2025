import { z } from "zod";

type InteractionData = {
  label: string;
  description: string;
  activateMessage: string;
  desactivateMessage: string;
};

export const Interactions: Record<string, InteractionData> = {
  none: {
    label: "",
    description: "",
    activateMessage: "",
    desactivateMessage: "",
  },
  gameboy: {
    label: "Gameboy",
    description: "An old school handheld console.",
    activateMessage: "Press E to turn on",
    desactivateMessage: "Press E to turn off",
  },
  television: {
    label: "Gameboy",
    description: "An old school handheld console.",
    activateMessage: "Press E to turn on",
    desactivateMessage: "Press E to turn off",
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
