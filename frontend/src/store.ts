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
  setRestart: (restart: boolean) => void;
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
        set({ flow: GameFlow.Countdown });
      }
      // Only go into game if we were previously at countdown and the new countdown has finished
      if (
        newCountdown &&
        newCountdown <= 0 &&
        state.flow === GameFlow.Countdown
      ) {
        set({ flow: GameFlow.Game });
      }

      // If there is a winner, and we were in Game previously, we go into GameOver
      if (state.flow === GameFlow.Game && state.gameState.winnerId) {
        set({ flow: GameFlow.GameOver });
      }

      // If we are in game over and countdown resets, go back to countdown
      if (
        state.flow === GameFlow.GameOver &&
        newCountdown &&
        newCountdown > 0
      ) {
        set({
          flow: GameFlow.Countdown,
          uiState: { ...state.uiState, restart: true },
        });
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

  setRestart: (restart) =>
    set((state) => ({
      uiState: {
        ...state.uiState,
        restart: restart,
      },
    })),
}));
