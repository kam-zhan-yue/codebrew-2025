import { z } from "zod";
import * as THREE from "three";
export type AnimState = "idle" | "walking";

export interface PlayerState {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  animationState: AnimState;
}

export const PlayerSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  rotation: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  animation_state: z.string(),
});
