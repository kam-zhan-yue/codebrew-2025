import { create } from "zustand";
import { defaultGameState, GameState } from "./game/types/game-state";
import { InteractionType } from "./game/types/interactions";
import { DebugState, defaultUIState, UIState } from "./game/types/ui-state";
import { PlayerState } from "./game/types/player";

interface GameStore {
  playerId: string;
  started: boolean;
  gameState: GameState;
  uiState: UIState;
  setGameState: (newState: GameState) => void;
  setDebug: (newState: DebugState) => void;
  setActiveSelection: (newSelection: InteractionType) => void;
  setPlayerId: (newPlayerId: string) => void;
  getPlayer: () => PlayerState | null;
  getOtherPlayer: () => PlayerState | null;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  playerId: "0",
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

  getPlayer: () => {
    const { gameState, playerId } = get();
    if (gameState.playerOne?.id === playerId) return gameState.playerOne;
    if (gameState.playerTwo?.id === playerId) return gameState.playerTwo;
    return null;
  },

  getOtherPlayer: () => {
    const { gameState, playerId } = get();
    if (gameState.playerOne?.id === playerId) return gameState.playerTwo;
    if (gameState.playerTwo?.id === playerId) return gameState.playerOne;
    return null;
  },
}));
