import { z } from "zod";

export enum MessageType {
  player = "player",
  interaction = "interaction",
  restart = "restart",
}

export const RestartMessageSchema = z.object({
  message_id: z.union([
    z.literal(MessageType.interaction),
    z.enum([MessageType.interaction, MessageType.player]),
  ]),
  player_id: z.string(),
  restart: z.boolean(),
});

export const InteractionMessageSchema = z.object({
  message_id: z.union([
    z.literal(MessageType.interaction),
    z.enum([MessageType.interaction, MessageType.player]),
  ]),
  player_id: z.string(),
  interaction_id: z.string().min(1),
  active: z.boolean(),
});

export const PlayerMessageSchema = z.object({
  message_id: z.union([
    z.literal(MessageType.interaction),
    z.enum([MessageType.interaction, MessageType.player]),
  ]),
  player_id: z.string(),
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
