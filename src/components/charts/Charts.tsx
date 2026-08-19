import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

const CREAM = "#F3F0E8";
const LIME = "#A3E635";

type Base = { position: [number, number]; enter?: ClipAnimation };

export const BigNumber: React.FC<Base & { value: string; label?: string; accent?: string }> = ({ position, enter, value, label, accent = LIME }) => {
  const motion = useEntrance(enter);
  return <div style={{ position: "absolute", left: position[0], top: position[1], color: CREAM, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    <div style={{ color: accent, fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 190, lineHeight: .85, letterSpacing: -9 }}>{value}</div>
    {label && <div style={{ marginTop: 20, fontFamily: "JetBrains Mono", color: CREAM, fontSize: 22, letterSpacing: 2 }}>{label}</div>}
  </div>;
};

export const Comparison: React.FC<Base & { left: { label: string; value: string }; right: { label: string; value: string }; width?: number }> = ({ position, enter, left, right, width = 1000 }) => {
  const motion = useEntrance(enter);
  return <div style={{ position: "absolute", left: position[0], top: position[1], width, display: "grid", gridTemplateColumns: "1fr 90px 1fr", alignItems: "center", opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    <div style={{ color: "#A8A8A8", textAlign: "right" }}><div style={{ fontFamily: "JetBrains Mono", fontSize: 18 }}>{left.label}</div><div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 58, marginTop: 10 }}>{left.value}</div></div>
    <div style={{ color: LIME, fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 46, textAlign: "center" }}>vs</div>
    <div style={{ color: CREAM }}><div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: LIME }}>{right.label}</div><div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 58, marginTop: 10 }}>{right.value}</div></div>
  </div>;
};

export const BarChart: React.FC<Base & { title?: string; items: Array<{ label: string; value: number; accent?: boolean }>; width?: number; height?: number }> = ({ position, enter, title, items, width = 760, height = 360 }) => {
  const frame = useCurrentFrame();
  const motion = useEntrance(enter);
  const max = Math.max(...items.map((item) => item.value), 1);
  return <div style={{ position: "absolute", left: position[0], top: position[1], width, color: CREAM, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    {title && <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 32, marginBottom: 22 }}>{title}</div>}
    <div style={{ display: "flex", alignItems: "end", gap: 30, height }}>
      {items.map((item, index) => {
        const ratio = interpolate(frame, [index * 8, index * 8 + 24], [0, item.value / max], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={item.label} style={{ flex: 1, height: "100%", display: "flex", alignItems: "end", flexDirection: "column", justifyContent: "end" }}>
          <strong style={{ marginBottom: 10, fontSize: 22 }}>{item.value}</strong>
          <div style={{ width: "100%", height: `${ratio * 100}%`, minHeight: ratio > 0 ? 4 : 0, borderRadius: "10px 10px 0 0", background: item.accent ? LIME : "#565656" }} />
          <span style={{ marginTop: 12, color: "#A8A8A8", fontFamily: "JetBrains Mono", fontSize: 15 }}>{item.label}</span>
        </div>;
      })}
    </div>
  </div>;
};

export const Counter: React.FC<Base & { from?: number; to: number; prefix?: string; suffix?: string; label?: string }> = ({ position, enter, from = 0, to, prefix = "", suffix = "", label }) => {
  const frame = useCurrentFrame();
  const duration = enter?.durationFrames ?? 30;
  const value = Math.round(interpolate(frame, [0, duration], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <BigNumber position={position} enter={enter} value={`${prefix}${value}${suffix}`} label={label} />;
};
