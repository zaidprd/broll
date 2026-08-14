// src/Composition.tsx
// ============================================================
// CONFIG sourced dari scripts/broll.mjs (generated file).
//
// Edit preset di ./presets/*.json ATAU jalankan CLI:
//   node scripts/broll.mjs --preset script-hero
//
// SFX: procedural via Web Audio API synthesis (src/sfx/synth.ts).
// Tidak ada file audio eksternal, tidak ada API key.
// Per-element SFX override via element.sfx field:
//   "auto" | "whoosh" | "impact" | "tick" | "riser" | "click" | "silent" | "custom"
// Custom SFX: taruh file di public/sfx-custom/<name>.wav, set sfx="custom" + sfxFile="<name>.wav"
// ============================================================

import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { fonts } from "./fonts";
import type { ElementConfig } from "./_types";
import { GENERATED_CONFIG } from "./_config.generated";
import type { AudioConfig } from "./_types";
import { getSfxUrl, type SfxType } from "./sfx/synth";
import { resolveSfx } from "./sfx/mapper";

// ─── Theme constants ───
const BG = "#0A0A0A";
const CREAM = "#F3F0E8";
const DURATION = 6;

// ─── Pre-resolve SFX URLs at module init ───
const SFX_URLS: Record<SfxType, string> = {
  whoosh: getSfxUrl("whoosh"),
  impact: getSfxUrl("impact"),
  tick: getSfxUrl("tick"),
  riser: getSfxUrl("riser"),
  pad: getSfxUrl("pad"),
  click: getSfxUrl("click"),
};

// ─── Element with optional SFX trigger ───
const Txt: React.FC<
  ElementConfig & { sfxEnabled: boolean; sfxVolume: number }
> = ({
  text,
  x,
  y,
  fontSize,
  font,
  fontStyle = "normal",
  fontWeight = 400,
  letterSpacing = 0,
  delay,
  anim,
  duration = 0.73,
  opacity: peakOpacity = 1,
  rotation = 0,
  sfx,
  sfxFile,
  sfxStart = 0,
  sfxEnabled,
  sfxVolume,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.round(delay * fps);
  const localFrame = frame - startFrame;
  const dur = Math.round(duration * fps);

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + dur, fps * 5.5, fps * DURATION],
    [0, peakOpacity, peakOpacity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let tx = 0;
  let ty = 0;
  let scale = 1;

  if (localFrame >= 0 && localFrame <= dur) {
    const t = interpolate(localFrame, [0, dur], [0, 1], {
      extrapolateRight: "clamp",
    });
    const e = t * t * (3 - 2 * t);

    switch (anim) {
      case "fade": break;
      case "slideUp": ty = (1 - e) * 36; break;
      case "slideLeft": tx = (1 - e) * 60; break;
      case "slideRight": tx = (1 - e) * -60; break;
      case "scaleIn": scale = 0.7 + 0.3 * e; break;
      case "wordPop": scale = 0.6 + 0.4 * e; break;
      case "reveal": ty = (1 - e) * 50; break;
    }
  }

  // SFX trigger
  const resolved = sfxEnabled ? resolveSfx(sfx, anim) : null;
  const sfxType = resolved === "custom" ? null : resolved;
  const customFile = resolved === "custom" && sfxFile ? sfxFile : null;

  // Audio element time bounds
  const audioStartFrame = Math.round((delay + sfxStart) * fps);
  // For procedural SFX, end at delay + 0.8s. For custom, end at video duration.
  const audioEndFrame = customFile
    ? fps * DURATION
    : Math.round((delay + sfxStart + 0.8) * fps);

  return (
    <>
      {sfxType && (
        <Audio
          src={SFX_URLS[sfxType]}
          startFrom={audioStartFrame}
          endAt={audioEndFrame}
          volume={sfxVolume}
        />
      )}
      {customFile && (
        <Audio
          src={staticFile(`sfx-custom/${customFile}`)}
          startFrom={audioStartFrame}
          endAt={audioEndFrame}
          volume={sfxVolume}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: fonts[font],
          fontStyle,
          fontWeight,
          fontSize,
          lineHeight: 1.0,
          color: CREAM,
          letterSpacing: `${letterSpacing}em`,
          transform: `translate(${x + tx}px, ${y + ty}px) rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: "top left",
          opacity,
          whiteSpace: "nowrap",
          userSelect: "none",
          willChange: "transform, opacity",
        }}
      >
        {text}
      </div>
    </>
  );
};

export const Broll: React.FC = () => {
  const audio: AudioConfig = GENERATED_CONFIG.audio || {
    sfxEnabled: true,
    padEnabled: true,
    sfxVolume: 0.7,
    padVolume: 0.4,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Background pad drone */}
      {audio.padEnabled && <Audio src={SFX_URLS.pad} volume={audio.padVolume} />}

      {/* Per-element SFX + text */}
      {GENERATED_CONFIG.elements.map((el, i) => (
        <Txt
          key={i}
          {...el}
          sfxEnabled={audio.sfxEnabled}
          sfxVolume={audio.sfxVolume}
        />
      ))}
    </AbsoluteFill>
  );
};
