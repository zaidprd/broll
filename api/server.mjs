// api/server.mjs
// ============================================================
// Express backend. Terima form dari UI, generate preset JSON,
// panggil Remotion render, balikin URL MP4.
// ============================================================

import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "node:child_process";
import { writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { legacyPresetToMotionProject } from "../scripts/legacy-motion.mjs";
import { planScript } from "../scripts/motion-templates.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PRESETS_DIR = join(ROOT, "presets");
const OUT_DIR = join(ROOT, "out");
const JOBS_DIR = join(OUT_DIR, "jobs");
const CUSTOM_SFX_DIR = join(ROOT, "public", "sfx-custom");
const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".ogg", ".m4a", ".flac"]);

mkdirSync(CUSTOM_SFX_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: CUSTOM_SFX_DIR,
    filename: (req, file, callback) => {
      const extension = extname(file.originalname).toLowerCase();
      const baseName = file.originalname
        .slice(0, -extension.length)
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "custom-sfx";
      callback(null, `${Date.now()}-${baseName}${extension}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    callback(null, AUDIO_EXTENSIONS.has(extension));
  },
});

let renderBusy = false;

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Serve static MP4 from out/
app.use("/out", express.static(OUT_DIR));

function listCustomSfx() {
  return readdirSync(CUSTOM_SFX_DIR)
    .filter((file) => AUDIO_EXTENSIONS.has(extname(file).toLowerCase()))
    .map((file) => ({
      name: file,
      label: file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    }));
}

function startMotionRender(res, project, audio, name = "motion-project") {
  if (renderBusy) {
    return res.status(409).json({ error: "Render sedang berjalan. Tunggu sampai render sebelumnya selesai." });
  }
  renderBusy = true;
  mkdirSync(JOBS_DIR, { recursive: true });
  const safeName = (name || "motion-project").replace(/[^a-zA-Z0-9-_]/g, "-");
  const jobId = `${Date.now()}-${safeName}`;
  const jobPath = join(JOBS_DIR, `${jobId}.json`);
  const job = {
    project,
    audio: audio || { sfxEnabled: true, padEnabled: true, sfxVolume: 0.7, padVolume: 0.4 },
  };
  writeFileSync(jobPath, JSON.stringify({ job }, null, 2));

  const outputArg = `out/${safeName}-${Date.now()}.mp4`;
  const isWin = process.platform === "win32";
  const remotionBin = isWin ? "node_modules\\.bin\\remotion.cmd" : "node_modules/.bin/remotion";
  const proc = spawn(remotionBin, ["render", "src/index.ts", "Broll", outputArg, "--props", jobPath, "--concurrency", "1"], { cwd: ROOT, shell: isWin });
  let stderr = "";
  proc.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  proc.on("error", (error) => {
    renderBusy = false;
    if (!res.headersSent) res.status(500).json({ error: `Tidak bisa memulai renderer: ${error.message}` });
  });
  proc.on("close", (code) => {
    renderBusy = false;
    if (code === 0) {
      res.json({ ok: true, url: `/out/${outputArg.replace(/^out\//, "")}` });
    } else {
      res.status(500).json({ error: "Render gagal", code, stderr });
    }
  });
}

// ─── POST /render ───
// Body: { style, name, lines, audio: { sfxEnabled, padEnabled, sfxVolume, padVolume } }
app.post("/render", async (req, res) => {
  const { style, name, lines, audio } = req.body || {};

  if (renderBusy) {
    return res.status(409).json({
      error: "Render sedang berjalan. Tunggu sampai render sebelumnya selesai.",
    });
  }
  if (!style) return res.status(400).json({ error: "style required" });
  if (!Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: "lines array required" });
  }

  // Load base preset
  const presetPath = join(PRESETS_DIR, `${style}.json`);
  if (!existsSync(presetPath)) {
    return res.status(400).json({ error: `unknown style: ${style}` });
  }
  const preset = JSON.parse(
    await import("node:fs").then(fs => fs.readFileSync(presetPath, "utf8"))
  );

  // Apply line overrides
  // lines[].index = which element to override (0-based)
  for (const ln of lines) {
    const idx = ln.index;
    if (typeof idx !== "number") continue;
    const el = preset.elements[idx];
    if (!el) continue;
    if (typeof ln.text === "string") el.text = ln.text;
    if (typeof ln.font === "string") el.font = ln.font;
    if (typeof ln.anim === "string") el.anim = ln.anim;
    if (typeof ln.x === "number") el.x = ln.x;
    if (typeof ln.y === "number") el.y = ln.y;
    if (typeof ln.fontSize === "number") el.fontSize = ln.fontSize;
    if (typeof ln.rotation === "number") el.rotation = ln.rotation;
    if (typeof ln.sfx === "string") el.sfx = ln.sfx;
    if (typeof ln.sfxFile === "string") el.sfxFile = ln.sfxFile;
    if (typeof ln.sfxOffset === "number") el.sfxOffset = ln.sfxOffset;
  }

  for (const element of preset.elements) {
    if (element.sfx === "custom") {
      const validFile = typeof element.sfxFile === "string" && listCustomSfx().some(
        (file) => file.name === element.sfxFile,
      );
      if (!validFile) {
        return res.status(400).json({
          error: "Custom SFX tidak ditemukan. Upload atau pilih file yang tersedia.",
        });
      }
    }
  }

  // Audio defaults
  const audioCfg = audio || {
    sfxEnabled: true,
    padEnabled: true,
    sfxVolume: 0.7,
    padVolume: 0.4,
  };

  renderBusy = true;

  // Create isolated input props for this render. The renderer source is never overwritten.
  mkdirSync(JOBS_DIR, { recursive: true });
  const jobId = `${Date.now()}-${(name || "broll").replace(/[^a-zA-Z0-9-_]/g, "-")}`;
  const jobPath = join(JOBS_DIR, `${jobId}.json`);
  const job = {
    project: legacyPresetToMotionProject(preset, {
      id: jobId,
      title: preset.name || "Broll Studio Scene",
    }),
    audio: audioCfg,
  };
  writeFileSync(jobPath, JSON.stringify({ job }, null, 2));

  // Output filename
  const safeName = (name || "broll").replace(/[^a-zA-Z0-9-_]/g, "-");
  const outputArg = `out/${safeName}-${Date.now()}.mp4`;

  // Spawn render
  const isWin = process.platform === "win32";
  const remotionBin = isWin
    ? "node_modules\\.bin\\remotion.cmd"
    : "node_modules/.bin/remotion";

  const proc = spawn(
    remotionBin,
    ["render", "src/index.ts", "Broll", outputArg, "--props", jobPath, "--concurrency", "1"],
    { cwd: ROOT, shell: isWin }
  );

  let stderr = "";
  proc.stderr.on("data", (d) => { stderr += d.toString(); });
  proc.stdout.on("data", () => {});

  proc.on("error", (error) => {
    renderBusy = false;
    if (!res.headersSent) {
      res.status(500).json({ error: `Tidak bisa memulai renderer: ${error.message}` });
    }
  });

  proc.on("close", (code) => {
    renderBusy = false;
    if (code === 0) {
      const filename = outputArg.replace(/^out\//, "");
      res.json({ ok: true, url: `/out/${filename}` });
    } else {
      res.status(500).json({ error: "render failed", code, stderr });
    }
  });
});

// ─── GET /motion-projects ───
app.get("/motion-projects", (req, res) => {
  const projects = readdirSync(PRESETS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ file, data: JSON.parse(readFileSync(join(PRESETS_DIR, file), "utf8")) }))
    .filter(({ data }) => data.schemaVersion === "1.0" && Array.isArray(data.scenes))
    .map(({ file, data }) => ({ id: file.replace(/\.json$/, ""), title: data.title, project: data }));
  res.json({ projects });
});

// ─── POST /plan ───
// Local rule-based Story Planner. Future LLM planner returns the same MotionProject shape.
app.post("/plan", (req, res) => {
  const { script, title } = req.body || {};
  if (typeof script !== "string" || script.trim().length < 8) {
    return res.status(400).json({ error: "Masukkan script minimal satu kalimat." });
  }
  res.json({ project: planScript(script, typeof title === "string" ? title : "AI Tutorial") });
});

// ─── POST /render-project ───
app.post("/render-project", (req, res) => {
  const { project, audio, name } = req.body || {};
  if (!project || project.schemaVersion !== "1.0" || !Array.isArray(project.scenes)) {
    return res.status(400).json({ error: "MotionProject V1 tidak valid." });
  }
  return startMotionRender(res, project, audio, name || project.title);
});

// ─── GET /custom-sfx ───
app.get("/custom-sfx", (req, res) => {
  res.json({ files: listCustomSfx() });
});

// ─── POST /custom-sfx ───
// Upload 1 custom WAV/MP3/OGG/M4A/FLAC (max 25 MB).
app.post("/custom-sfx", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "Pilih file .wav, .mp3, .ogg, .m4a, atau .flac (maks. 25 MB).",
    });
  }
  res.status(201).json({ file: { name: req.file.filename, label: req.file.originalname } });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload gagal: ${error.message}` });
  }
  if (error) {
    return res.status(400).json({ error: error.message || "Upload gagal" });
  }
  next();
});

// ─── GET /presets ───
app.get("/presets", async (req, res) => {
  const { readdirSync, readFileSync } = await import("node:fs");
  const files = readdirSync(PRESETS_DIR).filter((f) => f.endsWith(".json"));
  const presets = files
    .map((f) => ({ file: f, data: JSON.parse(readFileSync(join(PRESETS_DIR, f), "utf8")) }))
    .filter(({ data }) => Array.isArray(data.elements))
    .map(({ file: f, data: p }) => ({
      id: f.replace(".json", ""),
      name: p.name,
      description: p.description,
      elements: p.elements.map((e, i) => ({ 
        index: i,
        text: e.text,
        font: e.font,
        anim: e.anim,
        x: e.x,
        y: e.y,
        fontSize: e.fontSize,
        rotation: e.rotation,
        sfx: e.sfx,
        sfxFile: e.sfxFile,
        sfxOffset: e.sfxOffset,
      })),
    }));
  res.json({ presets });
});

// ─── GET /fonts ───
app.get("/fonts", (req, res) => {
  res.json({
    fonts: [
      { id: "display", label: "Plus Jakarta Sans (Bold sans)" },
      { id: "displayItalic", label: "Plus Jakarta Sans Italic" },
      { id: "sans", label: "Inter (Clean sans)" },
      { id: "classic", label: "Instrument Serif (Italic)" },
      { id: "mono", label: "JetBrains Mono" },
      { id: "script", label: "Great Vibes (Calligraphy)" },
      { id: "playfair", label: "Playfair Display Italic" },
    ],
    anims: [
      { id: "fade", label: "Fade in" },
      { id: "slideUp", label: "Slide up" },
      { id: "slideLeft", label: "Slide from right" },
      { id: "slideRight", label: "Slide from left" },
      { id: "scaleIn", label: "Scale in" },
      { id: "wordPop", label: "Word pop" },
      { id: "reveal", label: "Reveal (slow, for hero)" },
    ],
    sfx: [
      { id: "auto", label: "Auto (from animation)" },
      { id: "whoosh", label: "Whoosh" },
      { id: "impact", label: "Impact (bass hit)" },
      { id: "tick", label: "Tick (click)" },
      { id: "riser", label: "Riser (buildup)" },
      { id: "click", label: "Click" },
      { id: "silent", label: "Silent (no SFX)" },
      { id: "custom", label: "Custom file (dari public/sfx-custom/)" },
    ],
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🎬 Broll API running at http://127.0.0.1:${PORT}`);
});
