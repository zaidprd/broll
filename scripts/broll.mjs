#!/usr/bin/env node
// scripts/broll.mjs
// ============================================================
// CLI untuk render editorial b-roll.
// Pilih preset, override text/font/animasi, langsung render.
//
// Usage:
//   node scripts/broll.mjs
//     → render preset default (script-hero) → out/broll.mp4
//
//   node scripts/broll.mjs --preset serif-italic
//     → render preset serif-italic.json → out/broll.mp4
//
//   node scripts/broll.mjs --preset script-hero --output love.mp4
//     → render preset script-hero, output ke out/love.mp4
//
//   node scripts/broll.mjs --text 3:"stop" --text 4:"chasing"
//     → ganti text element index 3 jadi "stop", index 4 jadi "chasing"
//
//   node scripts/broll.mjs --font 3:classic --anim 4:scaleIn
//     → ganti font element 3 ke classic, animasi element 4 ke scaleIn
//
//   node scripts/broll.mjs --set 3.text="stop" --set 4.font="classic"
//     → multiple set dalam satu command
//
//   node scripts/broll.mjs --list
//     → tampilkan preset yang tersedia
//
// Preset ada di folder ./presets/*.json
// Lihat src/Composition.tsx untuk schema element lengkap.
// ============================================================

import "dotenv/config";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PRESETS_DIR = join(ROOT, "presets");
const TMP_CONFIG = join(ROOT, "src", "_config.generated.ts");

// ─── Parse args ───
const args = process.argv.slice(2);

function getArg(name) {
  const i = args.indexOf(name);
  return i > -1 ? args[i + 1] : null;
}

function getAllArgs(name) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === name && i + 1 < args.length) out.push(args[i + 1]);
  }
  return out;
}

const presetName = getArg("--preset") || "script-hero";
const outputArg = getArg("--output") || "out/broll.mp4";
const textOverrides = getAllArgs("--text"); // ["3:stop", "4:chasing"]
const fontOverrides = getAllArgs("--font"); // ["3:classic"]
const animOverrides = getAllArgs("--anim"); // ["4:scaleIn"]
const setFlags = args.filter(a => a.startsWith("--set")); // ["--set", "3.text=stop", ...]

// ─── --list preset ───
if (args.includes("--list")) {
  console.log("\n📂 Available presets:\n");
  const files = readdirSync(PRESETS_DIR).filter(f => f.endsWith(".json"));
  for (const f of files) {
    const p = JSON.parse(readFileSync(join(PRESETS_DIR, f), "utf8"));
    console.log(`  • ${f.replace(".json", "")}`);
    console.log(`    ${p.name || "(no name)"}`);
    if (p.description) console.log(`    ${p.description}`);
    console.log();
  }
  process.exit(0);
}

// ─── Load preset ───
const presetPath = join(PRESETS_DIR, `${presetName}.json`);
if (!existsSync(presetPath)) {
  console.error(`❌ Preset not found: ${presetPath}`);
  console.error(`   Run "node scripts/broll.mjs --list" to see available presets.`);
  process.exit(1);
}

const preset = JSON.parse(readFileSync(presetPath, "utf8"));
console.log(`📐 Loaded preset: ${preset.name || presetName}`);

// ─── Apply overrides ───
function applyOverride(idx, key, value) {
  const el = preset.elements[idx];
  if (!el) {
    console.error(`⚠️  Element index ${idx} not found, skipping ${key}=${value}`);
    return;
  }
  // cast types
  if (["x", "y", "fontSize", "fontWeight", "delay", "duration"].includes(key)) {
    value = Number(value);
  } else if (key === "rotation") {
    value = Number(value);
  } else if (key === "opacity") {
    value = Number(value);
  } else if (key === "letterSpacing") {
    value = Number(value);
  }
  el[key] = value;
  console.log(`   ✏️  [${idx}] ${key} = ${value}`);
}

function parseColonPair(s) {
  const [idx, ...rest] = s.split(":");
  return { idx: Number(idx), value: rest.join(":") };
}

for (const t of textOverrides) {
  const { idx, value } = parseColonPair(t);
  applyOverride(idx, "text", value);
}
for (const f of fontOverrides) {
  const { idx, value } = parseColonPair(f);
  applyOverride(idx, "font", value);
}
for (const a of animOverrides) {
  const { idx, value } = parseColonPair(a);
  applyOverride(idx, "anim", value);
}
for (const flag of setFlags) {
  // format: --set 3.text="stop"
  const eq = flag.indexOf("=");
  const path = flag.substring(0, eq);
  let value = flag.substring(eq + 1);
  // strip quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  const dot = path.indexOf(".");
  if (dot < 0) continue;
  const idx = Number(path.substring(0, dot));
  const key = path.substring(dot + 1);
  applyOverride(idx, key, value);
}

// ─── Generate Composition.tsx ───
// Kita tulis file temporary yang re-export CONFIG.
// Approach: replace CONFIG in Composition.tsx by injecting the preset JSON.
// Cleaner approach: write Composition.tsx with CONFIG loaded from external JSON.

const compositionSrc = `// AUTO-GENERATED by scripts/broll.mjs — jangan edit manual.
// Re-run CLI untuk regenerate.

import type { GeneratedConfig } from "./_types";

export const GENERATED_CONFIG: GeneratedConfig = ${JSON.stringify(
  {
    elements: preset.elements,
    audio: preset.audio || {
      sfxEnabled: true,
      padEnabled: true,
      sfxVolume: 0.7,
      padVolume: 0.4,
    },
  },
  null,
  2
)};
`;

writeFileSync(TMP_CONFIG, compositionSrc);
console.log(`📝 Generated config: ${TMP_CONFIG.replace(ROOT, ".")}`);

// ─── Render ───
const isWin = process.platform === "win32";
const remotionBin = isWin
  ? "node_modules\\.bin\\remotion.cmd"
  : "node_modules/.bin/remotion";

mkdirSync(join(ROOT, "out"), { recursive: true });
const renderArgs = ["render", "src/index.ts", "Broll", outputArg, "--concurrency", "1"];

console.log(`🎬 Rendering: ${outputArg}\n`);
const proc = spawn(remotionBin, renderArgs, {
  cwd: ROOT,
  stdio: "inherit",
  shell: isWin,
});

proc.on("close", (code) => {
  if (code === 0) {
    console.log(`\n🎉 Done! ${outputArg}`);
  } else {
    console.error(`\n❌ Render failed with code ${code}`);
    process.exit(code || 1);
  }
});
