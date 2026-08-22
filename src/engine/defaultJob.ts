// src/engine/defaultJob.ts

import appleDarkStagePreset from "../../presets/apple-01-dark-stage.json";
import type { MotionProject } from "./MotionProject";
import type { MotionRenderJob } from "./RenderJob";

export const defaultRenderJob: MotionRenderJob = {
  project: appleDarkStagePreset as MotionProject,
  audio: {
    sfxEnabled: true,
    padEnabled: false,
    sfxVolume: 0.7,
    padVolume: 0.4,
  },
};
