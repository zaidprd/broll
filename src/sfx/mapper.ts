// src/sfx/mapper.ts
// ============================================================
// Map animation presets to SFX types.
// Returns null for animations that should be silent.
// ============================================================

import type { Anim } from "../_types";
import type { SfxType } from "./synth";

export function sfxForAnim(anim: Anim): SfxType | null {
  switch (anim) {
    case "reveal":
      return "impact"; // hero reveal → big impact
    case "scaleIn":
      return "whoosh"; // scale in → whoosh
    case "wordPop":
      return "tick"; // pop → small tick
    case "slideUp":
      return "whoosh"; // slide → whoosh
    case "slideLeft":
      return "whoosh"; // slide → whoosh
    case "slideRight":
      return "whoosh";
    case "fade":
      return null; // fade silent
    default:
      return null;
  }
}
