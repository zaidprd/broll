// src/sfx/synth.ts
// ============================================================
// Procedural SFX generator. No downloads. No API keys.
// All sound generated via DSP, encoded as base64 WAV data URIs.
// Works in both Node (Remotion render) and browser.
// ============================================================

export type SfxType = "whoosh" | "impact" | "tick" | "riser" | "pad" | "click";

// ─── Sample WAV encoder ───
function encodeWav(samples: Float32Array, sampleRate: number): Uint8Array {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new Uint8Array(44 + dataSize);
  const view = new DataView(buffer.buffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // PCM data
  for (let i = 0; i < samples.length; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(44 + i * 2, Math.round(s), true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ─── Envelope helpers ───
function expDecay(t: number, halfLife: number): number {
  return Math.exp(-t / halfLife);
}

// ─── Noise generator (deterministic) ───
function makeNoiseBuffer(durationSec: number, sampleRate: number, seed: number): Float32Array {
  const len = Math.floor(durationSec * sampleRate);
  const buf = new Float32Array(len);
  let state = seed | 0;
  for (let i = 0; i < len; i++) {
    state = (state * 1664525 + 1013904223) | 0;
    buf[i] = (state / 0x7fffffff) * 2 - 1;
  }
  return buf;
}

// ─── SFX generators ───

function genWhoosh(sampleRate: number): Float32Array {
  const duration = 0.6;
  const len = Math.floor(duration * sampleRate);
  const out = new Float32Array(len);
  const noise = makeNoiseBuffer(duration, sampleRate, 12345);

  let filteredNoise = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;

    // Sine sweep 800 → 120 Hz
    const f = 800 * Math.pow(120 / 800, t / duration);
    const sine = Math.sin(2 * Math.PI * f * t);

    // Sweeping lowpass on noise
    const cutoff = 2000 * Math.pow(200 / 2000, t / duration);
    const rc = 1 / (2 * Math.PI * cutoff);
    const dt = 1 / sampleRate;
    const alpha = dt / (rc + dt);
    filteredNoise = filteredNoise + alpha * (noise[i] - filteredNoise);

    const mix = filteredNoise * 0.7 + sine * 0.3;
    const env = t < 0.05 ? t / 0.05 : expDecay(t - 0.05, 0.18);

    out[i] = mix * env * 0.5;
  }
  return out;
}

function genImpact(sampleRate: number): Float32Array {
  const duration = 0.5;
  const len = Math.floor(duration * sampleRate);
  const out = new Float32Array(len);
  const noise = makeNoiseBuffer(0.05, sampleRate, 67890);

  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const bass = Math.sin(2 * Math.PI * 60 * t) * expDecay(t, 0.15);
    const body = Math.sin(2 * Math.PI * 120 * t) * expDecay(t, 0.25);

    let click = 0;
    if (t < 0.03) {
      click = noise[Math.floor(t * sampleRate)] * (1 - t / 0.03);
    }

    out[i] = (bass * 0.7 + body * 0.3 + click * 0.4) * 0.55;
  }
  return out;
}

function genTick(sampleRate: number): Float32Array {
  const duration = 0.12;
  const len = Math.floor(duration * sampleRate);
  const out = new Float32Array(len);
  const noise = makeNoiseBuffer(duration, sampleRate, 11111);

  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const sine = Math.sin(2 * Math.PI * 1800 * t);
    const env = expDecay(t, 0.025);
    out[i] = (sine * 0.4 + noise[i] * 0.6) * env * 0.4;
  }
  return out;
}

function genRiser(sampleRate: number): Float32Array {
  const duration = 0.8;
  const len = Math.floor(duration * sampleRate);
  const out = new Float32Array(len);
  const noise = makeNoiseBuffer(duration, sampleRate, 22222);

  let filtered = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const cutoff = 200 + 3000 * (t / duration);
    const rc = 1 / (2 * Math.PI * cutoff);
    const dt = 1 / sampleRate;
    const alpha = dt / (rc + dt);
    filtered = filtered + alpha * (noise[i] - filtered);

    const sine = Math.sin(2 * Math.PI * (80 + 200 * (t / duration)) * t);
    const env = Math.pow(t / duration, 2.5);

    out[i] = (filtered * 0.5 + sine * 0.5) * env * 0.35;
  }
  return out;
}

function genPad(sampleRate: number): Float32Array {
  const duration = 6.0;
  const len = Math.floor(duration * sampleRate);
  const out = new Float32Array(len);

  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const a = Math.sin(2 * Math.PI * 110 * t);
    const e = Math.sin(2 * Math.PI * 165 * t);
    const c = Math.sin(2 * Math.PI * 220 * t) * 0.4;
    const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 4 * t);

    let env = 1;
    if (t < 1) env = t;
    else if (t > 5) env = Math.max(0, (6 - t) / 1);

    out[i] = (a * 0.5 + e * 0.3 + c * 0.2) * lfo * env * 0.15;
  }
  return out;
}

function genClick(sampleRate: number): Float32Array {
  const duration = 0.05;
  const len = Math.floor(duration * sampleRate);
  const out = new Float32Array(len);
  const noise = makeNoiseBuffer(duration, sampleRate, 33333);

  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    out[i] = noise[i] * expDecay(t, 0.008) * 0.3;
  }
  return out;
}

// ─── Cache: encode once at module load, expose data URI ───
const SAMPLE_RATE = 44100;
const cache = new Map<SfxType, string>();

function makeDataUri(samples: Float32Array): string {
  const wav = encodeWav(samples, SAMPLE_RATE);
  // base64 encode manual (browser-safe, works in Node + browser)
  let binary = "";
  for (let i = 0; i < wav.length; i++) {
    binary += String.fromCharCode(wav[i]);
  }
  const base64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(wav).toString("base64");
  return `data:audio/wav;base64,${base64}`;
}

// Generate at module init (runs in Node when Remotion imports this)
cache.set("whoosh", makeDataUri(genWhoosh(SAMPLE_RATE)));
cache.set("impact", makeDataUri(genImpact(SAMPLE_RATE)));
cache.set("tick", makeDataUri(genTick(SAMPLE_RATE)));
cache.set("riser", makeDataUri(genRiser(SAMPLE_RATE)));
cache.set("pad", makeDataUri(genPad(SAMPLE_RATE)));
cache.set("click", makeDataUri(genClick(SAMPLE_RATE)));

export function getSfxUrl(type: SfxType): string {
  return cache.get(type)!;
}

export function getAllSfx(): Record<SfxType, string> {
  return {
    whoosh: cache.get("whoosh")!,
    impact: cache.get("impact")!,
    tick: cache.get("tick")!,
    riser: cache.get("riser")!,
    pad: cache.get("pad")!,
    click: cache.get("click")!,
  };
}
