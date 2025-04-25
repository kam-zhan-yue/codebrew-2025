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
} as const;

export type InteractionType = keyof typeof Interactions;
