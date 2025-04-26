import { z } from "zod";
import * as THREE from "three";
export type AnimState = "idle" | "walking";

export interface PlayerState {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  animationState: AnimState;
}

export const RawPlayerSchema = z.object({
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

export const PlayerSchema = RawPlayerSchema.transform((raw) => {
  if (raw === null) {
    return null;
  }
  return {
    id: raw.id,
    position: new THREE.Vector3(raw.position.x, raw.position.y, raw.position.z),
    rotation: new THREE.Euler(raw.rotation.x, raw.rotation.y, raw.rotation.z),
    animationState: raw.animation_state,
  };
});
