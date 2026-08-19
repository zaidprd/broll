import React from "react";
import { Audio } from "remotion";
import { resolveAsset, resolveAssetUrl } from "../../engine/AssetResolver";
import type { MotionProject } from "../../engine/MotionProject";

export const AudioClip: React.FC<{
  project: MotionProject;
  asset: string;
  volume?: number;
}> = ({ project, asset, volume = 1 }) => {
  const definition = resolveAsset(asset, project);
  if (definition.type !== "audio") {
    throw new Error(`Asset ${asset} bukan audio.`);
  }
  return <Audio src={resolveAssetUrl(asset, project)} volume={volume} />;
};
