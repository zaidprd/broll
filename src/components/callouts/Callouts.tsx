import React from "react";
import { useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

const CREAM = "#F3F0E8";
const LIME = "#A3E635";

export const Callout: React.FC<{
  position: [number, number];
  text: string;
  side?: "left" | "right" | "top" | "bottom";
  enter?: ClipAnimation;
  tone?: string;
}> = ({ position, text, side = "right", enter, tone = LIME }) => {
  const motion = useEntrance(enter);
  const arrow = side === "left" ? "←" : side === "top" ? "↑" : side === "bottom" ? "↓" : "→";
  return <div style={{ position: "absolute", left: position[0], top: position[1], display: "flex", alignItems: "center", gap: 12, color: CREAM, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    <span style={{ color: tone, fontSize: 30 }}>{arrow}</span>
    <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(17,17,17,.95)", border: `1px solid ${tone}88`, fontFamily: "Inter", fontSize: 19, maxWidth: 320 }}>{text}</div>
  </div>;
};
