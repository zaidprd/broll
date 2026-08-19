// Shared Node-side compatibility adapter.
// Converts the current typography preset JSON into canonical MotionProject V1.

const FPS = 30;
const DURATION_SECONDS = 6;

const kindForElement = (element) => {
  if (element.fontSize >= 110) return "typography.headline";
  if (element.fontSize <= 48) return "typography.label";
  return "typography.body";
};

export function legacyPresetToMotionProject(preset, options = {}) {
  const fps = options.fps ?? FPS;
  const durationFrames = Math.round((options.durationSeconds ?? DURATION_SECONDS) * fps);

  return {
    schemaVersion: "1.0",
    id: options.id ?? "legacy-typography-project",
    title: options.title ?? preset.name ?? "Broll Studio Scene",
    format: {
      width: options.width ?? 1280,
      height: options.height ?? 720,
      fps,
      background: "#0A0A0A",
    },
    tokens: {
      colors: {
        ink: "#0A0A0A",
        paper: "#F3F0E8",
        lime: "#A3E635",
        yellow: "#FFD600",
        blue: "#3B82F6",
        orange: "#F97316",
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
              const at = Math.round((element.delay ?? 0) * fps);
              return {
                id: `legacy-text-${index}`,
                kind: kindForElement(element),
                at,
                durationFrames: Math.max(1, durationFrames - at),
                enter: {
                  preset: element.anim ?? "fade",
                  durationFrames: Math.max(1, Math.round((element.duration ?? 0.73) * fps)),
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
