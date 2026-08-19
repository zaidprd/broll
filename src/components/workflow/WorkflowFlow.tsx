import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { panelStyle, useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

const CREAM = "#F3F0E8";
const LIME = "#A3E635";

type Node = { id: string; label: string; icon?: string; tone?: string };

export const WorkflowFlow: React.FC<{
  position: [number, number];
  width?: number;
  title?: string;
  nodes: Node[];
  enter?: ClipAnimation;
}> = ({ position, width = 1040, title, nodes, enter }) => {
  const frame = useCurrentFrame();
  const motion = useEntrance(enter);
  const nodeWidth = Math.min(250, (width - (nodes.length - 1) * 70) / nodes.length);
  return <div style={{ position: "absolute", left: position[0], top: position[1], width, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    {title && <div style={{ color: CREAM, fontFamily: "Plus Jakarta Sans", fontSize: 40, fontWeight: 800, marginBottom: 32 }}>{title}</div>}
    <div style={{ display: "flex", alignItems: "center" }}>
      {nodes.map((node, index) => {
        const reveal = interpolate(frame, [index * 12, index * 12 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const color = node.tone ?? (index === nodes.length - 1 ? LIME : "#F3F0E8");
        return <React.Fragment key={node.id}>
          <div style={{ width: nodeWidth, minHeight: 150, padding: 24, ...panelStyle, opacity: reveal, transform: `scale(${0.88 + reveal * 0.12})`, borderColor: `${color}77`, color: CREAM }}>
            <div style={{ color, fontFamily: "JetBrains Mono", fontSize: 22 }}>{node.icon ?? "◆"}</div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 23, marginTop: 28 }}>{node.label}</div>
          </div>
          {index < nodes.length - 1 && <div style={{ width: 70, height: 2, background: `linear-gradient(90deg, ${LIME} ${Math.max(0, Math.min(100, (frame - index * 12 - 9) * 7))}%, rgba(163,230,53,.18) 0)`, position: "relative" }}><span style={{ position: "absolute", right: -1, top: -8, color: LIME }}>›</span></div>}
        </React.Fragment>;
      })}
    </div>
  </div>;
};
