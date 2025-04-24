import { create } from 'zustand'
import { GameState } from './game/types/game-state'

export const useGameStore = create<GameState>()((set) => ({
  time: 0,
  tick: (deltaTime) => set((state) => ({ time: state.time + deltaTime}))
}))
