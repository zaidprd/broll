import React from "react";
import { useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

const ICONS: Record<string, string> = {
  sparkles: "✦", brain: "◉", message: "◌", settings: "⚙", database: "▣",
  filter: "▽", bell: "◉", check: "✓", warning: "!", bot: "◇", chart: "↗",
  cursor: "↖", terminal: ">_", image: "▧", mic: "◉", search: "⌕",
};

export const Icon: React.FC<{
  position: [number, number];
  name: string;
  size?: number;
  color?: string;
  enter?: ClipAnimation;
}> = ({ position, name, size = 80, color = "#10B981", enter }) => {
  const motion = useEntrance(enter);
  return <div style={{ position: "absolute", left: position[0], top: position[1], color, fontFamily: "JetBrains Mono", fontSize: size, fontWeight: 800, lineHeight: 1, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>{ICONS[name] ?? "✦"}</div>;
};
