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
    description: "An old school handheld console. You can almost see the screen",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Play some retro games",
    deactivateGoal: "No more Tetris!",
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
    activateGoal: "Call Barbara to hear the goss",
    deactivateGoal: "Put a stop Barbara's incessant noise from the phone",
    position: [0, 1, 4.6],
  },
  ds: {
    label: "3DS",
    description: "A new school handheld console. It makes your eyes feel weird...",
    activateMessage: "Press E to to turn on 3D mode",
    deactivateMessage: "Press E to stop the eye pain",
    activateGoal: "Play another Pokemon remake",
    deactivateGoal: "Put the Pokemon in the PC forever",
    position: [2.8, 1, 0],
  },
  boombox: {
    label: "Boombox",
    description: "The subwoofers on this thing look like they can move some serious air",
    activateMessage: "Press E to play some beats",
    deactivateMessage: "Press E to turn off the tunes",
    activateGoal: "Listen to some classics",
    deactivateGoal: "Turn off the music... If you can even call it that",
    position: [-0.6, 1, -4.6],
  },
  paper: {
    label: "Paper",
    description: "A mirror to a world of imagination (a.k.a. paper)",
    activateMessage: "Press E to scribble",
    deactivateMessage: "Press E to erase",
    activateGoal: "Unleash your inner Monet",
    deactivateGoal: "The drawing is lacking inspiraton... Let's start again",
    position: [2, 1, -4],
  },
  lamp: {
    label: "Lamp",
    description: "The only thing standing between you and the monsters under the bed",
    activateMessage: "Press E to ignite",
    deactivateMessage: "Press E to extinguish",
    activateGoal: "Scare away mosters with the lamp",
    deactivateGoal: "Embrace the darkness. Let them come...",
    position: [3.1, 1, -4.3],
  },
  book: {
    label: "Book",
    description: "Huh... Dostoyevski! What a classic",
    activateMessage: "Press E to read",
    deactivateMessage: "Press E to close",
    activateGoal: "Read Crime and Punishment",
    deactivateGoal: "Stop reading classics",
    position: [2.3, 1, 4],
  },
  boombox: {
    label: "Boombox",
    description: "A great boombox.",
    activateMessage: "Press E to turn on",
    deactivateMessage: "Press E to turn off",
    activateGoal: "Listen to some tunes",
    deactivateGoal: "Stop the music!",
  }
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
