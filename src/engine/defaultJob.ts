// src/engine/defaultJob.ts

import scriptHeroPreset from "../../presets/script-hero.json";
import { migrateLegacyPreset, type LegacyTypographyPreset } from "./LegacyMigration";
import type { MotionRenderJob } from "./RenderJob";

export const defaultRenderJob: MotionRenderJob = {
  project: migrateLegacyPreset(scriptHeroPreset as unknown as LegacyTypographyPreset, {
    id: "default-script-hero",
    title: scriptHeroPreset.name,
  }),
  audio: {
    sfxEnabled: true,
    padEnabled: true,
    sfxVolume: 0.7,
    padVolume: 0.4,
  },
};
