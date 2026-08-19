import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

export const Spotlight: React.FC<{
  rect: [number, number, number, number];
  enter?: ClipAnimation;
  dimOpacity?: number;
}> = ({ rect, enter, dimOpacity = 0.65 }) => {
  const motion = useEntrance(enter);
  const [x, y, width, height] = rect;
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: motion.opacity, background: `radial-gradient(ellipse ${width / 2}px ${height / 2}px at ${x + width / 2}px ${y + height / 2}px, transparent 0%, transparent 62%, rgba(0,0,0,${dimOpacity}) 100%)` }}>
    <div style={{ position: "absolute", left: x - 8, top: y - 8, width: width + 16, height: height + 16, border: "2px solid #A3E635", borderRadius: 14, boxShadow: "0 0 34px rgba(163,230,53,.28)" }} />
  </AbsoluteFill>;
};

export const ZoomFocus: React.FC<{ rect: [number, number, number, number]; enter?: ClipAnimation }> = ({ rect, enter }) => {
  const frame = useCurrentFrame();
  const duration = enter?.durationFrames ?? 20;
  const amount = interpolate(frame, [0, duration], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [x, y, width, height] = rect;
  return <div style={{ position: "absolute", left: x, top: y, width, height, pointerEvents: "none", border: "2px solid rgba(243,240,232,.75)", borderRadius: 12, transform: `scale(${amount})`, boxShadow: "0 0 0 9999px rgba(0,0,0,.18)", opacity: amount }} />;
};
