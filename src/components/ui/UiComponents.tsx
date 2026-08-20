import React from "react";
import { Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { panelStyle, useEntrance } from "../shared/motion";
import type { ClipAnimation } from "../../engine/MotionProject";
import { getSfxUrl } from "../../sfx/synth";
import { theme } from "../../theme";

const CREAM = theme.text;
const LIME = theme.primary;
const STATUS = theme.accent.blue;

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
      <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,.11)", background: theme.bg }}>
        {[theme.accent.blue, theme.primary, theme.text].map((color) => <span key={color} style={{ width: 10, height: 10, borderRadius: 99, background: color }} />)}
        <span style={{ color: theme.surface, fontFamily: "JetBrains Mono", fontSize: 15, marginLeft: 10 }}>{subtitle ?? "app.local / settings"}</span>
      </div>
      <div style={{ padding: 42, color: CREAM, fontFamily: "Inter" }}>
        <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 42, letterSpacing: -1.6 }}>{title}</div>
        <div style={{ display: "grid", gap: 14, marginTop: 34 }}>
          {sections.map((section) => (
            <div key={section.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", borderRadius: 12, background: section.active ? "rgba(16,185,129,.12)" : "rgba(248,250,252,.055)", border: `1px solid ${section.active ? "rgba(16,185,129,.48)" : "rgba(255,255,255,.08)"}` }}>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{section.label}</span>
              <span style={{ color: section.active ? LIME : theme.surface, fontSize: 18 }}>{section.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const NotificationCard: React.FC<Base & { title: string; body?: string; tone?: "success" | "warning" | "info" }> = ({ layout, enter, title, body, tone = "success" }) => {
  const motion = useEntrance(enter);
  const color = tone === "success" ? LIME : theme.accent.blue;
  return <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 420, padding: 22, ...panelStyle, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`, borderLeft: `4px solid ${color}`, color: CREAM, fontFamily: "Inter" }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}><span style={{ color, fontSize: 24 }}>●</span><strong style={{ fontSize: 20 }}>{title}</strong></div>
    {body && <div style={{ marginTop: 10, color: theme.surface, fontSize: 16, lineHeight: 1.45 }}>{body}</div>}
  </div>;
};

export const AppGrid: React.FC<Base & { title?: string; items: Array<{ icon?: string; label: string; accent?: boolean }> }> = ({ layout, enter, title, items }) => {
  const motion = useEntrance(enter);
  return <div style={{ position: "absolute", left: layout.position[0], top: layout.position[1], width: layout.width ?? 920, opacity: motion.opacity, transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`, color: CREAM }}>
    {title && <div style={{ fontFamily: "Plus Jakarta Sans", fontSize: 46, fontWeight: 800, marginBottom: 24 }}>{title}</div>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {items.map((item, index) => <div key={`${item.label}-${index}`} style={{ ...panelStyle, padding: 24, minHeight: 150, borderColor: item.accent ? "rgba(16,185,129,.6)" : "rgba(255,255,255,.14)" }}>
        <div style={{ color: item.accent ? LIME : theme.surface, fontFamily: "JetBrains Mono", fontSize: 22 }}>{item.icon ?? "✦"}</div>
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

export const OfferDashboard: React.FC<{
  greeting?: string;
  offerTitle?: string;
  offerBody?: string;
  buttonLabel?: string;
  accent?: string;
  cardPosition?: [number, number];
  audioEnabled?: boolean;
}> = ({
  greeting = "Ready to dive in?",
  offerTitle = "FREE OFFER",
  offerBody = "Claim your complimentary access before it expires.",
  buttonLabel = "Claim now",
  accent = LIME,
  cardPosition = [555, 655],
  audioEnabled = true,
}) => {
  const frame = useCurrentFrame();
  const dashboardScale = interpolate(frame, [0, 18, 55, 94], [0.965, 1, 1, 1.035], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });
  const dashboardOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(frame, [24, 42], [48, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardOpacity = interpolate(frame, [24, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorX = interpolate(frame, [48, 78], [1560, cardPosition[0] + 690], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorY = interpolate(frame, [48, 78], [790, cardPosition[1] + 68], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const click = interpolate(frame, [78, 82, 88], [1, 0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(frame, [78, 85, 104], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <>
    {audioEnabled && <>
      <Sequence from={25} durationInFrames={28}><Audio src={getSfxUrl("whoosh")} volume={0.28} /></Sequence>
      <Sequence from={78} durationInFrames={24}><Audio src={getSfxUrl("click")} volume={0.55} /></Sequence>
      <Sequence from={83} durationInFrames={30}><Audio src={getSfxUrl("impact")} volume={0.18} /></Sequence>
    </>}
    <div style={{position: "absolute", inset: 0, overflow: "hidden", background: theme.bg, opacity: dashboardOpacity}}>
      <div style={{position: "absolute", inset: -22, scale: dashboardScale, transformOrigin: "50% 65%"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 72, height: "100%", borderRight: `1px solid ${theme.accent.blue}`, background: theme.bg}}>
          {["◫", "✎", "⌕", "◌"].map((icon, index) => <div key={icon} style={{color: index === 1 ? theme.text : theme.surface, font: "24px Inter", margin: index === 0 ? "35px 0 0 24px" : "28px 0 0 24px"}}>{icon}</div>)}
          <div style={{position: "absolute", bottom: 28, left: 19, width: 38, height: 38, borderRadius: 99, background: theme.accent.blue, color: theme.text, display: "flex", alignItems: "center", justifyContent: "center", font: "700 12px Inter"}}>ZA</div>
        </div>

        <div style={{position: "absolute", left: 850, top: 28, width: 220, height: 45, borderRadius: 24, background: theme.accent.blue, display: "flex", color: theme.text, font: "600 15px Inter"}}>
          <span style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 22, background: theme.bg}}>Chat</span>
          <span style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>Work</span>
        </div>

        <div style={{position: "absolute", left: 0, top: 292, width: "100%", textAlign: "center", color: theme.text, font: "500 30px Inter"}}>{greeting}</div>
        <div style={{position: "absolute", left: 550, top: 356, width: 820, height: 66, borderRadius: 34, background: theme.bg, border: `1px solid ${theme.accent.blue}`, display: "flex", alignItems: "center", color: theme.surface, font: "18px Inter"}}>
          <span style={{fontSize: 31, color: theme.text, marginLeft: 24}}>＋</span><span style={{marginLeft: 18}}>Ask anything</span>
          <span style={{marginLeft: "auto", marginRight: 24, color: theme.surface}}>Instant⌄　◉</span>
        </div>
        <div style={{position: "absolute", left: 588, top: 462, color: theme.surface, font: "16px Inter", lineHeight: 3.15}}>
          <div>▣　Create a campaign brief</div><div>▣　Summarize a document</div><div>◉　Build a weekly workflow</div>
        </div>

        <div style={{position: "absolute", left: cardPosition[0], top: cardPosition[1], width: 810, height: 126, borderRadius: 24, background: theme.bg, border: `1px solid rgba(255,255,255,${0.12 + glow * 0.28})`, boxShadow: `0 18px 60px rgba(30,41,59,.48), 0 0 ${glow * 46}px ${accent}`, opacity: cardOpacity, translate: `0px ${cardY}px`, scale: click}}>
          <div style={{position: "absolute", left: 24, top: 24, width: 78, height: 78, borderRadius: 20, background: `${accent}22`, border: `1px solid ${accent}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42}}>🎁</div>
          <div style={{position: "absolute", left: 126, top: 26, color: theme.text, font: "800 24px Plus Jakarta Sans", letterSpacing: -.5}}>{offerTitle}</div>
          <div style={{position: "absolute", left: 126, top: 62, width: 450, color: theme.surface, font: "16px Inter", lineHeight: 1.4}}>{offerBody}</div>
          <div style={{position: "absolute", right: 30, top: 39, minWidth: 142, height: 50, borderRadius: 27, background: glow > .1 ? accent : theme.surface, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", font: "700 16px Inter", padding: "0 18px"}}>{buttonLabel}</div>
        </div>
      </div>

      <div style={{position: "absolute", left: cursorX, top: cursorY, color: "#FFF", fontSize: 50, lineHeight: 1, filter: "drop-shadow(0 4px 5px rgba(0,0,0,.75))", scale: click}}>↖</div>
      <div style={{position: "absolute", left: cursorX - 18, top: cursorY - 18, width: 70, height: 70, borderRadius: 99, border: `3px solid ${accent}`, scale: interpolate(frame, [78, 96], [.25, 1.7], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), opacity: (1 - glow) * glow}} />
    </div>
  </>;
};

export const PaymentCollision: React.FC<{
  gopayAsset?: string;
  bcaAsset?: string;
  background?: string;
  audioEnabled?: boolean;
}> = ({
  gopayAsset = "uploads/gopay.jfif",
  bcaAsset = "uploads/bca.jfif",
  background = theme.bg,
  audioEnabled = true,
}) => {
  const frame = useCurrentFrame();

  const entrance = (start: number) => interpolate(frame, [start, start + 13], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.spring({damping: 170}), output: "perceptual-scale",
  });
  const gopayX = interpolate(frame, [0, 72, 94, 102, 130], [390, 390, 730, 640, -330], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: [Easing.linear, Easing.bezier(.3, .8, .2, 1), Easing.linear, Easing.bezier(.2, .8, .2, 1)],
  });
  const bcaX = interpolate(frame, [0, 72, 94, 102, 130], [1310, 1310, 960, 1050, 2080], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: [Easing.linear, Easing.bezier(.3, .8, .2, 1), Easing.linear, Easing.bezier(.2, .8, .2, 1)],
  });
  const collisionJolt = interpolate(frame, [91, 94, 99, 104], [0, -12, 9, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [116, 133], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const firstFail = interpolate(frame, [23, 29, 37, 43], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const secondFail = interpolate(frame, [50, 56, 66, 72], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const squashX = interpolate(frame, [90, 94, 98, 104], [1, .82, 1.06, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const squashY = interpolate(frame, [90, 94, 98, 104], [1, 1.12, .96, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  const logoCard = (src: string, x: number, logoScale: number, logoRotate: number, failOpacity: number) => (
    <div style={{position: "absolute", left: x, top: 290 + collisionJolt, width: 230, height: 176, padding: 25, borderRadius: 38, background: "#FFF", border: `3px solid ${failOpacity > .05 ? STATUS : "transparent"}`, boxShadow: `0 28px 80px rgba(0,0,0,.48), 0 0 ${12 + failOpacity * 34}px ${STATUS}`, transform: `scale(${logoScale * squashX}, ${logoScale * squashY}) rotate(${logoRotate}deg)`, transformOrigin: "50% 50%", opacity: fadeOut}}>
      <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "contain"}} />
      <div style={{position: "absolute", left: "50%", top: "50%", width: 96, height: 96, marginLeft: -48, marginTop: -48, borderRadius: 99, background: STATUS, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", font: "800 68px Arial", boxShadow: `0 12px 36px ${STATUS}`, opacity: failOpacity, transform: `scale(${.55 + failOpacity * .45})`}}>×</div>
    </div>
  );

  return <>
    {audioEnabled && <>
      <Sequence from={3} durationInFrames={28}><Audio src={getSfxUrl("whoosh")} volume={0.35} /></Sequence>
      <Sequence from={26} durationInFrames={24}><Audio src={getSfxUrl("impact")} volume={0.5} /></Sequence>
      <Sequence from={37} durationInFrames={28}><Audio src={getSfxUrl("whoosh")} volume={0.35} /></Sequence>
      <Sequence from={54} durationInFrames={24}><Audio src={getSfxUrl("impact")} volume={0.5} /></Sequence>
      <Sequence from={76} durationInFrames={34}><Audio src={getSfxUrl("riser")} volume={0.3} /></Sequence>
      <Sequence from={94} durationInFrames={28}><Audio src={getSfxUrl("impact")} volume={0.75} /></Sequence>
      <Sequence from={98} durationInFrames={28}><Audio src={getSfxUrl("whoosh")} volume={0.44} /></Sequence>
    </>}
    <div style={{position: "absolute", inset: 0, overflow: "hidden", background}}>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 48%, rgba(255,255,255,.07), transparent 44%)"}} />
      {logoCard(gopayAsset, gopayX, entrance(2), interpolate(frame, [94, 130], [-3, -28], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), firstFail)}
      {logoCard(bcaAsset, bcaX, entrance(36), interpolate(frame, [94, 130], [3, 28], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), secondFail)}
    </div>
  </>;
};

export const PricingDashboard: React.FC<{
  goPrice?: string;
  plusPrice?: string;
  businessPrice?: string;
  audioEnabled?: boolean;
}> = ({goPrice = "Rp75.000", plusPrice = "Rp349.000", businessPrice = "$25", audioEnabled = true}) => {
  const frame = useCurrentFrame();
  const pageOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const pageScale = interpolate(frame, [0, 18, 102, 124], [.96, 1, 1, 1.055], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1), output: "perceptual-scale",
  });
  const cursorX = interpolate(frame, [75, 103], [1570, 515], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)});
  const cursorY = interpolate(frame, [75, 103], [760, 611], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)});
  const clickScale = interpolate(frame, [103, 107, 113], [1, .93, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const clickGlow = interpolate(frame, [102, 111, 128], [0, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  const plans = [
    {name: "ChatGPT Go", tagline: "Keep chatting", price: goPrice, suffix: "/ month", button: "Upgrade to Go", accent: LIME, features: ["Expanded access to chat", "More image creation", "Expanded voice mode"]},
    {name: "ChatGPT Plus", tagline: "Your AI assistant", price: plusPrice, suffix: "/ month", button: "Upgrade to Plus", accent: theme.bg, recommended: true, features: ["Advanced intelligence", "Higher quality images", "Projects and Codex"]},
    {name: "ChatGPT Business", tagline: "Work securely as a team", price: businessPrice, suffix: "/ user / month", button: "Get Business", accent: theme.bg, features: ["Secure team workspace", "Admin controls", "Company knowledge"]},
  ];

  return <>
    {audioEnabled && <>
      <Sequence from={4} durationInFrames={30}><Audio src={getSfxUrl("whoosh")} volume={.24} /></Sequence>
      <Sequence from={18} durationInFrames={32}><Audio src={getSfxUrl("whoosh")} volume={.18} /></Sequence>
      <Sequence from={102} durationInFrames={24}><Audio src={getSfxUrl("click")} volume={.62} /></Sequence>
      <Sequence from={108} durationInFrames={26}><Audio src={getSfxUrl("impact")} volume={.18} /></Sequence>
    </>}
    <div style={{position: "absolute", inset: 0, overflow: "hidden", background: theme.surface, opacity: pageOpacity}}>
      <div style={{position: "absolute", inset: -28, scale: pageScale, transformOrigin: "505px 610px"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: 74, background: theme.text, borderBottom: `1px solid ${theme.accent.blue}`, display: "flex", alignItems: "center", color: theme.bg, font: "16px Inter"}}>
          <span style={{marginLeft: 36, fontSize: 26}}>◉</span><b style={{marginLeft: 12}}>ChatGPT Plans</b><span style={{marginLeft: "auto", marginRight: 38, color: "#777"}}>Personal　　Business</span>
        </div>
        <div style={{position: "absolute", top: 108, width: "100%", textAlign: "center", color: theme.bg}}>
          <div style={{font: "500 36px Plus Jakarta Sans", letterSpacing: -1.2}}>Upgrade your plan</div>
          <div style={{font: "16px Inter", color: "#6D6D6D", marginTop: 12}}>Choose the plan that fits your needs</div>
        </div>
        <div style={{position: "absolute", left: 270, top: 215, display: "flex", gap: 42}}>
          {plans.map((plan, index) => {
            const local = interpolate(frame, [12 + index * 7, 31 + index * 7], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)});
            const isGo = index === 0;
            return <div key={plan.name} style={{position: "relative", width: 410, height: 535, padding: 30, borderRadius: 25, background: theme.text, border: `2px solid ${isGo ? LIME : theme.accent.blue}`, boxShadow: isGo ? `0 22px 65px rgba(30,41,59,.09), 0 0 ${clickGlow * 45}px ${LIME}` : "0 18px 50px rgba(30,41,59,.07)", opacity: local, transform: `translateY(${(1 - local) * 45}px)`, fontFamily: "Inter", color: theme.bg}}>
              {plan.recommended && <div style={{position: "absolute", right: 24, top: 24, borderRadius: 20, background: theme.surface, color: theme.accent.blue, padding: "7px 13px", fontSize: 12, fontWeight: 700}}>RECOMMENDED</div>}
              <div style={{fontSize: 20, fontWeight: 750}}>{plan.name}</div>
              <div style={{font: "600 31px Plus Jakarta Sans", letterSpacing: -1.2, marginTop: 34}}>{plan.tagline}</div>
              <div style={{display: "flex", alignItems: "baseline", gap: 8, marginTop: 48}}><span style={{fontSize: 18}}>{plan.price.startsWith("Rp") ? "" : ""}</span><strong style={{font: "500 43px Plus Jakarta Sans", letterSpacing: -1.5}}>{plan.price}</strong><span style={{fontSize: 15, color: "#666"}}>{plan.suffix}</span></div>
              <div style={{height: 54, marginTop: 28, borderRadius: 28, background: plan.accent, color: isGo ? "#111" : "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 750, transform: isGo ? `scale(${clickScale})` : undefined}}>{plan.button}</div>
              <div style={{marginTop: 38, fontSize: 15, fontWeight: 700}}>Includes:</div>
              <div style={{marginTop: 16, display: "grid", gap: 17, color: "#333", fontSize: 15}}>{plan.features.map((feature) => <div key={feature}>✓　{feature}</div>)}</div>
            </div>;
          })}
        </div>
      </div>
      <div style={{position: "absolute", left: cursorX, top: cursorY, fontSize: 52, color: "#111", filter: "drop-shadow(0 3px 3px rgba(255,255,255,.8))", transform: `scale(${clickScale})`}}>↖</div>
      <div style={{position: "absolute", left: cursorX - 16, top: cursorY - 16, width: 70, height: 70, borderRadius: 99, border: `3px solid ${LIME}`, transform: `scale(${.35 + clickGlow * 1.35})`, opacity: (1 - clickGlow) * clickGlow}} />
    </div>
  </>;
};

type InfographicItem = { label: string; value: number; detail?: string };

export const InfographicPreset: React.FC<{
  variant?: "circular" | "vertical"; title?: string; centerLabel?: string;
  items?: InfographicItem[]; background?: string;
}> = ({variant = "circular", title = "RINGKASAN DATA", centerLabel = "TOTAL", items = [
  {label: "Akses", value: 72, detail: "lebih cepat"}, {label: "Biaya", value: 48, detail: "lebih hemat"}, {label: "Hasil", value: 86, detail: "lebih optimal"},
], background = theme.chroma}) => {
  const frame = useCurrentFrame();
  const reveal = (index: number) => interpolate(frame, [8 + index * 8, 30 + index * 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)});
  const safeItems = items.slice(0, 4);
  const isChroma = background.toUpperCase() === theme.chroma;
  const primaryVisual = isChroma ? theme.accent.blue : LIME;
  const secondaryVisual = isChroma ? CREAM : theme.accent.blue;
  if (variant === "vertical") return <div style={{position: "absolute", inset: 0, overflow: "hidden", background}}>
    <div style={{position: "absolute", left: 510, top: 95, color: CREAM, font: "800 28px Plus Jakarta Sans", letterSpacing: 3}}>{title}</div>
    <div style={{position: "absolute", left: 545, top: 180, width: 8, height: 560, borderRadius: 99, background: "rgba(255,255,255,.22)"}} />
    {safeItems.map((item, index) => { const progress = reveal(index); const y = 175 + index * 150; return <div key={`${item.label}-${index}`} style={{position: "absolute", left: 520, top: y, width: 870, height: 118, opacity: progress, translate: `${(1 - progress) * 55}px 0`}}>
      <div style={{position: "absolute", left: 0, top: 30, width: 58, height: 58, borderRadius: 99, background: index === 0 ? primaryVisual : secondaryVisual, border: `8px solid ${theme.bg}`, color: index === 0 || !isChroma ? "#FFF" : theme.bg, display: "grid", placeItems: "center", font: "800 15px Inter"}}>{index + 1}</div>
      <div style={{position: "absolute", left: 92, top: 14, color: "#FFF", font: "800 31px Plus Jakarta Sans"}}>{item.label}</div>
      <div style={{position: "absolute", left: 92, top: 61, width: 570, height: 12, borderRadius: 99, background: "rgba(255,255,255,.25)", overflow: "hidden"}}><div style={{height: "100%", width: `${item.value * progress}%`, borderRadius: 99, background: index === 0 ? primaryVisual : secondaryVisual}} /></div>
      <div style={{position: "absolute", right: 35, top: 10, color: "#FFF", font: "700 48px Plus Jakarta Sans"}}>{Math.round(item.value * progress)}%</div>
      {item.detail && <div style={{position: "absolute", left: 92, top: 84, color: "#FFF", opacity: .75, font: "17px Inter"}}>{item.detail}</div>}
    </div>; })}
  </div>;
  const radii = [190, 145, 100, 55];
  return <div style={{position: "absolute", inset: 0, overflow: "hidden", background}}>
    <div style={{position: "absolute", left: 0, top: 82, width: "100%", textAlign: "center", color: CREAM, font: "800 28px Plus Jakarta Sans", letterSpacing: 3}}>{title}</div>
    <svg width="1920" height="864" style={{position: "absolute", inset: 0}}>{safeItems.map((item, index) => { const radius = radii[index]; const circumference = 2 * Math.PI * radius; const progress = reveal(index); return <g key={`${item.label}-${index}`} transform="rotate(-90 960 435)"><circle cx="960" cy="435" r={radius} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="18"/><circle cx="960" cy="435" r={radius} fill="none" stroke={index % 2 === 0 ? primaryVisual : secondaryVisual} strokeWidth="18" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - item.value / 100 * progress)}/></g>; })}</svg>
    <div style={{position: "absolute", left: 790, top: 378, width: 340, textAlign: "center", color: "#FFF"}}><div style={{font: "800 52px Plus Jakarta Sans"}}>{Math.round((safeItems.reduce((sum, item) => sum + item.value, 0) / Math.max(1, safeItems.length)) * reveal(0))}%</div><div style={{font: "700 15px Inter", letterSpacing: 4, opacity: .72}}>{centerLabel}</div></div>
    {safeItems.map((item, index) => { const leftSide = index % 2 === 0; const y = 245 + Math.floor(index / 2) * 300; return <div key={`label-${item.label}-${index}`} style={{position: "absolute", left: leftSide ? 300 : 1360, top: y, width: 280, color: "#FFF", textAlign: leftSide ? "right" : "left", opacity: reveal(index)}}><div style={{font: "800 38px Plus Jakarta Sans"}}>{item.value}%</div><div style={{font: "700 21px Inter"}}>{item.label}</div>{item.detail && <div style={{font: "15px Inter", opacity: .7, marginTop: 5}}>{item.detail}</div>}<div style={{height: 3, width: 120, marginTop: 12, marginLeft: leftSide ? "auto" : 0, background: index % 2 === 0 ? primaryVisual : secondaryVisual}} /></div>; })}
  </div>;
};

export const PaymentWarning: React.FC<{
  eyebrow?: string; italicWord?: string; message?: string; audioEnabled?: boolean;
}> = ({eyebrow = "PEMBAYARAN", italicWord = "ditolak", message = "Metode pembayaran belum dapat diproses", audioEnabled = true}) => {
  const frame = useCurrentFrame();
  const cardScale = interpolate(frame, [8, 25, 30], [.72, 1.04, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.spring({damping: 180}), output: "perceptual-scale"});
  const cardOpacity = interpolate(frame, [5, 15, 105, 120], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const titleX = interpolate(frame, [17, 34], [-90, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)});
  const scriptX = interpolate(frame, [27, 48], [120, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)});
  const warningPulse = interpolate(frame, [46, 51, 58, 64], [1, 1.18, .94, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const shake = interpolate(frame, [48, 51, 54, 57, 60], [0, -13, 11, -6, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <>
    {audioEnabled && <><Sequence from={6} durationInFrames={28}><Audio src={getSfxUrl("whoosh")} volume={.32}/></Sequence><Sequence from={43} durationInFrames={24}><Audio src={getSfxUrl("impact")} volume={.58}/></Sequence><Sequence from={61} durationInFrames={18}><Audio src={getSfxUrl("tick")} volume={.38}/></Sequence></>}
    <div style={{position: "absolute", left: 425 + shake, top: 150, width: 1070, height: 560, opacity: cardOpacity, scale: cardScale}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 48, background: theme.bg, border: `3px solid ${theme.accent.blue}`, boxShadow: "0 34px 90px rgba(0,0,0,.34), 0 0 46px rgba(37,99,235,.28)"}} />
      <div style={{position: "absolute", left: 74, top: 70, color: theme.text, font: "800 52px Plus Jakarta Sans", letterSpacing: 4, translate: `${titleX}px 0`}}>{eyebrow}</div>
      <div style={{position: "absolute", left: 360, top: 89, color: theme.text, font: "italic 118px Instrument Serif", letterSpacing: -6, lineHeight: .75, translate: `${scriptX}px 0`, rotate: "-4deg"}}>{italicWord}</div>
      <div style={{position: "absolute", left: 74, top: 202, width: 920, height: 3, background: theme.primary, transformOrigin: "0 50%", scale: `${interpolate(frame, [31, 55], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} 1`}} />
      <div style={{position: "absolute", left: 74, top: 270, width: 128, height: 100, borderRadius: 24, background: theme.surface, border: `2px solid ${theme.accent.blue}`, scale: warningPulse}}>
        <div style={{position: "absolute", left: 23, top: 25, width: 66, height: 43, borderRadius: 9, border: `5px solid ${theme.accent.blue}`}}><div style={{height: 7, marginTop: 8, background: theme.accent.blue}} /></div>
        <div style={{position: "absolute", right: -14, top: -17, width: 46, height: 46, borderRadius: 99, background: theme.accent.blue, color: "#FFF", display: "grid", placeItems: "center", font: "800 31px Arial"}}>×</div>
      </div>
      <div style={{position: "absolute", left: 240, top: 274, color: theme.text, font: "700 28px Plus Jakarta Sans"}}>TRANSAKSI GAGAL</div>
      <div style={{position: "absolute", left: 240, top: 326, width: 680, color: theme.text, opacity: .75, font: "21px Inter", lineHeight: 1.45}}>{message}</div>
      <div style={{position: "absolute", left: 240, top: 404, color: theme.primary, font: "700 15px JetBrains Mono", letterSpacing: 2}}>COBA METODE LAIN</div>
    </div>
  </>;
};

export const ExchangeRateChart: React.FC<{
  rate?: number; currency?: string; period?: string; audioEnabled?: boolean;
}> = ({rate = 17752, currency = "USD / IDR", period = "KURS SAAT INI", audioEnabled = true}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [4, 22], [.88, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.spring({damping: 180}), output: "perceptual-scale"});
  const opacity = interpolate(frame, [3, 15, 158, 178], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const chartProgress = interpolate(frame, [24, 143], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.4, 0, .2, 1)});
  const displayedRate = Math.round(interpolate(frame, [20, 143], [10000, rate], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.4, 0, .2, 1)}));
  const formatted = new Intl.NumberFormat("id-ID", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(displayedRate);
  const dotPulse = interpolate(frame, [140, 149, 160], [.7, 1.35, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const path = "M90 238 L165 221 L235 226 L305 196 L375 202 L445 169 L515 181 L585 139 L655 151 L725 109 L795 121 L865 72";
  return <>
    {audioEnabled && <><Sequence from={5} durationInFrames={28}><Audio src={getSfxUrl("whoosh")} volume={.3}/></Sequence><Sequence from={35} durationInFrames={92}><Audio src={getSfxUrl("riser")} volume={.18}/></Sequence><Sequence from={145} durationInFrames={18}><Audio src={getSfxUrl("tick")} volume={.5}/></Sequence></>}
    <div style={{position: "absolute", left: 325, top: 112, width: 1270, height: 640, opacity, scale: enter}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 46, background: theme.bg, border: `2px solid ${theme.accent.blue}`, boxShadow: "0 35px 95px rgba(0,0,0,.35), 0 0 44px rgba(37,99,235,.2)"}}/>
      <div style={{position: "absolute", left: 72, top: 56, color: theme.text, font: "700 17px JetBrains Mono", letterSpacing: 3}}>{currency}</div>
      <div style={{position: "absolute", right: 72, top: 53, padding: "10px 18px", borderRadius: 99, background: theme.surface, color: theme.bg, font: "800 13px Inter", letterSpacing: 2}}>{period}</div>
      <div style={{position: "absolute", left: 72, top: 110, color: theme.text, font: "800 24px Plus Jakarta Sans"}}>US$1 =</div>
      <div style={{position: "absolute", left: 72, top: 142, color: theme.text, font: "800 76px Plus Jakarta Sans", letterSpacing: -4}}>Rp{formatted}</div>
      <div style={{position: "absolute", left: 505, top: 175, color: theme.primary, font: "italic 49px Instrument Serif", rotate: "-3deg"}}>rupiah hari ini</div>
      <div style={{position: "absolute", left: 130, top: 296, width: 1010, height: 270}}>
        {[0, 1, 2, 3].map((line) => <div key={line} style={{position: "absolute", left: 85, right: 45, top: 20 + line * 69, height: 1, background: "rgba(255,255,255,.14)"}}/>)}
        <svg width="1010" height="270" style={{position: "absolute", inset: 0}}>
          <path d={`${path} L865 260 L90 260 Z`} fill="rgba(37,99,235,.13)" opacity={chartProgress}/>
          <path d={path} fill="none" stroke={theme.accent.blue} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chartProgress}/>
          <circle cx="865" cy="72" r="13" fill={theme.primary} opacity={chartProgress} transform={`translate(0 0) scale(${dotPulse})`} style={{transformOrigin: "865px 72px"}}/>
        </svg>
        <div style={{position: "absolute", left: 55, top: 247, color: theme.text, opacity: .62, font: "14px JetBrains Mono"}}>2010</div><div style={{position: "absolute", left: 445, top: 247, color: theme.text, opacity: .62, font: "14px JetBrains Mono"}}>2018</div><div style={{position: "absolute", right: 42, top: 247, color: theme.text, opacity: .62, font: "14px JetBrains Mono"}}>SAAT INI</div>
      </div>
    </div>
  </>;
};
