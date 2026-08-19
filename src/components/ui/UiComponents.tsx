import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { panelStyle, useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";

const CREAM = "#F3F0E8";
const LIME = "#A3E635";

type Layout = { position: [number, number]; width?: number; height?: number };

type Base = { layout: Layout; enter?: ClipAnimation };

export const BrowserWindow: React.FC<Base & {
  title: string;
  subtitle?: string;
  sections?: Array<{ label: string; value: string; active?: boolean }>;
}> = ({ layout, enter, title, subtitle, sections = [] }) => {
  const motion = useEntrance(enter);
  return (
    <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 900, height: layout.height ?? 510, overflow: "hidden", ...panelStyle, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
      <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "1px solid rgba(243,240,232,.11)", background: "#141414" }}>
        {["#FF6B6B", "#FFD166", "#A3E635"].map((color) => <span key={color} style={{ width: 10, height: 10, borderRadius: 99, background: color }} />)}
        <span style={{ color: "#A6A6A6", fontFamily: "JetBrains Mono", fontSize: 15, marginLeft: 10 }}>{subtitle ?? "app.local / settings"}</span>
      </div>
      <div style={{ padding: 42, color: CREAM, fontFamily: "Inter" }}>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 42, letterSpacing: -1.6 }}>{title}</div>
        <div style={{ display: "grid", gap: 14, marginTop: 34 }}>
          {sections.map((section) => (
            <div key={section.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", borderRadius: 12, background: section.active ? "rgba(163,230,53,.12)" : "rgba(255,255,255,.055)", border: `1px solid ${section.active ? "rgba(163,230,53,.48)" : "rgba(255,255,255,.08)"}` }}>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{section.label}</span>
              <span style={{ color: section.active ? LIME : "#BFBFBF", fontSize: 18 }}>{section.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const NotificationCard: React.FC<Base & { title: string; body?: string; tone?: "success" | "warning" | "info" }> = ({ layout, enter, title, body, tone = "success" }) => {
  const motion = useEntrance(enter);
  const color = tone === "warning" ? "#F97316" : tone === "info" ? "#3B82F6" : LIME;
  return <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 420, padding: 22, ...panelStyle, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`, borderLeft: `4px solid ${color}`, color: CREAM, fontFamily: "Inter" }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}><span style={{ color, fontSize: 24 }}>●</span><strong style={{ fontSize: 20 }}>{title}</strong></div>
    {body && <div style={{ marginTop: 10, color: "#B8B8B8", fontSize: 16, lineHeight: 1.45 }}>{body}</div>}
  </div>;
};

export const AppGrid: React.FC<Base & { title?: string; items: Array<{ icon?: string; label: string; accent?: boolean }> }> = ({ layout, enter, title, items }) => {
  const motion = useEntrance(enter);
  return <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 920, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`, color: CREAM }}>
    {title && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 46, fontWeight: 800, marginBottom: 24 }}>{title}</div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {items.map((item, index) => <div key={`${item.label}-${index}`} style={{ ...panelStyle, padding: 24, minHeight: 150, borderColor: item.accent ? "rgba(163,230,53,.6)" : "rgba(243,240,232,.14)" }}>
        <div style={{ color: item.accent ? LIME : "#9C9C9C", fontFamily: "JetBrains Mono", fontSize: 22 }}>{item.icon ?? "✦"}</div>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 23, marginTop: 28 }}>{item.label}</div>
      </div>)}
    </div>
  </div>;
};

export const Checklist: React.FC<Base & { title?: string; items: string[] }> = ({ layout, enter, title, items }) => {
  const motion = useEntrance(enter);
  return <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 620, color: CREAM, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>
    {title && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 42, fontWeight: 800, marginBottom: 24 }}>{title}</div>}
    {items.map((item, index) => <div key={item} style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 16, fontFamily: "Inter", fontSize: 26 }}><span style={{ color: LIME }}>✓</span>{item}</div>)}
  </div>;
};

export const ProgressBar: React.FC<Base & { label: string; value: number; accent?: string }> = ({ layout, enter, label, value, accent = LIME }) => {
  const frame = useCurrentFrame();
  const motion = useEntrance(enter);
  const fill = interpolate(frame, [0, enter?.durationFrames ?? 20], [0, value], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 640, color: CREAM, fontFamily: "Inter", opacity: motion.opacity }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span>{label}</span><strong>{Math.round(fill)}%</strong></div>
    <div style={{ height: 18, borderRadius: 99, background: "rgba(255,255,255,.12)", overflow: "hidden" }}><div style={{ width: `${fill}%`, height: "100%", background: accent, borderRadius: 99 }} /></div>
  </div>;
};

export const TerminalTyping: React.FC<Base & { lines: string[] }> = ({ layout, enter, lines }) => {
  const frame = useCurrentFrame();
  const motion = useEntrance(enter);
  const characters = Math.floor(interpolate(frame, [0, enter?.durationFrames ?? 60], [0, lines.join("\n").length], { extrapolateRight: "clamp" }));
  const text = lines.join("\n").slice(0, characters);
  return <pre style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 720, minHeight: layout.height ?? 300, margin: 0, padding: 30, ...panelStyle, color: CREAM, fontFamily: "JetBrains Mono", fontSize: 20, lineHeight: 1.65, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` }}>{text}<span style={{ color: LIME }}>▍</span></pre>;
};

export const CursorClick: React.FC<{ position: [number, number]; enter?: ClipAnimation; click?: boolean }> = ({ position, enter, click = true }) => {
  const frame = useCurrentFrame();
  const motion = useEntrance(enter);
  const pulse = click ? 1 + Math.max(0, Math.sin(frame * 0.38)) * 0.22 : 1;
  return <div style={{ position: "absolute", left: position[0], top: position[1], width: 34, height: 44, color: CREAM, fontSize: 42, lineHeight: 1, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale * pulse})`, textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>↖</div>;
};
