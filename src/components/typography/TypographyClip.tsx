// src/components/typography/TypographyClip.tsx
// Phase 1 compatibility renderer. It renders the existing typography language
// through a normalized MotionProject clip rather than legacy generated source.

import React from "react";
import { Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, type FontKey } from "../../fonts";
import { getSfxUrl, type SfxType } from "../../sfx/synth";
import { resolveSfx } from "../../sfx/mapper";
import type { ClipAnimation } from "../../engine/MotionProject";

const CREAM = "#F3F0E8";
const SFX_URLS: Record<SfxType, string> = {
  whoosh: getSfxUrl("whoosh"),
  impact: getSfxUrl("impact"),
  tick: getSfxUrl("tick"),
  riser: getSfxUrl("riser"),
  pad: getSfxUrl("pad"),
  click: getSfxUrl("click"),
};

type TypographyProps = {
  text: string;
  layout: { position: [number, number] };
  font: FontKey;
  fontStyle?: "normal" | "italic";
  fontWeight?: number;
  fontSize: number;
  letterSpacing?: number;
  /** Lebar teks. Bila tidak diisi, engine memakai safe area otomatis. */
  maxWidth?: number;
  textAlign?: "left" | "center" | "right";
  color?: string;
  highlight?: { word: string; color?: string };
  rotation?: number;
  opacity?: number;
  sfx?: "auto" | "whoosh" | "impact" | "tick" | "riser" | "click" | "silent" | "custom";
  sfxFile?: string;
  sfxOffset?: number;
};

export const TypographyClip: React.FC<{
  props: TypographyProps;
  enter?: ClipAnimation;
  durationInFrames: number;
  audioEnabled: boolean;
  sfxVolume: number;
}> = ({ props, enter, durationInFrames, audioEnabled, sfxVolume }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const animationDuration = enter?.durationFrames ?? 1;
  const progress = interpolate(frame, [0, animationDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const eased = progress * progress * (3 - 2 * progress);

  let tx = 0;
  let ty = 0;
  let scale = 1;
  switch (enter?.preset) {
    case "slideUp": ty = (1 - eased) * 36; break;
    case "slideLeft": tx = (1 - eased) * 60; break;
    case "slideRight": tx = (1 - eased) * -60; break;
    case "scaleIn": scale = 0.7 + 0.3 * eased; break;
    case "wordPop": scale = 0.6 + 0.4 * eased; break;
    case "reveal": ty = (1 - eased) * 50; break;
    default: break;
  }

  const safeTextWidth = Math.max(240, width - props.layout.position[0] - 80);
  const maxWidth = props.maxWidth ?? safeTextWidth;
  const markerProgress = interpolate(frame, [Math.max(0, animationDuration - 4), animationDuration + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const peakOpacity = props.opacity ?? 1;
  const opacity = interpolate(
    frame,
    [0, animationDuration, Math.max(animationDuration, durationInFrames - Math.round(fps * 0.5)), durationInFrames],
    [0, peakOpacity, peakOpacity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const resolved = audioEnabled ? resolveSfx(props.sfx, enter?.preset ?? "fade") : null;
  const sfxType = resolved === "custom" ? null : resolved;
  const customFile = resolved === "custom" && props.sfxFile ? props.sfxFile : null;
  const audioFrom = Math.max(0, Math.round((props.sfxOffset ?? 0) * fps));
  const proceduralDuration = Math.round(0.8 * fps);

  return (
    <>
      {sfxType && (
        <Sequence from={audioFrom} durationInFrames={proceduralDuration}>
          <Audio src={SFX_URLS[sfxType]} endAt={proceduralDuration} volume={sfxVolume} />
        </Sequence>
      )}
      {customFile && (
        <Sequence from={audioFrom} durationInFrames={Math.max(1, durationInFrames - audioFrom)}>
          <Audio src={staticFile(`sfx-custom/${customFile}`)} volume={sfxVolume} />
        </Sequence>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: fonts[props.font],
          fontStyle: props.fontStyle ?? "normal",
          fontWeight: props.fontWeight ?? 400,
          fontSize: props.fontSize,
          lineHeight: 1,
          color: props.color ?? CREAM,
          letterSpacing: `${props.letterSpacing ?? 0}em`,
          transform: `translate(${props.layout.position[0] + tx}px, ${props.layout.position[1] + ty}px) rotate(${props.rotation ?? 0}deg) scale(${scale})`,
          transformOrigin: "top left",
          opacity,
          clipPath: enter?.preset === "reveal" ? `inset(0 ${(1 - eased) * 100}% 0 0)` : undefined,
          // Headline panjang harus membentuk komposisi multi-baris, bukan keluar frame.
          maxWidth,
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          textAlign: props.textAlign ?? "left",
          userSelect: "none",
        }}
      >
        {props.highlight?.word ? props.text.split(new RegExp(`(${props.highlight.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")).map((part, index) => part.toLowerCase() === props.highlight?.word.toLowerCase() ? <span key={index} style={{
          backgroundImage: `linear-gradient(176deg, transparent 8%, ${props.highlight.color ?? "#FDE047"} 10%, ${props.highlight.color ?? "#FDE047"} 88%, transparent 91%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${markerProgress * 108}% 100%`,
          padding: "0 0.08em",
        }}>{part}</span> : part) : props.text}
      </div>
    </>
  );
};
