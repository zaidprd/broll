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
import { join, basename, extname } from "node:path";
import { legacyPresetToMotionProject } from "./legacy-motion.mjs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PRESETS_DIR = join(ROOT, "presets");
const JOBS_DIR = join(ROOT, "out", "jobs");

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

const presetName = getArg("--preset") || "apple-01-dark-stage";
const outputArg = getArg("--output") || "out/broll.mp4";
const textOverrides = getAllArgs("--text"); // ["3:stop", "4:chasing"]
const fontOverrides = getAllArgs("--font"); // ["3:classic"]
const animOverrides = getAllArgs("--anim"); // ["4:scaleIn"]
const setFlags = getAllArgs("--set"); // ["3.text=stop", "4.font=classic"]
const alphaOutput = args.includes("--alpha");

// ─── --list preset ───
if (args.includes("--list")) {
  console.log("\n📂 Available presets:\n");
  const files = readdirSync(PRESETS_DIR).filter(f => f.endsWith(".json"));
  for (const f of files) {
    const p = JSON.parse(readFileSync(join(PRESETS_DIR, f), "utf8"));
    console.log(`  • ${f.replace(".json", "")}`);
    console.log(`    ${p.title || p.name || "(no title)"}`);
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
const isMotionProject = preset.schemaVersion === "1.0" && Array.isArray(preset.scenes);
console.log(`📐 Loaded ${isMotionProject ? "MotionProject" : "preset"}: ${preset.title || preset.name || presetName}`);

if (isMotionProject && (textOverrides.length || fontOverrides.length || animOverrides.length || setFlags.length)) {
  console.error("❌ Override CLI (--text/--font/--anim/--set) hanya untuk preset typography lama.");
  console.error("   Edit MotionProject JSON langsung, atau tunggu Scene Builder pada Phase 3.");
  process.exit(1);
}

// ─── Apply overrides ───
function applyOverride(idx, key, value) {
  const el = preset.elements[idx];
  if (!el) {
    console.error(`⚠️  Element index ${idx} not found, skipping ${key}=${value}`);
    return;
  }
  // cast types
  if (["x", "y", "fontSize", "fontWeight", "delay", "duration", "sfxOffset"].includes(key)) {
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

if (!isMotionProject) {
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
    if (eq < 1) {
      console.error(`⚠️  Format --set tidak valid: ${flag}`);
      continue;
    }
    const path = flag.substring(0, eq);
    let value = flag.substring(eq + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    const dot = path.indexOf(".");
    if (dot < 0) continue;
    const idx = Number(path.substring(0, dot));
    const key = path.substring(dot + 1);
    applyOverride(idx, key, value);
  }
}

// ─── Create isolated per-render job input ───
// Each render receives props JSON. No renderer source file is overwritten.
mkdirSync(JOBS_DIR, { recursive: true });
const jobId = `${Date.now()}-${basename(outputArg, extname(outputArg)).replace(/[^a-zA-Z0-9-_]/g, "-")}`;
const jobPath = join(JOBS_DIR, `${jobId}.json`);
const job = {
  project: isMotionProject
    ? preset
    : legacyPresetToMotionProject(preset, {
      id: jobId,
      title: preset.name || presetName,
    }),
  audio: preset.audio || {
    sfxEnabled: true,
    padEnabled: true,
    sfxVolume: 0.7,
    padVolume: 0.4,
  },
};
writeFileSync(jobPath, JSON.stringify({ job }, null, 2));
console.log(`📝 Render job: ${jobPath.replace(ROOT, ".")}`);

// ─── Render ───
const isWin = process.platform === "win32";
const remotionBin = isWin
  ? "node_modules\\.bin\\remotion.cmd"
  : "node_modules/.bin/remotion";

mkdirSync(join(ROOT, "out"), { recursive: true });
// Keep the props path relative on Windows. `shell: true` is required for the
// `.cmd` shim, and an absolute workspace path containing spaces gets split.
const renderJobPath = join("out", "jobs", `${jobId}.json`);
const renderArgs = ["render", "src/index.ts", "Broll", outputArg, "--props", renderJobPath, "--concurrency", "1"];
if (alphaOutput) {
  renderArgs.push("--image-format=png", "--pixel-format=yuva444p10le", "--codec=prores", "--prores-profile=4444");
}

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
