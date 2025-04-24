import { create } from "zustand";
import { GameState } from "./game/types/game-state";

interface GameStore {
  gameState: GameState | null;
  setGameState: (newState: GameState) => void;
}

export const useGameStore = create<GameStore>()((set) => ({
  gameState: null,
  setGameState: (newState) => set({ gameState: newState }),
}));
