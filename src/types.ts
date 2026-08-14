// src/types.ts
// JSON schema types untuk B-roll scenes
// Backward-compatible: BrollSpec lama (text+highlight) masih bisa dirender.

export type SceneType = "kinetic" | "counter" | "quote";

export type QuoteStyle = "shake" | "pop" | "glitch" | "bold";

export type FontStyle = "display" | "classic" | "mono" | "sans";

export type AnimationPreset =
  | "fade"
  | "slideUp"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "reveal"
  | "wordPop";

export type TextColor = "primary" | "text" | "yellow" | "blue" | "orange";

// === Typography Element (Editorial Kinetic) ===
// Setiap element berdiri sendiri sebagai unit typography.
// Ini adalah "atom" dari layout — sebuah kata/frasa memiliki posisi,
// ukuran, font, animasi independen.

export interface TypographyElement {
  text: string;
  font_style?: FontStyle;
  fontSize?: number; // px (canvas 1280x720)
  fontWeight?: number; // 400, 700, 800, 900
  italic?: boolean;
  color?: TextColor;
  x?: number; // absolute pixel, default auto-layout
  y?: number; // absolute pixel, default auto-layout
  rotation?: number; // degrees, range -4 .. +4
  scale?: number; // multiplier, default 1
  opacity?: number; // 0..1, default 1
  start?: number; // seconds from scene start, default 0
  duration?: number; // seconds this element stays, default = scene duration - start
  animation?: AnimationPreset;
  emphasis?: boolean; // flag untuk highlight (e.g. text-shadow subtle)
}

// === Kinetic Scene ===
// Backward-compat: jika 'elements' tidak ada, fallback ke legacy mode
// (text + highlight + animation per-word).

export interface KineticScene {
  type: "kinetic";
  duration: number;
  // === Legacy fields (optional, used when elements is absent) ===
  text?: string;
  highlight?: string;
  font_style?: FontStyle;
  italic?: boolean;
  // === Editorial mode ===
  elements?: TypographyElement[];
}

export interface CounterScene {
  type: "counter";
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  duration: number;
  font_style?: FontStyle;
  italic?: boolean;
}

export interface QuoteScene {
  type: "quote";
  text: string;
  style: QuoteStyle;
  duration: number;
  font_style?: FontStyle;
  italic?: boolean;
}

export type Scene = KineticScene | CounterScene | QuoteScene;

export interface BrollSpec {
  title: string;
  duration: number;
  color_theme: "lime";
  scenes: Scene[];
}
