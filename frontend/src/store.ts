import { create } from "zustand";
import { defaultGameState, GameState } from "./game/types/game-state";
import { InteractionType } from "./game/types/interactions";
import { DebugState, defaultUIState, UIState } from "./game/types/ui-state";
import { PlayerState } from "./game/types/player";

export enum GameFlow {
  Selection,
  Lobby,
  Countdown,
  Game,
  GameOver,
}

interface GameStore {
  flow: GameFlow;
  playerId: string;
  gameState: GameState;
  uiState: UIState;
  setGameState: (newState: GameState) => void;
  setFlow: (newFlow: GameFlow) => void;
  setDebug: (newState: DebugState) => void;
  setActiveSelection: (newSelection: InteractionType) => void;
  setPlayerId: (newPlayerId: string) => void;
  getPlayer: () => PlayerState | null;
  getOtherPlayer: () => PlayerState | null;
}

export const useGameStore = create<GameStore>()((set, get) => ({
  flow: GameFlow.Selection,
  playerId: "0",
  gameState: defaultGameState,
  uiState: defaultUIState,
  setGameState: (newState) => set({ gameState: newState }),
  setFlow: (newFlow) => set({ flow: newFlow }),

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
      flow: GameFlow.Lobby,
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
