// src/_types.ts
// Type definitions shared between CONFIG (in Composition.tsx) and CLI generated config.

export type FontKey = "display" | "displayItalic" | "sans" | "classic" | "mono" | "script" | "playfair";

export type Anim =
  | "fade"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "wordPop"
  | "reveal";

export type ElementConfig = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  font: FontKey;
  fontStyle?: "normal" | "italic";
  fontWeight?: number;
  letterSpacing?: number;
  delay: number;
  anim: Anim;
  duration?: number;
  opacity?: number;
  rotation?: number;
  // SFX control: "auto" uses default mapper, specific type overrides, "silent" = no SFX, "custom" = use sfxFile
  sfx?: "auto" | "whoosh" | "impact" | "tick" | "riser" | "click" | "silent" | "custom";
  sfxFile?: string; // Path to custom file (relative to public/sfx-custom/) — used when sfx="custom"
  sfxOffset?: number; // Timeline offset in seconds relative to this element's delay (can be negative)
};

export type AudioConfig = {
  sfxEnabled: boolean;
  padEnabled: boolean;
  sfxVolume: number;
  padVolume: number;
};

export type GeneratedConfig = {
  elements: ElementConfig[];
  audio: AudioConfig;
};
