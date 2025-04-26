import { z } from "zod";

export const Interactions = {
  none: {
    label: "",
    description: "",
    activateMessage: "",
    deactivateMessage: "",
    activateGoal: "",
    deactivateGoal: "",
    position: [0, 0, 0],
  },
  gameboy: {
    label: "Gameboy",
    description: "An old school handheld console",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Play some retro games",
    deactivateGoal: "Get off the games!",
    position: [0, 0, 0],
  },
  television: {
    label: "Television",
    description: "The smell of the CRT fills the air",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Watch some telly",
    deactivateGoal: "Silence the noisy talk show",
    position: [-2.7, 1, -4.1],
  },
  phone: {
    label: "Phone",
    description: "An phone... with an antenna",
    activateMessage: "Press E to call",
    deactivateMessage: "Press E to put down",
    activateGoal: "Make a call",
    deactivateGoal: "Stop the call",
    position: [0, 1, 4.6],
  },
  ds: {
    label: "3DS",
    description: "A 3DS",
    activateMessage: "Press E to open",
    deactivateMessage: "Press E to close",
    activateGoal: "Play some Pokemon",
    deactivateGoal: "Stop playing Pokemon",
    position: [2.8, 1, 0],
  },
  boombox: {
    label: "Boombox",
    description: "A boombox",
    activateMessage: "Press E to open",
    deactivateMessage: "Press E to close",
    activateGoal: "Play some Pokemon",
    deactivateGoal: "Stop playing Pokemon",
    position: [-0.6, 1, -4.6],
  },
  paper: {
    label: "Paper",
    description: "A paper",
    activateMessage: "Press E to scribble",
    deactivateMessage: "Press E to erase",
    activateGoal: "Play some Pokemon",
    deactivateGoal: "Stop playing Pokemon",
    position: [2, 1, -4],
  },
  lamp: {
    label: "Lamp",
    description: "A lamp",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Play some Pokemon",
    deactivateGoal: "Stop playing Pokemon",
    position: [3.1, 1, -4.3],
  },
  book: {
    label: "Book",
    description: "A Book",
    activateMessage: "Press E to open",
    deactivateMessage: "Press E to close",
    activateGoal: "Read a book",
    deactivateGoal: "Stop reading",
    position: [2.3, 1, 4],
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
