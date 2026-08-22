import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../../fonts";

export type GpuHeroProps = {
  eyebrow?: string;
  headline?: string;
  question?: string;
  primary?: string;
  background?: string;
  gpuLabel?: string;
  integratedLabel?: string;
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Chip: React.FC<{
  label: string;
  detail: string;
  active?: boolean;
  style?: React.CSSProperties;
}> = ({ label, detail, active = false, style }) => (
  <div style={{
    position: "absolute",
    width: 244,
    height: 132,
    padding: "22px 24px",
    borderRadius: 28,
    color: "white",
    background: active
      ? "linear-gradient(145deg, rgba(255,255,255,.18), rgba(16,185,129,.09))"
      : "linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.025))",
    border: `1px solid rgba(255,255,255,${active ? 0.28 : 0.13})`,
    boxShadow: active
      ? "inset 0 1px 0 rgba(255,255,255,.25), 0 30px 80px rgba(16,185,129,.24), 0 0 55px rgba(16,185,129,.16)"
      : "inset 0 1px 0 rgba(255,255,255,.12), 0 24px 70px rgba(0,0,0,.34)",
    backdropFilter: "blur(22px)",
    ...style,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        fontSize: 12,
        fontWeight: 800,
        background: active ? "#10B981" : "rgba(255,255,255,.09)",
        boxShadow: active ? "0 0 28px rgba(16,185,129,.55)" : "none",
      }}>GPU</div>
      <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.03em" }}>{label}</div>
    </div>
    <div style={{ marginTop: 19, fontSize: 13, color: "rgba(255,255,255,.54)", letterSpacing: ".05em", textTransform: "uppercase" }}>{detail}</div>
  </div>
);

export const GpuHero: React.FC<GpuHeroProps> = ({
  eyebrow = "DEDICATED GRAPHICS",
  headline = "PUNYA GPU",
  question = "TAPI MASIH LEMOT?",
  primary = "#10B981",
  background = "#07120F",
  gpuLabel = "NVIDIA",
  integratedLabel = "Intel Graphics",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 75, mass: 1.15 } });
  const camera = interpolate(frame, [0, 112, 170, 209], [0, 1, 1.7, 2.05], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const turn = interpolate(frame, [0, 120], [-7, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const questionIn = interpolate(frame, [118, 153], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const firstOut = interpolate(frame, [108, 145], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const pulse = 0.82 + Math.sin(frame / 13) * 0.08;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background, fontFamily: fonts.display, color: "white" }}>
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 50%, ${primary}3d 0%, ${primary}12 22%, transparent 57%), radial-gradient(circle at 18% 8%, #2563EB22, transparent 38%), linear-gradient(145deg, #020806 0%, ${background} 56%, #020706 100%)`,
      }} />
      <div style={{
        position: "absolute", left: 390, top: 92, width: 560, height: 560, borderRadius: "50%",
        background: primary, filter: "blur(125px)", opacity: pulse * 0.2,
      }} />
      <div style={{
        position: "absolute", left: 555, top: -110, width: 170, height: 920,
        background: `linear-gradient(180deg, transparent, ${primary}36, transparent)`,
        filter: "blur(45px)", transform: `rotate(16deg) translateY(${camera * 8}px)`, opacity: 0.7,
      }} />

      <div style={{
        position: "absolute", inset: 0, perspective: 1200,
        transform: `scale(${1 + camera * 0.035}) translateY(${-camera * 5}px)`,
      }}>
        <div style={{
          position: "absolute", left: 430, top: 212, width: 420, height: 270,
          transformStyle: "preserve-3d", transform: `rotateX(58deg) rotateZ(${turn}deg) translateZ(${camera * 15}px)`,
          opacity: intro,
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 30,
            background: "linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.035))",
            border: "1px solid rgba(255,255,255,.2)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.25), 0 48px 100px rgba(0,0,0,.55), 0 0 80px ${primary}25`,
            backdropFilter: "blur(25px)",
          }}>
            <div style={{ position: "absolute", left: 34, right: 34, top: 30, height: 168, borderRadius: 18, background: "linear-gradient(150deg,#0C1714,#07100E)", border: "1px solid rgba(255,255,255,.09)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 52% 55%, ${primary}54, transparent 38%)` }} />
              {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 94, bottom: 30, width: 62, height: 5 + i * 15, borderRadius: 9, background: i === 2 ? primary : "rgba(255,255,255,.16)", boxShadow: i === 2 ? `0 0 18px ${primary}` : "none" }} />)}
            </div>
            <div style={{ position: "absolute", left: 172, bottom: 25, width: 76, height: 8, borderRadius: 8, background: "rgba(255,255,255,.15)" }} />
          </div>
        </div>

        <Chip label={integratedLabel} detail="Integrated • Active" style={{ left: 98, top: 388, opacity: intro * firstOut, transform: `translate3d(${(1 - intro) * -95}px, ${22 - camera * 7}px, 0) rotateY(10deg) rotateZ(-3deg) scale(.92)`, filter: "blur(.25px)" }} />
        <Chip label={gpuLabel} detail="Dedicated • 0% usage" active style={{ right: 80, top: 166, opacity: intro * firstOut, transform: `translate3d(${(1 - intro) * 110}px, ${-16 + camera * 7}px, 0) rotateY(-9deg) rotateZ(3deg)`, }} />

        <div style={{ position: "absolute", left: 340, top: 475, width: 600, height: 130, opacity: intro * firstOut, transform: `translateY(${(1 - intro) * 40}px)` }}>
          <svg width="600" height="130" viewBox="0 0 600 130" style={{ overflow: "visible" }}>
            <path d="M15 70 C150 70, 165 30, 285 60 S430 94,585 42" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="2" />
            <path d="M15 70 C150 70, 165 30, 285 60 S430 94,585 42" fill="none" stroke={primary} strokeWidth="3" strokeLinecap="round" strokeDasharray="110 700" strokeDashoffset={-frame * 7} style={{ filter: `drop-shadow(0 0 9px ${primary})` }} />
          </svg>
        </div>
      </div>

      <div style={{ position: "absolute", left: 72, top: 68, opacity: intro * firstOut }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".24em", color: "rgba(255,255,255,.52)" }}>{eyebrow}</div>
      </div>
      <div style={{
        position: "absolute", left: 66, right: 66, bottom: 54,
        fontSize: 112, lineHeight: .88, fontWeight: 800, letterSpacing: "-.075em",
        opacity: intro * firstOut,
        transform: `translateY(${(1 - intro) * 65 - camera * 4}px)`,
        textShadow: "0 24px 60px rgba(0,0,0,.4)",
      }}>{headline}</div>

      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        opacity: questionIn,
        transform: `scale(${0.78 + questionIn * 0.22}) translateY(${(1 - questionIn) * 48}px)`,
      }}>
        <div style={{ position: "absolute", width: 760, height: 310, borderRadius: "50%", background: primary, filter: "blur(130px)", opacity: .22 * questionIn }} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: 16, letterSpacing: ".22em", fontWeight: 700, color: "rgba(255,255,255,.55)", marginBottom: 17 }}>REALITY CHECK</div>
          <div style={{ fontSize: 108, lineHeight: .9, fontWeight: 800, letterSpacing: "-.075em", whiteSpace: "nowrap", textShadow: `0 0 65px ${primary}32` }}>{question}</div>
          <div style={{ margin: "34px auto 0", width: 98, height: 5, borderRadius: 5, background: primary, boxShadow: `0 0 24px ${primary}` }} />
        </div>
      </div>

      <AbsoluteFill style={{ pointerEvents: "none", opacity: .13, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")", mixBlendMode: "soft-light" }} />
    </AbsoluteFill>
  );
};
