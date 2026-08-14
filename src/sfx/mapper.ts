// src/sfx/mapper.ts
// ============================================================
// Map animation presets to SFX types.
// With override support per element.
// ============================================================

import type { Anim } from "../_types";
import type { SfxType } from "./synth";

export type SfxChoice = "auto" | SfxType | "silent" | "custom";

/**
 * Resolve SFX choice for an element.
 * - "auto" → use animation-based default
 * - "silent" → no SFX
 * - "custom" → handled by caller (uses sfxFile)
 * - specific type → use that SFX
 */
export function resolveSfx(
  choice: SfxChoice | undefined,
  anim: Anim,
): SfxType | null | "custom" {
  if (!choice || choice === "auto") {
    return sfxForAnim(anim);
  }
  if (choice === "silent") {
    return null;
  }
  if (choice === "custom") {
    return "custom";
  }
  return choice;
}

/**
 * Default animation → SFX mapping.
 */
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
