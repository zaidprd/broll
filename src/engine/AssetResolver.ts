// src/engine/AssetResolver.ts
// Resolves only controlled local asset references.

import { staticFile } from "remotion";
import type { MotionAsset, MotionProject } from "./MotionProject";

function assertSafeAssetPath(src: string): void {
  if (src.startsWith("/") || src.includes("..") || /^[a-z]+:\/\//i.test(src)) {
    throw new Error(`Asset path tidak diizinkan: ${src}`);
  }
}

export function resolveAsset(assetId: string, project: MotionProject): MotionAsset {
  const asset = project.assets[assetId];
  if (!asset) throw new Error(`Asset tidak ditemukan: ${assetId}`);
  assertSafeAssetPath(asset.src);
  return asset;
}

export function resolveAssetUrl(assetId: string, project: MotionProject): string {
  return staticFile(resolveAsset(assetId, project).src);
}
