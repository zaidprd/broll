// Shared motion utilities for registered Phase 2 components.

import { interpolate, useCurrentFrame } from "remotion";
import type { ClipAnimation } from "../../engine/MotionProject";

export function useEntrance(animation?: ClipAnimation) {
  const frame = useCurrentFrame();
  const duration = animation?.durationFrames ?? 1;
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = progress * progress * (3 - 2 * progress);

  let x = 0;
  let y = 0;
  let scale = 1;
  switch (animation?.preset) {
    case "slideUp": y = (1 - eased) * 40; break;
    case "slideLeft": x = (1 - eased) * 60; break;
    case "slideRight": x = (1 - eased) * -60; break;
    case "scaleIn": scale = 0.78 + 0.22 * eased; break;
    case "wordPop": scale = 0.72 + 0.28 * eased; break;
    case "reveal": y = (1 - eased) * 52; break;
    default: break;
  }

  return { opacity: eased, x, y, scale, progress: eased };
}

export const panelStyle = {
  background: "rgba(30, 41, 59, 0.96)",
  border: "1px solid rgba(255, 255, 255, 0.16)",
  borderRadius: 18,
  boxShadow: "0 24px 70px rgba(30, 41, 59, 0.38)",
} as const;
