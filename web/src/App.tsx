// web/src/App.tsx
// ============================================================
// Broll Studio — UI untuk pilih style, edit text, render MP4.
// ============================================================

import { useEffect, useRef, useState } from "react";

type FontOpt = { id: string; label: string; sample: string };
type AnimOpt = { id: string; label: string };
type SfxOpt = { id: string; label: string };
type CustomSfxFile = { name: string; label: string };
type PresetElement = {
  index: number;
  text: string;
  font: string;
  anim: string;
  x: number;
  y: number;
  fontSize: number;
  rotation?: number;
  sfx?: string;
  sfxFile?: string;
  sfxStart?: number;
};
type Preset = {
  id: string;
  name: string;
  description: string;
  elements: PresetElement[];
};

type LineState = {
  text: string;
  font: string;
  anim: string;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
  sfx: string;
  sfxFile: string;
  sfxStart: number;
};

// Sample font stack for swatch preview
const FONT_SAMPLE: Record<string, string> = {
  display: "'Plus Jakarta Sans', sans-serif",
  displayItalic: "'Plus Jakarta Sans', sans-serif",
  sans: "Inter, sans-serif",
  classic: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', monospace",
  script: "'Great Vibes', cursive",
  playfair: "'Playfair Display', Georgia, serif",
};

const API = "/api";

export default function App() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [fonts, setFonts] = useState<FontOpt[]>([]);
  const [anims, setAnims] = useState<AnimOpt[]>([]);
  const [sfxOptions, setSfxOptions] = useState<SfxOpt[]>([]);
  const [customSfxFiles, setCustomSfxFiles] = useState<CustomSfxFile[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [name, setName] = useState<string>("broll");
  const [lines, setLines] = useState<LineState[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [padEnabled, setPadEnabled] = useState<boolean>(true);
  const [sfxVolume, setSfxVolume] = useState<number>(0.7);
  const [padVolume, setPadVolume] = useState<number>(0.4);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load Google Fonts for live preview
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&family=Inter:wght@400;700;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700;800&family=Great+Vibes&family=Playfair+Display:ital,wght@1,400;1,700;1,900&display=swap";
    document.head.appendChild(link);
  }, []);

  // Load presets + fonts on mount
  useEffect(() => {
    Promise.all([
      fetch(`${API}/presets`).then((r) => r.json()),
      fetch(`${API}/fonts`).then((r) => r.json()),
      fetch(`${API}/custom-sfx`).then((r) => r.json()),
    ]).then(([p, f, c]) => {
      setPresets(p.presets);
      setFonts(f.fonts);
      setAnims(f.anims);
      setSfxOptions(f.sfx || []);
      setCustomSfxFiles(c.files || []);
      if (p.presets.length > 0) selectPreset(p.presets[0]);
    });
  }, []);

  function selectPreset(p: Preset) {
    setSelectedStyle(p.id);
    setLines(
      p.elements.map((el) => ({
        text: el.text,
        font: el.font,
        anim: el.anim,
        x: el.x,
        y: el.y,
        fontSize: el.fontSize,
        rotation: el.rotation ?? 0,
        sfx: el.sfx ?? "auto",
        sfxFile: el.sfxFile ?? "",
        sfxStart: el.sfxStart ?? 0,
      }))
    );
    setVideoUrl(null);
    setError(null);
    setSuccess(null);
    setActiveLine(null);
  }

  function updateLine(idx: number, patch: Partial<LineState>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function moveLine(idx: number, dx: number, dy: number) {
    setLines((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, x: l.x + dx, y: l.y + dy } : l
      )
    );
  }

  function duplicateLine(idx: number) {
    setLines((prev) => {
      const next = [...prev];
      next.splice(idx + 1, 0, { ...prev[idx] });
      return next;
    });
  }

  function deleteLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function addLine() {
    setLines((prev) => [
      ...prev,
      {
        text: "new text",
        font: "sans",
        anim: "fade",
        x: 120,
        y: 500,
        fontSize: 60,
        rotation: 0,
        sfx: "auto",
        sfxFile: "",
        sfxStart: 0,
      },
    ]);
  }

  async function render() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setVideoUrl(null);

    try {
      const res = await fetch(`${API}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          name,
          lines: lines.map((l, idx) => ({
            index: idx,
            text: l.text,
            font: l.font,
            anim: l.anim,
            x: l.x,
            y: l.y,
            fontSize: l.fontSize,
            rotation: l.rotation,
            sfx: l.sfx,
            sfxFile: l.sfxFile,
            sfxStart: l.sfxStart,
          })),
          audio: {
            sfxEnabled,
            padEnabled,
            sfxVolume,
            padVolume,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "render failed");

      setVideoUrl(data.url);
      setSuccess("Render selesai! Preview di kiri, atau download di bawah.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Compute scale for preview canvas (1280x720 → fit container)
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function updateScale() {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      setScale(Math.min(w / 1280, h / 720));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const currentPreset = presets.find((p) => p.id === selectedStyle);

  return (
    <div className="app">
      {/* ─── Left: preview canvas ─── */}
      <div className="preview">
        <div className="preview-frame">
          <div
            ref={canvasRef}
            className="preview-canvas"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="preview-bg" />
            {lines.map((line, idx) => (
              <div
                key={idx}
                className={`preview-text ${activeLine === idx ? "active" : ""}`}
                style={{
                  left: 0,
                  top: 0,
                  fontFamily: FONT_SAMPLE[line.font] || "sans-serif",
                  fontStyle:
                    line.font === "classic" || line.font === "playfair"
                      ? "italic"
                      : "normal",
                  fontSize: line.fontSize,
                  transform: `translate(${line.x}px, ${line.y}px) rotate(${line.rotation}deg)`,
                  transformOrigin: "top left",
                  whiteSpace: "nowrap",
                  lineHeight: 1.0,
                  color: "#F3F0E8",
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                  opacity: line.text ? 1 : 0.3,
                  outline: activeLine === idx ? "1px dashed #A3E635" : "none",
                  outlineOffset: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setActiveLine(idx)}
              >
                {line.text || "—"}
              </div>
            ))}
          </div>
        </div>

        {videoUrl && (
          <div className="video-overlay">
            <video src={videoUrl} controls autoPlay loop />
            <button
              className="video-overlay-close"
              onClick={() => setVideoUrl(null)}
              title="Tutup preview"
            >
              ✕
            </button>
          </div>
        )}

        {loading && (
          <div className="preview-loading">
            <div className="spinner" />
            <div className="loading-text">Rendering...</div>
            <div className="loading-sub">
              6 detik video butuh ~10-20 detik render
            </div>
          </div>
        )}
      </div>

      {/* ─── Right: sidebar ─── */}
      <div className="sidebar">
        <header className="sidebar-header">
          <div className="logo">
            <span className="logo-mark">▶</span>
            <span>Broll Studio</span>
          </div>
          <p className="subtitle">Editorial kinetic typography</p>
        </header>

        {/* Output filename */}
        <div className="field">
          <label>Output filename</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="broll"
          />
        </div>

        {/* Style preset */}
        <div className="field">
          <label>Style</label>
          <div className="style-grid">
            {presets.map((p) => (
              <button
                key={p.id}
                className={`style-btn ${selectedStyle === p.id ? "active" : ""}`}
                onClick={() => selectPreset(p)}
                title={p.description}
              >
                <span className="style-btn-id">{p.id}</span>
                <span className="style-btn-name">{p.name}</span>
              </button>
            ))}
          </div>
          {currentPreset && (
            <p className="preset-desc">{currentPreset.description}</p>
          )}
        </div>

        {/* Audio controls */}
        <div className="section">
          <div className="section-title">Audio</div>
          <div className="audio-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sfxEnabled}
                onChange={(e) => setSfxEnabled(e.target.checked)}
              />
              <span>SFX per element</span>
            </label>
            {sfxEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(Number(e.target.value))}
                className="audio-slider"
                title={`SFX volume ${Math.round(sfxVolume * 100)}%`}
              />
            )}
          </div>
          <div className="audio-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={padEnabled}
                onChange={(e) => setPadEnabled(e.target.checked)}
              />
              <span>Background pad</span>
            </label>
            {padEnabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={padVolume}
                onChange={(e) => setPadVolume(Number(e.target.value))}
                className="audio-slider"
                title={`Pad volume ${Math.round(padVolume * 100)}%`}
              />
            )}
          </div>
        </div>

        {/* Lines editor */}
        <div className="section">
          <div className="section-title-row">
            <div className="section-title">Lines ({lines.length})</div>
            <button className="btn-mini" onClick={addLine} title="Add line">
              + Add
            </button>
          </div>

          <div className="lines-list">
            {lines.map((line, idx) => (
              <div
                className={`line-editor ${activeLine === idx ? "active" : ""}`}
                key={idx}
                onClick={() => setActiveLine(idx)}
              >
                <div className="line-header">
                  <span className="line-index">#{idx}</span>
                  <div className="line-actions">
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLine(idx, 0, -5);
                      }}
                      title="Up 5px"
                    >
                      ↑
                    </button>
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLine(idx, 0, 5);
                      }}
                      title="Down 5px"
                    >
                      ↓
                    </button>
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateLine(idx);
                      }}
                      title="Duplicate"
                    >
                      ⎘
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLine(idx);
                      }}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  className="line-text"
                  value={line.text}
                  onChange={(e) => updateLine(idx, { text: e.target.value })}
                  placeholder="Text"
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="line-grid">
                  <div className="line-field">
                    <label>Font</label>
                    <select
                      value={line.font}
                      onChange={(e) =>
                        updateLine(idx, { font: e.target.value })
                      }
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontFamily: FONT_SAMPLE[line.font] || "sans-serif",
                      }}
                    >
                      {fonts.map((f) => (
                        <option
                          key={f.id}
                          value={f.id}
                          style={{ fontFamily: FONT_SAMPLE[f.id] || "sans-serif" }}
                        >
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="line-field">
                    <label>Animation</label>
                    <select
                      value={line.anim}
                      onChange={(e) =>
                        updateLine(idx, { anim: e.target.value })
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      {anims.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="line-field">
                    <label>SFX</label>
                    <select
                      value={line.sfx}
                      onChange={(e) =>
                        updateLine(idx, { sfx: e.target.value })
                      }
                      onClick={(e) => e.stopPropagation()}
                      title="Pilih suara yang main pas element ini muncul"
                    >
                      {sfxOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="line-field">
                    <label>Size</label>
                    <input
                      type="number"
                      value={line.fontSize}
                      onChange={(e) =>
                        updateLine(idx, { fontSize: Number(e.target.value) })
                      }
                      onClick={(e) => e.stopPropagation()}
                      min="12"
                      max="400"
                    />
                  </div>

                  <div className="line-field">
                    <label>Rotate°</label>
                    <input
                      type="number"
                      value={line.rotation}
                      step="0.5"
                      onChange={(e) =>
                        updateLine(idx, { rotation: Number(e.target.value) })
                      }
                      onClick={(e) => e.stopPropagation()}
                      min="-10"
                      max="10"
                    />
                  </div>

                  <div className="line-field span2">
                    <label>Position X / Y</label>
                    <div className="pos-input">
                      <input
                        type="number"
                        value={line.x}
                        onChange={(e) =>
                          updateLine(idx, { x: Number(e.target.value) })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>,</span>
                      <input
                        type="number"
                        value={line.y}
                        onChange={(e) =>
                          updateLine(idx, { y: Number(e.target.value) })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {line.sfx === "custom" && (
                    <div className="line-field span2">
                      <label>Custom SFX file</label>
                      {customSfxFiles.length > 0 ? (
                        <select
                          value={line.sfxFile}
                          onChange={(e) =>
                            updateLine(idx, { sfxFile: e.target.value })
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">— pilih file —</option>
                          {customSfxFiles.map((f) => (
                            <option key={f.name} value={f.name}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="hint">
                          Taruh file audio di <code>public/sfx-custom/</code>,
                          kemudian refresh halaman.
                          <br />
                          Format: .wav, .mp3, .ogg, .m4a
                        </div>
                      )}
                    </div>
                  )}

                  {line.sfx === "custom" && line.sfxFile && (
                    <div className="line-field">
                      <label>Start offset (s)</label>
                      <input
                        type="number"
                        value={line.sfxStart}
                        step="0.1"
                        min="0"
                        onChange={(e) =>
                          updateLine(idx, {
                            sfxStart: Number(e.target.value),
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          disabled={loading || lines.length === 0}
          onClick={render}
        >
          {loading ? (
            <>
              <span className="btn-spinner" /> Rendering...
            </>
          ) : (
            <>▶ Generate MP4</>
          )}
        </button>

        {videoUrl && (
          <a href={videoUrl} download className="btn btn-secondary">
            ⬇ Download MP4
          </a>
        )}

        {error && <div className="status error">❌ {error}</div>}
        {success && <div className="status success">✓ {success}</div>}
      </div>
    </div>
  );
}
