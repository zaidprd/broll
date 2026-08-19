// src/engine/TimelineCompiler.ts

import type { CompiledTimeline, MotionProject } from "./MotionProject";

export function compileTimeline(project: MotionProject): CompiledTimeline {
  let sceneFrom = 0;
  const scenes = [];
  const clips = [];

  for (const scene of project.scenes) {
    scenes.push({ ...scene, from: sceneFrom });

    for (const layer of scene.layers) {
      for (const clip of layer.clips) {
        clips.push({
          ...clip,
          sceneId: scene.id,
          layerId: layer.id,
          from: sceneFrom + clip.at,
        });
      }
    }

    sceneFrom += scene.durationFrames;
    if (scene.transitionOut) sceneFrom -= scene.transitionOut.durationFrames;
  }

  return {
    durationInFrames: sceneFrom,
    scenes,
    clips: clips.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
  };
}
