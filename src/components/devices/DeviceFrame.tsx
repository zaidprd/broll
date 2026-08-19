import React from "react";
import { panelStyle, useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

export const DeviceFrame: React.FC<{
  position: [number, number];
  width?: number;
  height?: number;
  title?: string;
  enter?: ClipAnimation;
  frame?: "phone" | "browser";
}> = ({ position, width = 360, height = 650, title = "Mobile App", enter, frame = "phone" }) => {
  const motion = useEntrance(enter);
  const phone = frame === "phone";
  return <div style={{ position: "absolute", left: position[0], top: position[1], width, height, padding: phone ? 12 : 18, borderRadius: phone ? 48 : 22, background: "#050505", border: "2px solid rgba(243,240,232,.35)", boxShadow: "0 28px 70px rgba(0,0,0,.55)", opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    {phone && <div style={{ position: "absolute", top: 16, left: "50%", width: 110, height: 25, borderRadius: 99, transform: "translateX(-50%)", background: "#050505", zIndex: 2 }} />}
    <div style={{ ...panelStyle, width: "100%", height: "100%", overflow: "hidden", borderRadius: phone ? 36 : 14, background: "linear-gradient(145deg,#222,#111)", color: "#F3F0E8" }}>
      <div style={{ padding: phone ? "62px 24px 24px" : "30px", fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: phone ? 26 : 32 }}>{title}</div>
      <div style={{ margin: phone ? 24 : 30, height: 14, borderRadius: 99, background: "rgba(163,230,53,.82)" }} />
      <div style={{ margin: phone ? 24 : 30, padding: 18, borderRadius: 14, background: "rgba(255,255,255,.07)", fontFamily: "Inter", color: "#B8B8B8" }}>Visual content or app capture goes here.</div>
    </div>
  </div>;
};
