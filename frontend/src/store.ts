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
  setGameState: (newState) => {
    set((state) => {
      const newCountdown = newState.countdown;

      // Only go into countdown if there is a new countdown that is not 0
      if (newCountdown && newCountdown > 0 && state.flow === GameFlow.Lobby) {
        console.info("Going to countdown ", newCountdown);
        set({ flow: GameFlow.Countdown });
      }
      // Only go into game if we were previously at countdown and the new countdown has finished
      if (
        newCountdown &&
        newCountdown <= 0 &&
        state.flow === GameFlow.Countdown
      ) {
        console.info("Coundown is ", newCountdown);
        set({ flow: GameFlow.Game });
      }

      // If at any point, a player goes missing, go back to Lobby
      if (!state.gameState.playerOne || !state.gameState.playerTwo) {
        set({ flow: GameFlow.Lobby });
      }

      return { gameState: newState };
    });
  },
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
