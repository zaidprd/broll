// src/engine/RenderJob.ts
// Per-render input passed to Remotion via inputProps. This replaces the
// mutable src/_config.generated.ts file.

import type { MotionProject } from "./MotionProject";

export type RenderAudioSettings = {
  sfxEnabled: boolean;
  padEnabled: boolean;
  sfxVolume: number;
  padVolume: number;
};

export type MotionRenderJob = {
  project: MotionProject;
  audio: RenderAudioSettings;
};
