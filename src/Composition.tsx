// src/Composition.tsx
// Phase 1 Motion Engine entry point.
// Existing typography presets are migrated to MotionProject before rendering.

import React from "react";
import { SceneRenderer } from "./scenes/SceneRenderer";
import type { MotionRenderJob } from "./engine/RenderJob";

export const Broll: React.FC<{ job: MotionRenderJob }> = ({ job }) => {
  return <SceneRenderer job={job} />;
};
