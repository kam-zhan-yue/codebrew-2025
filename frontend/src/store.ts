import { create } from "zustand";
import {
  DebugState,
  defaultGameState,
  defaultUIState,
  GameState,
  UIState,
} from "./game/types/game-state";
import { InteractionType } from "./game/types/interactions";

interface GameStore {
  playerId: string;
  started: boolean;
  gameState: GameState;
  uiState: UIState;
  setGameState: (newState: GameState) => void;
  setDebug: (newState: DebugState) => void;
  setActiveSelection: (newSelection: InteractionType) => void;
  setPlayerId: (newPlayerId: string) => void;
}

export const useGameStore = create<GameStore>()((set) => ({
  playerId: "1",
  started: false,
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
  setPlayerId: (id) =>
    set(() => ({
      playerId: id,
      started: true,
    })),
}));
