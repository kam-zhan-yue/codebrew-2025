import { create } from "zustand";
import { defaultGameState, GameState } from "./game/types/game-state";

interface GameStore {
  gameState: GameState;
  setGameState: (newState: GameState) => void;
}

export const useGameStore = create<GameStore>()((set) => ({
  gameState: defaultGameState,
  setGameState: (newState) => set({ gameState: newState }),
}));
