import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import "./background-controls.css";
import "./simple-ui.css";
import "./brand-ui.css";
import AppleMotionPreview from "./AppleMotionPreview";

type Clip = { id: string; kind: string; at: number; durationFrames: number; enter?: { preset: string; durationFrames: number }; props: Record<string, any> };
type Layer = { id: string; zIndex: number; clips: Clip[] };
type Scene = { id: string; durationFrames: number; background?: string; layers: Layer[] };
type Project = { schemaVersion: "1.0"; id: string; title: string; format: { width: number; height: number; fps: number; background: string }; tokens: any; assets: Record<string, any>; scenes: Scene[] };
type AudioSettings = { sfxEnabled: boolean; padEnabled: boolean; sfxVolume: number; padVolume: number };

const API = "/api";
const FPS = 30;
const componentOptions = [
  ["apple.motion", "Apple Motion · Semua Variasi"],
    ["apple.iconFootage", "Apple Motion · Footage Ikon"],
  ["typography.headline", "Kinetic Title"], ["typography.body", "Body Text"], ["typography.label", "Mono Label"],
  ["chart.metric", "Big Number"], ["chart.comparison", "Comparison"], ["chart.bar", "Bar Chart"], ["chart.counter", "Counter"],
  ["ui.browser", "Browser Window"], ["ui.appGrid", "App Grid"], ["ui.notification", "Notification"], ["ui.checklist", "Checklist"], ["ui.progress", "Progress Bar"], ["ui.terminal", "Terminal Typing"], ["ui.cursor", "Cursor Click"],
  ["ui.offerDashboard", "Free Offer Dashboard"],
  ["ui.paymentCollision", "GoPay + BCA Collision"],
  ["ui.pricingDashboard", "Pricing: Go + Plus + Business"],
  ["infographic.preset", "Infographic · Circular / Vertical"],
  ["ui.paymentWarning", "Payment Warning · Italic"],
  ["chart.exchangeRate", "USD / IDR Exchange Chart"],
  ["workflow.flow", "Workflow Flow"], ["callout.pointer", "Callout"], ["effect.spotlight", "Spotlight"], ["device.frame", "Device Frame"], ["media.image", "Image"], ["media.video", "Video"], ["icon", "Icon"],
] as const;

const emptyProject = (): Project => ({ schemaVersion: "1.0", id: "new-project", title: "New Motion Project", format: { width: 1280, height: 720, fps: FPS, background: "#1E293B" }, tokens: { colors: { ink: "#1E293B", paper: "#FFFFFF", lime: "#10B981", blue: "#2563EB", light: "#F8FAFC" }, fonts: { display: "display", sans: "sans", mono: "mono" }, spacing: { page: 80, gap: 24 } }, assets: {}, scenes: [] });

const textBrollProject = (): Project => ({ schemaVersion: "1.0", id: "text-remotion", title: "Text Remotion", format: { width: 1280, height: 720, fps: FPS, background: "#1E293B" }, tokens: { colors: { ink: "#1E293B", paper: "#FFFFFF", lime: "#10B981", blue: "#2563EB", light: "#F8FAFC" }, fonts: { display: "display", sans: "sans", mono: "mono", classic: "classic" }, spacing: { page: 80, gap: 24 } }, assets: {}, scenes: [{ id: "text-scene", durationFrames: 105, layers: [{ id: "text-visuals", zIndex: 10, clips: [{ id: "text-label", kind: "typography.label", at: 0, durationFrames: 90, enter: { preset: "fade", durationFrames: 8 }, props: { text: "TEXT REMOTION", layout: { position: [84, 82] }, font: "mono", fontSize: 19, letterSpacing: 0.08, opacity: 0.72 } }, { id: "text-headline", kind: "typography.headline", at: 8, durationFrames: 92, enter: { preset: "slideUp", durationFrames: 18 }, props: { text: "TULIS PESAN\nKAMU DI SINI.", layout: { position: [80, 170] }, font: "display", fontSize: 82, fontWeight: 800, letterSpacing: -0.06, maxWidth: 900 } }] }] }] });

const calligraphyOverlayProject = (): Project => ({ schemaVersion: "1.0", id: "calligraphy-overlay-local", title: "Calligraphy Overlay — CapCut", format: { width: 1920, height: 864, fps: FPS, background: "#1E293B" }, tokens: { colors: { ink: "#1E293B", paper: "#FFFFFF", accent: "#2563EB", lime: "#10B981", light: "#F8FAFC" }, fonts: { display: "display", sans: "sans", script: "script" }, spacing: { page: 120, gap: 18 } }, assets: {}, scenes: [{ id: "calligraphy-main", durationFrames: 120, layers: [{ id: "calligraphy-type", zIndex: 10, clips: [{ id: "small-context", kind: "typography.label", at: 0, durationFrames: 108, enter: { preset: "reveal", durationFrames: 12 }, props: { text: "PEMBAYARAN", layout: { position: [670, 255] }, font: "sans", fontSize: 29, fontWeight: 700, letterSpacing: 0.22, color: "@colors.paper", maxWidth: 520, sfx: "silent" } }, { id: "calligraphy-word", kind: "typography.headline", at: 7, durationFrames: 106, enter: { preset: "reveal", durationFrames: 20 }, props: { text: "ditolak", layout: { position: [630, 270] }, font: "script", fontSize: 205, fontWeight: 400, letterSpacing: -0.045, color: "@colors.paper", rotation: -4, maxWidth: 760, sfx: "whoosh" } }, { id: "method-detail", kind: "typography.label", at: 22, durationFrames: 90, enter: { preset: "slideLeft", durationFrames: 14 }, props: { text: "LEWAT GOPAY", layout: { position: [1090, 505] }, font: "sans", fontSize: 25, fontWeight: 700, letterSpacing: 0.19, color: "@colors.paper", maxWidth: 430, sfx: "click" } }] }] }] });

function safeId(value: string, fallback: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || fallback; }
function clipDefaults(kind: string, number: number): Clip {
  const id = `${kind.replace(".", "-")}-${number}`;
  const base = { id, kind, at: 0, durationFrames: 90, enter: { preset: "slideUp", durationFrames: 15 } };
  if (kind === "apple.iconFootage") return { ...base, durationFrames: 150, props: { icon: "microchip", motion: "orbit", title: "GPU SIAP BEKERJA.", subtitle: "Ikon animasi siap digunakan sebagai footage.", primary: "#10B981", background: "#050506", iconSize: 150, audioEnabled: true } };
    if (kind === "apple.motion") return { ...base, durationFrames: 120, props: { variant: "dark-stage", title: "Dirancang untuk langkah berikutnya.", subtitle: "Ide kuat yang disampaikan dengan jelas.", primary: "#10B981", background: "#050506", value: "Lanjutkan", secondaryValue: "+18,4%", labels: ["Ringkasan", "Detail", "Wawasan"], items: [{ label: "Temukan", value: "42%", detail: "Aktif" }, { label: "Rancang", value: "67%" }, { label: "Bangun", value: "91%" }], audioEnabled: true } };
  if (kind.startsWith("typography.")) return { ...base, props: { text: "NEW MESSAGE", layout: { position: [90, 120] }, font: "display", fontSize: 56, fontWeight: 800, letterSpacing: -0.05 } };
  if (kind === "chart.metric") return { ...base, props: { position: [100, 180], value: "98%", label: "RESULT" } };
  if (kind === "chart.comparison") return { ...base, props: { position: [120, 230], width: 1000, left: { label: "BEFORE", value: "MANUAL" }, right: { label: "AFTER", value: "AUTOMATED" } } };
  if (kind === "chart.bar") return { ...base, props: { position: [140, 180], title: "RESULTS", items: [{ label: "Before", value: 20 }, { label: "After", value: 80, accent: true }] } };
  if (kind === "chart.counter") return { ...base, props: { position: [120, 200], to: 98, suffix: "%", label: "COMPLETE" } };
  if (kind === "ui.browser") return { ...base, props: { title: "App Settings", subtitle: "app.local / settings", layout: { position: [150, 130], width: 850, height: 470 }, sections: [{ label: "Setting", value: "Enabled", active: true }] } };
  if (kind === "ui.appGrid") return { ...base, props: { layout: { position: [100, 160], width: 1080 }, title: "FEATURES", items: [{ label: "Voice" }, { label: "Canvas" }, { label: "Agent", accent: true }] } };
  if (kind === "ui.notification") return { ...base, props: { layout: { position: [350, 420], width: 440 }, title: "Success", body: "Your action is complete.", tone: "success" } };
  if (kind === "ui.checklist") return { ...base, props: { layout: { position: [110, 250], width: 650 }, items: ["First step", "Second step", "Final step"] } };
  if (kind === "ui.progress") return { ...base, props: { layout: { position: [120, 300], width: 650 }, label: "Progress", value: 75 } };
  if (kind === "ui.terminal") return { ...base, props: { layout: { position: [160, 160], width: 700, height: 260 }, lines: ["> initialize workflow", "✓ ready"] } };
  if (kind === "ui.cursor") return { ...base, props: { position: [700, 350], click: true } };
  if (kind === "ui.offerDashboard") return { ...base, durationFrames: 120, props: { greeting: "Ready to dive in?", offerTitle: "FREE OFFER", offerBody: "Claim your complimentary access before it expires.", buttonLabel: "Claim now", accent: "#10B981", cardPosition: [555, 655], audioEnabled: true } };
  if (kind === "ui.paymentCollision") return { ...base, durationFrames: 135, props: { gopayAsset: "uploads/gopay.jfif", bcaAsset: "uploads/bca.jfif", background: "#1E293B", audioEnabled: true } };
  if (kind === "ui.pricingDashboard") return { ...base, durationFrames: 135, props: { goPrice: "Rp75.000", plusPrice: "Rp349.000", businessPrice: "$25", audioEnabled: true } };
  if (kind === "infographic.preset") return { ...base, durationFrames: 135, props: { variant: "circular", title: "RINGKASAN DATA", centerLabel: "TOTAL", background: "#1E293B", items: [{ label: "Akses", value: 72, detail: "lebih cepat" }, { label: "Biaya", value: 48, detail: "lebih hemat" }, { label: "Hasil", value: 86, detail: "lebih optimal" }] } };
  if (kind === "ui.paymentWarning") return { ...base, durationFrames: 120, props: { eyebrow: "PEMBAYARAN", italicWord: "ditolak", message: "Metode pembayaran belum dapat diproses", audioEnabled: true } };
  if (kind === "chart.exchangeRate") return { ...base, durationFrames: 180, props: { rate: 17752, currency: "USD / IDR", period: "TREN JANGKA PANJANG", audioEnabled: true } };
  if (kind === "workflow.flow") return { ...base, props: { position: [110, 250], width: 1050, nodes: [{ id: "input", label: "Input" }, { id: "process", label: "Process" }, { id: "output", label: "Output", tone: "#10B981" }] } };
  if (kind === "callout.pointer") return { ...base, props: { position: [760, 300], text: "Explain this action", side: "left" } };
  if (kind === "effect.spotlight") return { ...base, props: { rect: [150, 220, 700, 180], dimOpacity: 0.6 } };
  if (kind === "device.frame") return { ...base, props: { position: [820, 70], width: 310, height: 560, title: "Mobile App", frame: "phone" } };
  if (kind === "media.image" || kind === "media.video") return { ...base, props: { asset: "", layout: { position: [120, 100], width: 680, height: 440 }, fit: "cover", overlay: 0.2, radius: 8 } };
  return { ...base, props: { position: [120, 120], name: "sparkles", size: 80, color: "#10B981" } };
}

export default function App() {
  const [projects, setProjects] = useState<Array<{ id: string; title: string; project: Project }>>([]);
  const [project, setProject] = useState<Project>(emptyProject());
  const [sceneIndex, setSceneIndex] = useState(0);
  const [clipId, setClipId] = useState<string | null>(null);
  const [tab, setTab] = useState<"builder" | "planner">("builder");
  const [script, setScript] = useState("Give me 28 minutes and I will show you how to make ChatGPT work like your assistant. Most people only use 2% of what it can do. Go to Settings and enable Custom Instructions. Then create a workflow that remembers your context. The result is a system that saves time.");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [audio, setAudio] = useState<AudioSettings>({ sfxEnabled: true, padEnabled: true, sfxVolume: 0.7, padVolume: 0.35 });
  const [uploading, setUploading] = useState(false);
  const [accentWord, setAccentWord] = useState("");
  const [accentFont, setAccentFont] = useState<"Great Vibes" | "Instrument Serif italic">("Great Vibes");
  const [accentColor, setAccentColor] = useState<"Lime" | "Cream" | "Blue">("Lime");
  const [highlightWord, setHighlightWord] = useState("");
  const [highlightColor, setHighlightColor] = useState<"Yellow" | "Lime" | "Blue">("Yellow");
  const [advancedVisuals, setAdvancedVisuals] = useState(false);

  async function loadProjects() {
    const res = await fetch(`${API}/motion-projects`);
    const data = await res.json();
    setProjects(data.projects || []);
    if (data.projects?.[0]) loadProject(data.projects[0].project);
  }
  useEffect(() => { loadProjects().catch((e) => setError(e.message)); }, []);

  const selectedScene = project.scenes[sceneIndex];
  const selectedClip = selectedScene?.layers.flatMap((layer) => layer.clips).find((item) => item.id === clipId) ?? null;
  const projectDuration = project.scenes.reduce((sum, scene) => sum + scene.durationFrames, 0);
  const hasFullDashboard = project.scenes.some((scene) => scene.layers.some((layer) => layer.clips.some((clip) => clip.kind === "ui.offerDashboard" || clip.kind === "ui.pricingDashboard")));
  const backgroundMode = project.format.background.toUpperCase() === "#00FF00" ? "chroma" : "brand";

  function loadProject(next: Project) { const cloned = structuredClone(next); if (!advancedVisuals && cloned.format.background.toUpperCase() === "#00FF00") { cloned.format.background = "#1E293B"; cloned.scenes.forEach((scene) => { scene.background = "#1E293B"; scene.layers.forEach((layer) => layer.clips.forEach((clip) => { if (clip.kind === "ui.paymentCollision" || clip.kind === "infographic.preset") clip.props.background = "#1E293B"; })); }); } const firstClip = cloned.scenes[0]?.layers.flatMap((layer) => layer.clips)[0]; setProject(cloned); setSceneIndex(0); setClipId(firstClip?.id ?? null); setVideoUrl(null); setStatus(null); }
  function updateProject(updater: (current: Project) => Project) { setProject((current) => updater(structuredClone(current))); }
  function setBackgroundMode(mode: "brand" | "chroma") {
    const background = mode === "chroma" ? "#00FF00" : "#1E293B";
    updateProject((current) => {
      current.format.background = background;
      current.scenes.forEach((scene) => {
        scene.background = background;
        scene.layers.forEach((layer) => layer.clips.forEach((clip) => {
          if (clip.kind === "ui.paymentCollision" || clip.kind === "infographic.preset") clip.props.background = background;
        }));
      });
      return current;
    });
    setStatus(mode === "chroma" ? "Chroma green aktif. Hindari lime pada objek yang akan di-key." : "Background kembali ke Dark Navy brand.");
  }
  function updateSelectedClip(patch: Partial<Clip>) {
    if (!selectedClip) return;
    updateProject((current) => { const target = current.scenes[sceneIndex].layers.flatMap((layer) => layer.clips).find((item) => item.id === selectedClip.id); if (target) Object.assign(target, patch); return current; });
  }
  function updateSelectedProp(key: string, value: unknown) { if (selectedClip) updateSelectedClip({props: {...selectedClip.props, [key]: value}}); }
  function addScene() {
    const nextSceneIndex = project.scenes.length;
    updateProject((current) => { const index = current.scenes.length + 1; current.scenes.push({ id: `scene-${index}`, durationFrames: 120, layers: [{ id: `scene-${index}-visuals`, zIndex: 10, clips: [] }] }); return current; });
    setSceneIndex(nextSceneIndex); setClipId(null);
  }
  function deleteScene(index: number) { updateProject((current) => { if (current.scenes.length > 1) current.scenes.splice(index, 1); return current; }); setSceneIndex(Math.max(0, sceneIndex - (index <= sceneIndex ? 1 : 0))); setClipId(null); }
  function addClip(kind: string) {
    if (!selectedScene) return;
    const mediaAsset = kind === "media.image" || kind === "media.video" ? projectAssets.find((asset) => asset.type === (kind === "media.image" ? "image" : "video")) : undefined;
    if ((kind === "media.image" || kind === "media.video") && !mediaAsset) {
      setError(`Upload ${kind === "media.image" ? "image" : "video"} terlebih dahulu sebelum menambah component ini.`);
      return;
    }
    updateProject((current) => { const scene = current.scenes[sceneIndex]; const layer = scene.layers[0]; const newClip = clipDefaults(kind, layer.clips.length + 1); if (mediaAsset) newClip.props.asset = mediaAsset.id; layer.clips.push(newClip); setClipId(newClip.id); return current; });
  }
  function deleteClip(id: string) { updateProject((current) => { current.scenes[sceneIndex].layers.forEach((layer) => { layer.clips = layer.clips.filter((item) => item.id !== id); }); return current; }); setClipId(null); }
  function updatePropsJson(value: string) { if (!selectedClip) return; try { updateSelectedClip({ props: JSON.parse(value) }); setError(null); } catch { setError("Props harus JSON valid."); } }
  const projectAssets = Object.entries(project.assets).map(([id, asset]: [string, any]) => ({ id, ...asset })) as Array<{ id: string; type: "image" | "video"; src: string; label: string }>;

  async function uploadAsset(file: File) {
    setUploading(true); setError(null); setStatus(null);
    try {
      const form = new FormData(); form.append("file", file);
      const res = await fetch(`${API}/motion-assets`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload asset gagal");
      const asset = data.asset;
      updateProject((current) => ({ ...current, assets: { ...current.assets, [asset.id]: asset } }));
      setStatus(`${asset.label || file.name} siap digunakan dalam template.`);
    } catch (e: any) { setError(e.message); }
    finally { setUploading(false); }
  }

  function applyTemplate(template: "footage" | "portrait" | "object") {
    const asset = projectAssets.find((item) => item.type === "image" || item.type === "video");
    if (!selectedScene) return;
    if (!asset) { setError("Upload Footage / Image terlebih dahulu untuk menggunakan template editorial."); return; }
    let selectedId = "";
    updateProject((current) => {
      const scene = current.scenes[sceneIndex]; const layer = scene.layers[0]; const n = layer.clips.length + 1;
      const media: Clip = { id: `media-${template}-${n}`, kind: asset.type === "video" ? "media.video" : "media.image", at: 0, durationFrames: scene.durationFrames, props: { asset: asset.id, layout: { position: template === "portrait" ? [90, 82] : template === "object" ? [700, 90] : [0, 0], width: template === "portrait" ? 390 : template === "object" ? 500 : 1280, height: template === "portrait" ? 560 : template === "object" ? 540 : 720 }, fit: "cover", overlay: template === "footage" ? 0.48 : 0.16, radius: template === "portrait" ? 0 : 4 } };
      const headline: Clip = { id: `headline-${template}-${n}`, kind: "typography.headline", at: 8, durationFrames: scene.durationFrames - 8, enter: { preset: "slideUp", durationFrames: 15 }, props: { text: template === "footage" ? "MAKE THE FRAME\nMATTER." : template === "portrait" ? "A QUIETER\nKIND OF BOLD." : "FORM FOLLOWS\nFEELING.", layout: { position: template === "portrait" ? [550, 190] : template === "object" ? [100, 190] : [92, 155] }, font: "display", fontSize: template === "portrait" ? 50 : 68, fontWeight: 800, color: "@colors.paper", maxWidth: template === "portrait" ? 580 : 720 } };
      const accent: Clip = { id: `accent-${template}-${n}`, kind: "typography.headline", at: 22, durationFrames: scene.durationFrames - 22, enter: { preset: "slideUp", durationFrames: 15 }, props: { text: template === "footage" ? "beautifully" : template === "portrait" ? "unhurried" : "object", layout: { position: template === "portrait" ? [565, 340] : template === "object" ? [115, 380] : [108, 345] }, font: "script", fontStyle: "italic", fontSize: 72, color: template === "object" ? "@colors.paper" : "@colors.lime", editorialAccentFor: headline.id } };
      layer.clips.push(media, headline, accent); selectedId = headline.id; return current;
    });
    setClipId(selectedId); setStatus("Editorial template added. Adjust its headline and accent in the inspector.");
  }

  function applyAccent() {
    if (!selectedClip || selectedClip.kind !== "typography.headline") return;
    if (!accentWord.trim()) { setError("Masukkan Accent word terlebih dahulu."); return; }
    const colors = { Lime: "@colors.lime", Cream: "@colors.paper", Blue: "#2563EB" };
    let accentId = "";
    updateProject((current) => {
      const layer = current.scenes[sceneIndex].layers[0];
      const existing = layer.clips.find((clip) => clip.kind === "typography.headline" && clip.props.editorialAccentFor === selectedClip.id);
      const titleFontSize = Number(selectedClip.props.fontSize || 56);
      const titleMaxWidth = Number(selectedClip.props.maxWidth || 900);
      const charactersPerLine = Math.max(10, Math.floor(titleMaxWidth / (titleFontSize * 0.56)));
      const estimatedLines = Math.max(1, Math.ceil(String(selectedClip.props.text || "").length / charactersPerLine));
      const x = Number(selectedClip.props.layout?.position?.[0] || 90);
      const y = Number(selectedClip.props.layout?.position?.[1] || 120) + titleFontSize * (estimatedLines * 0.94 + 0.24);
      const { highlight: _highlight, ...headlineProps } = selectedClip.props;
      const props = { text: accentWord.trim(), layout: { position: [x + 8, y] }, font: accentFont === "Great Vibes" ? "script" : "classic", fontStyle: "italic", fontSize: Math.min(82, Math.max(46, titleFontSize * 0.92)), color: colors[accentColor], editorialAccentFor: selectedClip.id };
      const title = layer.clips.find((clip) => clip.id === selectedClip.id);
      if (title) title.props = headlineProps;
      if (existing) { existing.props = props; accentId = existing.id; } else { const created: Clip = { id: `accent-${safeId(selectedClip.id, "headline")}`, kind: "typography.headline", at: selectedClip.at + 8, durationFrames: Math.max(30, selectedClip.durationFrames - 8), enter: { preset: "slideUp", durationFrames: 15 }, props }; layer.clips.push(created); accentId = created.id; }
      return current;
    });
    setClipId(accentId); setStatus("Script italic diterapkan. Marker highlight pada headline ini dihapus agar tidak bertabrakan.");
  }

  function applyHighlight() {
    if (!selectedClip || !selectedClip.kind.startsWith("typography.")) return;
    const word = highlightWord.trim();
    if (!word) { setError("Masukkan satu kata yang ingin diberi stabilo."); return; }
    if (!String(selectedClip.props.text || "").toLowerCase().includes(word.toLowerCase())) { setError("Kata stabilo harus ada di dalam Text component ini."); return; }
    const colors = { Yellow: "#FFFFFF", Lime: "#10B981", Blue: "#2563EB" };
    updateProject((current) => {
      const layer = current.scenes[sceneIndex].layers[0];
      layer.clips = layer.clips.filter((clip) => clip.props.editorialAccentFor !== selectedClip.id);
      const title = layer.clips.find((clip) => clip.id === selectedClip.id);
      if (title) title.props = { ...title.props, highlight: { word, color: colors[highlightColor] } };
      return current;
    });
    setStatus("Marker highlight diterapkan. Script italic pada headline ini dihapus agar tidak bertabrakan.");
  }

  async function makePlan() {
    setLoading(true); setError(null); setStatus(null);
    try { const res = await fetch(`${API}/plan`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ script, title: project.title || "AI Tutorial" }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Planner gagal"); loadProject(data.project); setTab("builder"); setStatus("Visual plan dibuat. Review scene sebelum render."); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }
  async function renderProject() {
    setLoading(true); setError(null); setStatus(null); setVideoUrl(null);
    try { const res = await fetch(`${API}/render-project`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ project, audio, name: project.id }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Render gagal"); setVideoUrl(data.url); setStatus("Render selesai. Putar atau download video di kiri."); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return <div className={`motion-app ${advancedVisuals ? "advanced-mode" : "simple-mode"}`}>
    <aside className="motion-nav">
      <div className="motion-brand"><span>▶</span><div><strong>Motion Engine</strong><small>ZAID PRD V2</small></div></div>
      <div className="nav-section">PILIH PRESET</div>
      {projects.map((item) => <button key={item.id} className={`project-item ${project.id === item.project.id ? "active" : ""}`} onClick={() => { loadProject(item.project); setTab("builder"); }}>{item.title.replace(/^B-roll \d+ — /, "")}</button>)}
      <button className="project-item advanced-toggle" onClick={() => setAdvancedVisuals((value) => !value)}>{advancedVisuals ? "← Mode mudah" : "⚙ Advanced"}</button>
      {advancedVisuals && <><button className={`nav-tab ${tab === "builder" ? "active" : ""}`} onClick={() => setTab("builder")}>Scene Builder</button><button className={`nav-tab ${tab === "planner" ? "active" : ""}`} onClick={() => setTab("planner")}>Script Planner</button><button className="project-item add" onClick={() => loadProject(emptyProject())}>+ Project kosong</button></>}
      <div className="nav-footer">{project.scenes.length} scenes · {(projectDuration / FPS).toFixed(1)}s</div>
    </aside>

    <main className="motion-main">
      <header className="motion-header"><div><input className="project-title" value={project.title} onChange={(e) => updateProject((p) => ({ ...p, title: e.target.value, id: safeId(e.target.value, p.id) }))} /><span>{project.format.width}×{project.format.height} · {project.format.fps}fps</span></div><button className="render-button" disabled={loading || !project.scenes.length} onClick={renderProject}>{loading ? "Rendering…" : "▶ Render MP4"}</button></header>
      {tab === "planner" ? <section className="planner-panel"><div className="planner-copy"><span>LOCAL STORY PLANNER</span><h1>Script → Visual Plan</h1><p>Planner memilih template Hook, Browser Demo, Workflow, Feature Grid, Comparison, dan Conclusion secara rule-based. Tidak memakai API atau model AI eksternal.</p></div><textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Paste script video Anda di sini…" /><button className="planner-button" disabled={loading} onClick={makePlan}>✦ Buat Visual Plan</button><div className="planner-hint">Setelah jadi, Anda dapat review dan edit tiap Scene serta Component pada Scene Builder.</div></section> : <section className="builder-panel">
        <div className="scene-rail"><div className="section-head">SCENES <button onClick={addScene}>+ Add</button></div>{project.scenes.map((scene, index) => <div className={`scene-card ${index === sceneIndex ? "active" : ""}`} key={scene.id} onClick={() => { setSceneIndex(index); setClipId(null); }}><div><b>{String(index + 1).padStart(2, "0")}</b><strong>{scene.id.replace(/-/g, " ")}</strong><small>{(scene.durationFrames / FPS).toFixed(1)} sec · {scene.layers.flatMap((layer) => layer.clips).length} clips</small></div>{project.scenes.length > 1 && <button onClick={(e) => { e.stopPropagation(); deleteScene(index); }}>×</button>}</div>)}</div>
        <div className="stage"><div className="stage-canvas"><div className="stage-label">{selectedScene ? selectedScene.id : "No scene"}</div><div className="stage-preview" aria-hidden="true">{selectedScene?.layers.flatMap((layer) => layer.clips).filter((clip) => clip.kind === "apple.motion" || clip.kind === "apple.iconFootage").map((clip) => <AppleMotionPreview key={`apple-preview-${clip.id}`} props={clip.kind === "apple.iconFootage" ? {...clip.props, variant: "icon-footage"} : clip.props} />)}{selectedScene?.layers.flatMap((layer) => layer.clips).filter((clip) => clip.kind === "media.image" || clip.kind === "media.video").map((clip) => { const asset = project.assets[clip.props.asset]; return asset?.src ? <div className="preview-media" key={`preview-${clip.id}`} style={{ left: `${(clip.props.layout?.position?.[0] || 0) / 1280 * 100}%`, top: `${(clip.props.layout?.position?.[1] || 0) / 720 * 100}%`, width: `${(clip.props.layout?.width || 1280) / 1280 * 100}%`, height: `${(clip.props.layout?.height || 720) / 720 * 100}%`, opacity: clip.props.opacity ?? 1 }}><img src={asset.src} alt="" /></div> : null; })}{selectedScene?.layers.flatMap((layer) => layer.clips).filter((clip) => clip.kind === "typography.headline").map((clip) => <div key={`type-${clip.id}`} className={`preview-type ${clip.props.font === "script" ? "script" : ""}`} style={{ left: `${(clip.props.layout?.position?.[0] || 90) / 1280 * 100}%`, top: `${(clip.props.layout?.position?.[1] || 120) / 720 * 100}%`, color: clip.props.color === "@colors.lime" ? "var(--lime)" : clip.props.color === "@colors.paper" ? "var(--cream)" : clip.props.color || "var(--cream)", fontSize: `${Math.min(9, Math.max(2.5, (clip.props.fontSize || 56) / 12))}vw`, maxWidth: `${(clip.props.maxWidth || 720) / 1280 * 100}%` }}>{clip.props.text}</div>)}</div>{selectedScene?.layers.flatMap((layer) => layer.clips).map((clip) => <button key={clip.id} className={`stage-clip ${clipId === clip.id ? "selected" : ""}`} style={{ left: `${Math.min(76, 8 + clip.at / selectedScene.durationFrames * 70)}%`, top: `${Math.min(82, 18 + (clip.props.layout?.position?.[1] || clip.props.position?.[1] || 0) / 720 * 58)}%` }} onClick={() => setClipId(clip.id)}>{clip.kind}</button>)}</div>{videoUrl && <div className="render-preview"><video src={videoUrl} controls autoPlay loop /><a href={videoUrl} download>⬇ Download MP4</a></div>}</div>
        <div className="timeline"><div className="timeline-title">TIMELINE · {selectedScene ? (selectedScene.durationFrames / FPS).toFixed(1) : 0}s</div>{selectedScene?.layers.flatMap((layer) => layer.clips).map((clip) => <button key={clip.id} className={`timeline-clip ${clipId === clip.id ? "selected" : ""}`} style={{ marginLeft: `${clip.at / selectedScene.durationFrames * 100}%`, width: `${Math.max(10, clip.durationFrames / selectedScene.durationFrames * 100)}%` }} onClick={() => setClipId(clip.id)}>{clip.kind}</button>)}</div>
      </section>}
      {status && <div className="motion-status success">✓ {status}</div>}{error && <div className="motion-status error">⚠ {error}</div>}
    </main>

    <aside className="motion-inspector">
      {tab === "builder" && <>
        {advancedVisuals && <section className="editorial-tools"><div className="tool-kicker">EDITORIAL TOOLS</div><label className="upload-control"><input type="file" accept="image/*,video/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadAsset(file); e.currentTarget.value = ""; }} disabled={uploading} /><span>{uploading ? "Uploading…" : "Upload Footage / Image"}</span></label>{projectAssets.length > 0 ? <div className="asset-strip">{projectAssets.slice(0, 2).map((asset) => <span key={asset.id}>{asset.type === "video" ? "VID" : "IMG"} · {asset.label}</span>)}</div> : <p className="asset-empty">Upload one local image or video to unlock templates.</p>}<div className="template-list"><button onClick={() => applyTemplate("footage")}><b>Footage + Script</b><small>Bold title + script word on footage</small></button><button onClick={() => applyTemplate("portrait")}><b>Portrait Sidecard</b><small>Vertical media with compact type</small></button><button onClick={() => applyTemplate("object")}><b>Object Editorial</b><small>Object image + editorial accent</small></button></div></section>}
        {advancedVisuals && <div className="inspector-head"><span>COMPONENTS</span><select defaultValue="" onChange={(e) => { if (e.target.value) addClip(e.target.value); e.currentTarget.value = ""; }}><option value="">+ Add component</option>{componentOptions.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>}
        {!selectedClip ? <div className="empty-inspector">Preset ini belum memiliki elemen yang dapat diedit.</div> : <div className="clip-editor"><div className="clip-editor-title"><span>{componentOptions.find(([id]) => id === selectedClip.kind)?.[1] || "EDIT ISI"}</span>{advancedVisuals && <button onClick={() => deleteClip(selectedClip.id)}>Delete</button>}</div>
          {advancedVisuals && <><label>ID<input value={selectedClip.id} onChange={(e) => updateSelectedClip({ id: safeId(e.target.value, selectedClip.id) })} /></label><div className="form-row"><label>Start (frame)<input type="number" value={selectedClip.at} onChange={(e) => updateSelectedClip({ at: Number(e.target.value) })} /></label><label>Duration<input type="number" value={selectedClip.durationFrames} onChange={(e) => updateSelectedClip({ durationFrames: Number(e.target.value) })} /></label></div></>}
          {typeof selectedClip.props.rate === "number" && <label>Nilai kurs rupiah<input type="number" value={selectedClip.props.rate} onChange={(e) => updateSelectedProp("rate", Number(e.target.value))} /></label>}
          {typeof selectedClip.props.currency === "string" && <label>Pasangan mata uang<input value={selectedClip.props.currency} onChange={(e) => updateSelectedProp("currency", e.target.value)} /></label>}
          {typeof selectedClip.props.period === "string" && <label>Label periode<input value={selectedClip.props.period} onChange={(e) => updateSelectedProp("period", e.target.value)} /></label>}
          {typeof selectedClip.props.eyebrow === "string" && <label>Judul utama<input value={selectedClip.props.eyebrow} onChange={(e) => updateSelectedProp("eyebrow", e.target.value)} /></label>}
          {typeof selectedClip.props.italicWord === "string" && <label>Kata italic<input value={selectedClip.props.italicWord} onChange={(e) => updateSelectedProp("italicWord", e.target.value)} /></label>}
          {typeof selectedClip.props.message === "string" && <label>Pesan<textarea rows={3} value={selectedClip.props.message} onChange={(e) => updateSelectedProp("message", e.target.value)} /></label>}
          {typeof selectedClip.props.greeting === "string" && <label>Salam<input value={selectedClip.props.greeting} onChange={(e) => updateSelectedProp("greeting", e.target.value)} /></label>}
          {typeof selectedClip.props.offerTitle === "string" && <label>Judul penawaran<input value={selectedClip.props.offerTitle} onChange={(e) => updateSelectedProp("offerTitle", e.target.value)} /></label>}
          {typeof selectedClip.props.offerBody === "string" && <label>Keterangan<textarea rows={3} value={selectedClip.props.offerBody} onChange={(e) => updateSelectedProp("offerBody", e.target.value)} /></label>}
          {typeof selectedClip.props.buttonLabel === "string" && <label>Teks tombol<input value={selectedClip.props.buttonLabel} onChange={(e) => updateSelectedProp("buttonLabel", e.target.value)} /></label>}
          {typeof selectedClip.props.goPrice === "string" && <label>Harga Go<input value={selectedClip.props.goPrice} onChange={(e) => updateSelectedProp("goPrice", e.target.value)} /></label>}
          {typeof selectedClip.props.plusPrice === "string" && <label>Harga Plus<input value={selectedClip.props.plusPrice} onChange={(e) => updateSelectedProp("plusPrice", e.target.value)} /></label>}
          {typeof selectedClip.props.businessPrice === "string" && <label>Harga Business<input value={selectedClip.props.businessPrice} onChange={(e) => updateSelectedProp("businessPrice", e.target.value)} /></label>}
          {typeof selectedClip.props.title === "string" && <label>Judul<input value={selectedClip.props.title} onChange={(e) => updateSelectedProp("title", e.target.value)} /></label>}
          {typeof selectedClip.props.centerLabel === "string" && <label>Label tengah<input value={selectedClip.props.centerLabel} onChange={(e) => updateSelectedProp("centerLabel", e.target.value)} /></label>}
          {typeof selectedClip.props.text === "string" && <label>Teks<textarea className="text-input" rows={3} value={selectedClip.props.text} onChange={(e) => updateSelectedProp("text", e.target.value)} /></label>}
          {advancedVisuals && <details className="advanced-props"><summary>Props JSON</summary><textarea key={selectedClip.id} className="props-json" defaultValue={JSON.stringify(selectedClip.props, null, 2)} onBlur={(e) => updatePropsJson(e.target.value)} /></details>}
        </div>}
        {advancedVisuals && <div className="background-box"><span>BACKGROUND OUTPUT</span><select value={hasFullDashboard ? "dashboard" : backgroundMode} disabled={hasFullDashboard} onChange={(e) => setBackgroundMode(e.target.value as "brand" | "chroma")}><option value="brand">Brand · Dark Navy</option><option value="chroma">Chroma Green</option>{hasFullDashboard && <option value="dashboard">Full Dashboard · Locked</option>}</select><small>{hasFullDashboard ? "Dashboard memenuhi seluruh frame." : "Chroma hanya dipakai bila benar-benar dibutuhkan."}</small></div>}
        <div className="audio-box"><span>SOUND</span><label><input type="checkbox" checked={audio.sfxEnabled} onChange={(e) => setAudio({ ...audio, sfxEnabled: e.target.checked })} /> Aktifkan SFX</label>{advancedVisuals && <label><input type="checkbox" checked={audio.padEnabled} onChange={(e) => setAudio({ ...audio, padEnabled: e.target.checked })} /> Ambient pad</label>}</div>
      </>}
    </aside>
  </div>;
}
