// src/engine/MotionSchema.ts
// Runtime structural validation. Semantic relations are checked separately.

import { z } from "zod";
import { MOTION_SCHEMA_VERSION, type MotionProject } from "./MotionProject";

const id = z.string().min(1).regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, "ID hanya boleh huruf, angka, - dan _");
const frame = z.number().int().nonnegative();

const animationSchema = z.object({
  preset: z.enum(["fade", "slideUp", "slideLeft", "slideRight", "scaleIn", "wordPop", "reveal"]),
  durationFrames: z.number().int().positive(),
  easing: z.enum(["outCubic", "inOutCubic", "linear"]).optional(),
});

const assetSchema = z.object({
  type: z.enum(["image", "video", "audio", "font"]),
  src: z.string().min(1),
  durationFrames: z.number().int().positive().optional(),
});

const clipSchema = z.object({
  id,
  kind: z.string().min(1),
  at: frame,
  durationFrames: z.number().int().positive(),
  zIndex: z.number().int().optional(),
  enter: animationSchema.optional(),
  exit: animationSchema.optional(),
  props: z.record(z.string(), z.unknown()),
});

const layerSchema = z.object({
  id,
  zIndex: z.number().int(),
  clips: z.array(clipSchema),
});

const transitionSchema = z.object({
  preset: z.enum(["fade", "wipeLeft", "hardCut"]),
  durationFrames: z.number().int().positive(),
});

const sceneSchema = z.object({
  id,
  durationFrames: z.number().int().positive(),
  background: z.string().optional(),
  transitionOut: transitionSchema.optional(),
  layers: z.array(layerSchema).min(1),
});

export const motionProjectSchema = z.object({
  schemaVersion: z.literal(MOTION_SCHEMA_VERSION),
  id,
  title: z.string().min(1),
  format: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().positive().max(120),
    background: z.string().min(1),
  }),
  tokens: z.object({
    colors: z.record(z.string(), z.string()).optional(),
    fonts: z.record(z.string(), z.string()).optional(),
    spacing: z.record(z.string(), z.number()).optional(),
  }),
  assets: z.record(z.string(), assetSchema),
  scenes: z.array(sceneSchema).min(1),
});

export function parseMotionProject(input: unknown): MotionProject {
  return motionProjectSchema.parse(input) as MotionProject;
}
