// src/engine/MotionProject.ts
// Canonical Phase 1 render contract for ZAID PRD Motion Engine.

export const MOTION_SCHEMA_VERSION = "1.0" as const;

export type MotionFormat = {
  width: number;
  height: number;
  fps: number;
  background: string;
};

export type MotionTokens = {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  spacing?: Record<string, number>;
};

export type AssetType = "image" | "video" | "audio" | "font";

export type MotionAsset = {
  type: AssetType;
  src: string;
  durationFrames?: number;
};

export type ClipAnimation = {
  preset: "fade" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn" | "wordPop" | "reveal";
  durationFrames: number;
  easing?: "outCubic" | "inOutCubic" | "linear";
};

export type MotionClip = {
  id: string;
  kind: string;
  at: number;
  durationFrames: number;
  zIndex?: number;
  enter?: ClipAnimation;
  exit?: ClipAnimation;
  props: Record<string, unknown>;
};

export type MotionLayer = {
  id: string;
  zIndex: number;
  clips: MotionClip[];
};

export type MotionTransition = {
  preset: "fade" | "wipeLeft" | "hardCut";
  durationFrames: number;
};

export type MotionScene = {
  id: string;
  durationFrames: number;
  background?: string;
  transitionOut?: MotionTransition;
  layers: MotionLayer[];
};

export type MotionProject = {
  schemaVersion: typeof MOTION_SCHEMA_VERSION;
  id: string;
  title: string;
  format: MotionFormat;
  tokens: MotionTokens;
  assets: Record<string, MotionAsset>;
  scenes: MotionScene[];
};

export type CompiledClip = MotionClip & {
  sceneId: string;
  layerId: string;
  from: number;
};

export type CompiledScene = MotionScene & {
  from: number;
};

export type CompiledTimeline = {
  durationInFrames: number;
  scenes: CompiledScene[];
  clips: CompiledClip[];
};
