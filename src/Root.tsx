// src/Root.tsx
// Phase 1: metadata comes from per-render MotionProject input props.

import React from "react";
import { Composition } from "remotion";
import { Broll } from "./Composition";
import { defaultRenderJob } from "./engine/defaultJob";
import { getProjectDuration } from "./scenes/SceneRenderer";
import { parseMotionProject } from "./engine/MotionSchema";
import { throwOnMotionErrors } from "./engine/MotionValidator";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Broll"
      component={Broll}
      defaultProps={{ job: defaultRenderJob }}
      durationInFrames={getProjectDuration(defaultRenderJob.project)}
      fps={defaultRenderJob.project.format.fps}
      width={defaultRenderJob.project.format.width}
      height={defaultRenderJob.project.format.height}
      calculateMetadata={({ props }) => {
        const project = parseMotionProject(props.job.project);
        throwOnMotionErrors(project);
        return {
          durationInFrames: getProjectDuration(project),
          fps: project.format.fps,
          width: project.format.width,
          height: project.format.height,
        };
      }}
    />
  );
};
