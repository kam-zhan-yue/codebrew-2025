import { Object3D, Intersection } from "three";
import { Interactions, InteractionType } from "./types/interactions";
import * as THREE from "three";

const isInteractionType = (name: string): name is InteractionType => {
  return name in Interactions;
};

export const findFirstInteractionHit = (
  intersects: Intersection<Object3D>[],
): { object: Object3D; interaction: InteractionType } | null => {
  for (const intersect of intersects) {
    let current: Object3D | null = intersect.object;
    while (current) {
      if (isInteractionType(current.name)) {
        return { object: current, interaction: current.name };
      }
      current = current.parent;
    }
  }

  return null;
};

export const toThreeVector3 = (vector: {
  x: number;
  y: number;
  z: number;
}): THREE.Vector3 => {
  return new THREE.Vector3(vector.x, vector.y, vector.z);
};
