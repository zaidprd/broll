// src/engine/MotionValidator.ts
// Semantic validation after structural Zod validation.

import type { MotionProject } from "./MotionProject";
import { isRegisteredComponentKind, validateComponentProps } from "./ComponentRegistry";

export type MotionDiagnostic = {
  level: "error" | "warning";
  path: string;
  message: string;
};

export function validateMotionProject(project: MotionProject): MotionDiagnostic[] {
  const diagnostics: MotionDiagnostic[] = [];
  const ids = new Set<string>();

  const registerId = (value: string, path: string) => {
    if (ids.has(value)) {
      diagnostics.push({ level: "error", path, message: `ID duplikat: ${value}` });
    }
    ids.add(value);
  };

  registerId(project.id, "project.id");

  for (const [sceneIndex, scene] of project.scenes.entries()) {
    registerId(scene.id, `scenes[${sceneIndex}].id`);

    if (scene.transitionOut && scene.transitionOut.durationFrames >= scene.durationFrames) {
      diagnostics.push({
        level: "error",
        path: `scenes[${sceneIndex}].transitionOut`,
        message: "Durasi transition harus lebih pendek dari durasi scene.",
      });
    }

    const fontNames = new Set<string>();
    const accentColors = new Set<string>();
    let visibleClipCount = 0;

    for (const [layerIndex, layer] of scene.layers.entries()) {
      registerId(layer.id, `scenes[${sceneIndex}].layers[${layerIndex}].id`);

      for (const [clipIndex, clip] of layer.clips.entries()) {
        const path = `scenes[${sceneIndex}].layers[${layerIndex}].clips[${clipIndex}]`;
        registerId(clip.id, `${path}.id`);

        if (!isRegisteredComponentKind(clip.kind)) {
          diagnostics.push({
            level: "error",
            path: `${path}.kind`,
            message: `Component kind belum terdaftar: ${clip.kind}`,
          });
        } else {
          for (const message of validateComponentProps(clip.kind, clip.props)) {
            diagnostics.push({ level: "error", path: `${path}.props`, message });
          }
        }

        if (clip.kind === "audio.clip" || clip.kind === "media.image" || clip.kind === "media.video") {
          const assetId = clip.props.asset;
          const asset = typeof assetId === "string" ? project.assets[assetId] : undefined;
          const expectedType = clip.kind === "audio.clip" ? "audio" : clip.kind === "media.image" ? "image" : "video";
          if (!asset) {
            diagnostics.push({ level: "error", path: `${path}.props.asset`, message: `Asset untuk ${clip.kind} tidak ditemukan.` });
          } else if (asset.type !== expectedType) {
            diagnostics.push({ level: "error", path: `${path}.props.asset`, message: `Asset untuk ${clip.kind} harus bertipe ${expectedType}.` });
          }
        }

        if (clip.at + clip.durationFrames > scene.durationFrames) {
          diagnostics.push({
            level: "error",
            path,
            message: "Clip melewati durasi scene.",
          });
        }

        if (clip.enter && clip.enter.durationFrames > clip.durationFrames) {
          diagnostics.push({ level: "error", path: `${path}.enter`, message: "Enter animation lebih panjang dari clip." });
        }

        if (clip.exit && clip.exit.durationFrames > clip.durationFrames) {
          diagnostics.push({ level: "error", path: `${path}.exit`, message: "Exit animation lebih panjang dari clip." });
        }

        if (!clip.kind.startsWith("audio.")) visibleClipCount += 1;

        const font = clip.props.font;
        if (typeof font === "string") fontNames.add(font);
        const accent = clip.props.accent;
        if (typeof accent === "string") accentColors.add(accent);
      }
    }

    if (visibleClipCount > 4) {
      diagnostics.push({
        level: "warning",
        path: `scenes[${sceneIndex}]`,
        message: "Scene memiliki lebih dari 4 component visual; pertimbangkan memecah scene.",
      });
    }

    if (fontNames.size > 2) {
      diagnostics.push({
        level: "warning",
        path: `scenes[${sceneIndex}]`,
        message: "Scene memakai lebih dari 2 font family.",
      });
    }

    if (accentColors.size > 1) {
      diagnostics.push({
        level: "warning",
        path: `scenes[${sceneIndex}]`,
        message: "Scene memakai lebih dari 1 primary accent.",
      });
    }
  }

  return diagnostics;
}

export function throwOnMotionErrors(project: MotionProject): MotionDiagnostic[] {
  const diagnostics = validateMotionProject(project);
  const errors = diagnostics.filter((item) => item.level === "error");
  if (errors.length > 0) {
    throw new Error(errors.map((item) => `${item.path}: ${item.message}`).join("\n"));
  }
  return diagnostics;
}
