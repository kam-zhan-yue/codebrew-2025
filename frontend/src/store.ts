import { create } from "zustand";
import {
  DebugState,
  defaultGameState,
  GameState,
  InteractionType,
} from "./game/types/game-state";

interface GameStore {
  gameState: GameState;
  setGameState: (newState: GameState) => void;
  setDebug: (newState: DebugState) => void;
  setActiveSelection: (newSelection: InteractionType) => void;
}

export const useGameStore = create<GameStore>()((set) => ({
  gameState: defaultGameState,
  setGameState: (newState) => set({ gameState: newState }),
  setDebug: (newDebugState) =>
    set((state) => ({
      gameState: {
        ...state.gameState,
        debug: newDebugState,
      },
    })),
  setActiveSelection: (newSelection) =>
    set((state) => ({
      gameState: {
        ...state.gameState,
        selection: {
          ...state.gameState.selection,
          activeSelection: newSelection,
        },
      },
    })),
}));
