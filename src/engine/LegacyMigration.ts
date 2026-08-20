// src/engine/LegacyMigration.ts
// Converts current Broll Studio typography presets into MotionProject V1.

import type { AudioConfig, ElementConfig } from "../_types";
import { MOTION_SCHEMA_VERSION, type MotionProject } from "./MotionProject";

export type LegacyTypographyPreset = {
  name?: string;
  description?: string;
  elements: ElementConfig[];
};

const DEFAULT_DURATION_SECONDS = 6;
const DEFAULT_FPS = 30;

function kindForElement(element: ElementConfig): "typography.headline" | "typography.body" | "typography.label" {
  if (element.fontSize >= 110) return "typography.headline";
  if (element.fontSize <= 48) return "typography.label";
  return "typography.body";
}

export function migrateLegacyPreset(
  preset: LegacyTypographyPreset,
  options?: {
    id?: string;
    title?: string;
    width?: number;
    height?: number;
    fps?: number;
    durationSeconds?: number;
    audio?: AudioConfig;
  },
): MotionProject {
  const fps = options?.fps ?? DEFAULT_FPS;
  const durationFrames = Math.round((options?.durationSeconds ?? DEFAULT_DURATION_SECONDS) * fps);

  return {
    schemaVersion: MOTION_SCHEMA_VERSION,
    id: options?.id ?? "legacy-typography-project",
    title: options?.title ?? preset.name ?? "Broll Studio Scene",
    format: {
      width: options?.width ?? 1280,
      height: options?.height ?? 720,
      fps,
      background: "@colors.ink",
    },
    tokens: {
      colors: {
        ink: "#1E293B",
        paper: "#FFFFFF",
        lime: "#10B981",
        blue: "#2563EB",
        light: "#F8FAFC",
      },
      fonts: {
        display: "display",
        displayItalic: "displayItalic",
        sans: "sans",
        classic: "classic",
        mono: "mono",
        script: "script",
        playfair: "playfair",
      },
      spacing: { page: 96, gap: 24 },
    },
    assets: {},
    scenes: [
      {
        id: "legacy-scene",
        durationFrames,
        layers: [
          {
            id: "visuals",
            zIndex: 10,
            clips: preset.elements.map((element, index) => {
              const at = Math.round(element.delay * fps);
              const enterDuration = Math.max(1, Math.round((element.duration ?? 0.73) * fps));
              return {
                id: `legacy-text-${index}`,
                kind: kindForElement(element),
                at,
                durationFrames: Math.max(1, durationFrames - at),
                enter: {
                  preset: element.anim,
                  durationFrames: enterDuration,
                  easing: "outCubic",
                },
                props: {
                  text: element.text,
                  layout: { position: [element.x, element.y] },
                  font: element.font,
                  fontStyle: element.fontStyle ?? "normal",
                  fontWeight: element.fontWeight ?? 400,
                  fontSize: element.fontSize,
                  letterSpacing: element.letterSpacing ?? 0,
                  rotation: element.rotation ?? 0,
                  opacity: element.opacity ?? 1,
                  sfx: element.sfx ?? "auto",
                  sfxFile: element.sfxFile,
                  sfxOffset: element.sfxOffset ?? 0,
                },
              };
            }),
          },
        ],
      },
    ],
  };
}
