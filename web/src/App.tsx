import { useEffect, useMemo, useState } from "react";
import "./styles.css";

type Clip = { id: string; kind: string; at: number; durationFrames: number; enter?: { preset: string; durationFrames: number }; props: Record<string, any> };
type Layer = { id: string; zIndex: number; clips: Clip[] };
type Scene = { id: string; durationFrames: number; layers: Layer[] };
type Project = { schemaVersion: "1.0"; id: string; title: string; format: { width: number; height: number; fps: number; background: string }; tokens: any; assets: Record<string, any>; scenes: Scene[] };
type AudioSettings = { sfxEnabled: boolean; padEnabled: boolean; sfxVolume: number; padVolume: number };

const API = "/api";
const FPS = 30;
const componentOptions = [
  ["typography.headline", "Kinetic Title"], ["typography.body", "Body Text"], ["typography.label", "Mono Label"],
  ["chart.metric", "Big Number"], ["chart.comparison", "Comparison"], ["chart.bar", "Bar Chart"], ["chart.counter", "Counter"],
  ["ui.browser", "Browser Window"], ["ui.appGrid", "App Grid"], ["ui.notification", "Notification"], ["ui.checklist", "Checklist"], ["ui.progress", "Progress Bar"], ["ui.terminal", "Terminal Typing"], ["ui.cursor", "Cursor Click"],
  ["workflow.flow", "Workflow Flow"], ["callout.pointer", "Callout"], ["effect.spotlight", "Spotlight"], ["device.frame", "Device Frame"], ["icon", "Icon"],
] as const;

const emptyProject = (): Project => ({ schemaVersion: "1.0", id: "new-project", title: "New Motion Project", format: { width: 1280, height: 720, fps: FPS, background: "#0A0A0A" }, tokens: { colors: { ink: "#0A0A0A", paper: "#F3F0E8", lime: "#A3E635" }, fonts: { display: "display", sans: "sans", mono: "mono" }, spacing: { page: 80, gap: 24 } }, assets: {}, scenes: [] });

function safeId(value: string, fallback: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || fallback; }
function clipDefaults(kind: string, number: number): Clip {
  const id = `${kind.replace(".", "-")}-${number}`;
  const base = { id, kind, at: 0, durationFrames: 90, enter: { preset: "slideUp", durationFrames: 15 } };
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
  if (kind === "workflow.flow") return { ...base, props: { position: [110, 250], width: 1050, nodes: [{ id: "input", label: "Input" }, { id: "process", label: "Process" }, { id: "output", label: "Output", tone: "#A3E635" }] } };
  if (kind === "callout.pointer") return { ...base, props: { position: [760, 300], text: "Explain this action", side: "left" } };
  if (kind === "effect.spotlight") return { ...base, props: { rect: [150, 220, 700, 180], dimOpacity: 0.6 } };
  if (kind === "device.frame") return { ...base, props: { position: [820, 70], width: 310, height: 560, title: "Mobile App", frame: "phone" } };
  return { ...base, props: { position: [120, 120], name: "sparkles", size: 80, color: "#A3E635" } };
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

  function loadProject(next: Project) { setProject(structuredClone(next)); setSceneIndex(0); setClipId(null); setVideoUrl(null); setStatus(null); }
  function updateProject(updater: (current: Project) => Project) { setProject((current) => updater(structuredClone(current))); }
  function updateSelectedClip(patch: Partial<Clip>) {
    if (!selectedClip) return;
    updateProject((current) => { const target = current.scenes[sceneIndex].layers.flatMap((layer) => layer.clips).find((item) => item.id === selectedClip.id); if (target) Object.assign(target, patch); return current; });
  }
  function addScene() {
    const nextSceneIndex = project.scenes.length;
    updateProject((current) => { const index = current.scenes.length + 1; current.scenes.push({ id: `scene-${index}`, durationFrames: 120, layers: [{ id: `scene-${index}-visuals`, zIndex: 10, clips: [] }] }); return current; });
    setSceneIndex(nextSceneIndex); setClipId(null);
  }
  function deleteScene(index: number) { updateProject((current) => { if (current.scenes.length > 1) current.scenes.splice(index, 1); return current; }); setSceneIndex(Math.max(0, sceneIndex - (index <= sceneIndex ? 1 : 0))); setClipId(null); }
  function addClip(kind: string) {
    if (!selectedScene) return;
    updateProject((current) => { const scene = current.scenes[sceneIndex]; const layer = scene.layers[0]; const newClip = clipDefaults(kind, layer.clips.length + 1); layer.clips.push(newClip); setClipId(newClip.id); return current; });
  }
  function deleteClip(id: string) { updateProject((current) => { current.scenes[sceneIndex].layers.forEach((layer) => { layer.clips = layer.clips.filter((item) => item.id !== id); }); return current; }); setClipId(null); }
  function updatePropsJson(value: string) { if (!selectedClip) return; try { updateSelectedClip({ props: JSON.parse(value) }); setError(null); } catch { setError("Props harus JSON valid."); } }

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

  return <div className="motion-app">
    <aside className="motion-nav">
      <div className="motion-brand"><span>▶</span><div><strong>Motion Engine</strong><small>ZAID PRD V2</small></div></div>
      <button className={`nav-tab ${tab === "builder" ? "active" : ""}`} onClick={() => setTab("builder")}>▦ Scene Builder</button>
      <button className={`nav-tab ${tab === "planner" ? "active" : ""}`} onClick={() => setTab("planner")}>✦ Script Planner</button>
      <div className="nav-section">PROJECTS</div>
      {projects.map((item) => <button key={item.id} className="project-item" onClick={() => loadProject(item.project)}>{item.title}</button>)}
      <button className="project-item add" onClick={() => loadProject(emptyProject())}>+ New project</button>
      <div className="nav-footer">{project.scenes.length} scenes · {(projectDuration / FPS).toFixed(1)}s</div>
    </aside>

    <main className="motion-main">
      <header className="motion-header"><div><input className="project-title" value={project.title} onChange={(e) => updateProject((p) => ({ ...p, title: e.target.value, id: safeId(e.target.value, p.id) }))} /><span>{project.format.width}×{project.format.height} · {project.format.fps}fps</span></div><button className="render-button" disabled={loading || !project.scenes.length} onClick={renderProject}>{loading ? "Rendering…" : "▶ Render MP4"}</button></header>
      {tab === "planner" ? <section className="planner-panel"><div className="planner-copy"><span>LOCAL STORY PLANNER</span><h1>Script → Visual Plan</h1><p>Planner memilih template Hook, Browser Demo, Workflow, Feature Grid, Comparison, dan Conclusion secara rule-based. Tidak memakai API atau model AI eksternal.</p></div><textarea value={script} onChange={(e) => setScript(e.target.value)} placeholder="Paste script video Anda di sini…" /><button className="planner-button" disabled={loading} onClick={makePlan}>✦ Buat Visual Plan</button><div className="planner-hint">Setelah jadi, Anda dapat review dan edit tiap Scene serta Component pada Scene Builder.</div></section> : <section className="builder-panel">
        <div className="scene-rail"><div className="section-head">SCENES <button onClick={addScene}>+ Add</button></div>{project.scenes.map((scene, index) => <div className={`scene-card ${index === sceneIndex ? "active" : ""}`} key={scene.id} onClick={() => { setSceneIndex(index); setClipId(null); }}><div><b>{String(index + 1).padStart(2, "0")}</b><strong>{scene.id.replace(/-/g, " ")}</strong><small>{(scene.durationFrames / FPS).toFixed(1)} sec · {scene.layers.flatMap((layer) => layer.clips).length} clips</small></div>{project.scenes.length > 1 && <button onClick={(e) => { e.stopPropagation(); deleteScene(index); }}>×</button>}</div>)}</div>
        <div className="stage"><div className="stage-canvas"><div className="stage-label">{selectedScene ? selectedScene.id : "No scene"}</div>{selectedScene?.layers.flatMap((layer) => layer.clips).map((clip) => <button key={clip.id} className={`stage-clip ${clipId === clip.id ? "selected" : ""}`} style={{ left: `${Math.min(76, 8 + clip.at / selectedScene.durationFrames * 70)}%`, top: `${90 + (clip.props.layout?.position?.[1] || clip.props.position?.[1] || 0) / 720 * 360}px` }} onClick={() => setClipId(clip.id)}>{clip.kind}</button>)}</div>{videoUrl && <div className="render-preview"><video src={videoUrl} controls autoPlay loop /><a href={videoUrl} download>⬇ Download MP4</a></div>}</div>
        <div className="timeline"><div className="timeline-title">TIMELINE · {selectedScene ? (selectedScene.durationFrames / FPS).toFixed(1) : 0}s</div>{selectedScene?.layers.flatMap((layer) => layer.clips).map((clip) => <button key={clip.id} className={`timeline-clip ${clipId === clip.id ? "selected" : ""}`} style={{ marginLeft: `${clip.at / selectedScene.durationFrames * 100}%`, width: `${Math.max(10, clip.durationFrames / selectedScene.durationFrames * 100)}%` }} onClick={() => setClipId(clip.id)}>{clip.kind}</button>)}</div>
      </section>}
      {status && <div className="motion-status success">✓ {status}</div>}{error && <div className="motion-status error">⚠ {error}</div>}
    </main>

    <aside className="motion-inspector">
      {tab === "builder" && <>
        <div className="inspector-head"><span>COMPONENTS</span><select defaultValue="" onChange={(e) => { if (e.target.value) addClip(e.target.value); e.currentTarget.value = ""; }}><option value="">+ Add component</option>{componentOptions.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>
        {!selectedClip ? <div className="empty-inspector">Pilih component di stage atau timeline.<br /><br />Gunakan <b>+ Add component</b> untuk menambah visual baru.</div> : <div className="clip-editor"><div className="clip-editor-title"><span>{selectedClip.kind}</span><button onClick={() => deleteClip(selectedClip.id)}>Delete</button></div><label>ID<input value={selectedClip.id} onChange={(e) => updateSelectedClip({ id: safeId(e.target.value, selectedClip.id) })} /></label><div className="form-row"><label>Start (frame)<input type="number" value={selectedClip.at} onChange={(e) => updateSelectedClip({ at: Number(e.target.value) })} /></label><label>Duration<input type="number" value={selectedClip.durationFrames} onChange={(e) => updateSelectedClip({ durationFrames: Number(e.target.value) })} /></label></div>{typeof selectedClip.props.text === "string" && <label>Text<input value={selectedClip.props.text} onChange={(e) => updateSelectedClip({ props: { ...selectedClip.props, text: e.target.value } })} /></label>}{typeof selectedClip.props.title === "string" && <label>Title<input value={selectedClip.props.title} onChange={(e) => updateSelectedClip({ props: { ...selectedClip.props, title: e.target.value } })} /></label>}{typeof selectedClip.props.value === "string" && <label>Value<input value={selectedClip.props.value} onChange={(e) => updateSelectedClip({ props: { ...selectedClip.props, value: e.target.value } })} /></label>}<label>Props JSON<textarea key={selectedClip.id} className="props-json" defaultValue={JSON.stringify(selectedClip.props, null, 2)} onBlur={(e) => updatePropsJson(e.target.value)} /></label><small>Gunakan field cepat di atas. Props JSON untuk edit lanjutan.</small></div>}
        <div className="audio-box"><span>AUDIO</span><label><input type="checkbox" checked={audio.sfxEnabled} onChange={(e) => setAudio({ ...audio, sfxEnabled: e.target.checked })} /> SFX</label><label><input type="checkbox" checked={audio.padEnabled} onChange={(e) => setAudio({ ...audio, padEnabled: e.target.checked })} /> Ambient pad</label></div>
      </>}
    </aside>
  </div>;
}
