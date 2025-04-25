import { Object3D, Intersection } from "three";
import { InteractionType } from "./types/interactions";

const isInteractionType = (name: string): name is InteractionType => {
  return (name as InteractionType) !== undefined;
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
