import { create } from "zustand";
import {
  DebugState,
  defaultGameState,
  defaultUIState,
  GameState,
  InteractionType,
  UIState,
} from "./game/types/game-state";

interface GameStore {
  gameState: GameState;
  uiState: UIState;
  setGameState: (newState: GameState) => void;
  setDebug: (newState: DebugState) => void;
  setActiveSelection: (newSelection: InteractionType) => void;
}

export const useGameStore = create<GameStore>()((set) => ({
  gameState: defaultGameState,
  uiState: defaultUIState,
  setGameState: (newState) => set({ gameState: newState }),
  setDebug: (newDebugState) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        debug: newDebugState,
      },
    })),
  setActiveSelection: (newSelection) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        selection: {
          ...state.uiState.selection,
          activeSelection: newSelection,
        },
      },
    })),
}));
