// scripts/motion-templates.mjs
// Phase 4: declarative scene recipes + local rule-based Story Planner.
// No external AI/API is required. A future LLM adapter can emit the same Beat shape.

const FPS = 30;
const BASE_TOKENS = {
  colors: { ink: "#0A0A0A", paper: "#F3F0E8", lime: "#A3E635", blue: "#3B82F6", orange: "#F97316" },
  fonts: { display: "display", sans: "sans", mono: "mono", classic: "classic" },
  spacing: { page: 80, gap: 24 },
};

const frames = (seconds) => Math.round(seconds * FPS);
const cleanId = (text, fallback) => (text || fallback).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || fallback;
const clip = (id, kind, at, durationFrames, props, enter) => ({ id, kind, at, durationFrames, ...(enter ? { enter } : {}), props });
const intro = (preset = "slideUp", seconds = 0.5) => ({ preset, durationFrames: frames(seconds), easing: "outCubic" });

export function createEmptyProject(title = "Untitled Motion Project") {
  return {
    schemaVersion: "1.0",
    id: cleanId(title, "motion-project"),
    title,
    format: { width: 1280, height: 720, fps: FPS, background: "@colors.ink" },
    tokens: structuredClone(BASE_TOKENS),
    assets: {},
    scenes: [],
  };
}

export function compileTemplate(template, input = {}, index = 1) {
  const sceneId = `${template}-${index}`;
  const title = input.title || input.headline || input.message || "NEW SCENE";

  if (template === "browser-demo") {
    return {
      id: sceneId, durationFrames: frames(4.5), layers: [{ id: `${sceneId}-visuals`, zIndex: 10, clips: [
        clip(`${sceneId}-title`, "typography.body", 0, frames(3.8), { text: input.headline || "SETTINGS THAT CHANGE EVERYTHING", layout: { position: [82, 72] }, font: "display", fontSize: 44, fontWeight: 800, letterSpacing: -0.05 }, intro()),
        clip(`${sceneId}-browser`, "ui.browser", frames(0.35), frames(4.1), { title: input.browserTitle || "ChatGPT Settings", subtitle: "app.local / settings", layout: { position: [160, 150], width: 860, height: 470 }, sections: input.sections || [{ label: "Custom Instructions", value: "Enabled", active: true }, { label: "Memory", value: "Manage" }] }, intro("scaleIn", 0.6)),
        clip(`${sceneId}-cursor`, "ui.cursor", frames(1.2), frames(2.5), { position: [830, 397], click: true }, intro("fade", 0.2)),
        clip(`${sceneId}-callout`, "callout.pointer", frames(1.55), frames(2.5), { position: [900, 315], text: input.callout || "Set your context here", side: "left" }, intro("slideLeft", 0.35)),
      ] }],
    };
  }

  if (template === "workflow-demo") {
    return {
      id: sceneId, durationFrames: frames(4.5), layers: [{ id: `${sceneId}-visuals`, zIndex: 10, clips: [
        clip(`${sceneId}-title`, "typography.body", 0, frames(3.7), { text: input.headline || "TURN A TASK INTO A SYSTEM", layout: { position: [110, 82] }, font: "display", fontSize: 43, fontWeight: 800, letterSpacing: -0.05 }, intro()),
        clip(`${sceneId}-flow`, "workflow.flow", frames(0.55), frames(3.6), { position: [120, 220], width: 1040, title: input.flowTitle, nodes: input.nodes || [{ id: "input", label: "Input", icon: "TXT" }, { id: "process", label: "AI process", icon: "AI" }, { id: "output", label: "Output", icon: "MP4", tone: "#A3E635" }] }, intro("fade", 0.35)),
        clip(`${sceneId}-notification`, "ui.notification", frames(2.75), frames(1.5), { layout: { position: [420, 525], width: 450 }, title: input.notification || "Automated", body: "The system handles the repetition.", tone: "success" }, intro("wordPop", 0.3)),
      ] }],
    };
  }

  if (template === "feature-grid") {
    return {
      id: sceneId, durationFrames: frames(4.5), layers: [{ id: `${sceneId}-visuals`, zIndex: 10, clips: [
        clip(`${sceneId}-title`, "typography.body", 0, frames(4), { text: input.headline || "MORE WAYS TO WORK", layout: { position: [90, 70] }, font: "display", fontSize: 48, fontWeight: 800, letterSpacing: -0.05 }, intro()),
        clip(`${sceneId}-grid`, "ui.appGrid", frames(0.45), frames(3.85), { layout: { position: [90, 155], width: 1100 }, items: input.items || [{ icon: "MIC", label: "Voice" }, { icon: "CAN", label: "Canvas" }, { icon: "STU", label: "Study" }, { icon: "AGE", label: "Agent", accent: true }, { icon: "IMG", label: "Image" }, { icon: "RES", label: "Research" }] }, intro("scaleIn", 0.5)),
      ] }],
    };
  }

  if (template === "comparison") {
    return {
      id: sceneId, durationFrames: frames(3.6), layers: [{ id: `${sceneId}-visuals`, zIndex: 10, clips: [
        clip(`${sceneId}-comparison`, "chart.comparison", frames(0.35), frames(3), { position: [140, 230], width: 1000, left: input.left || { label: "BEFORE", value: "MANUAL" }, right: input.right || { label: "AFTER", value: "AUTOMATED" } }, intro("scaleIn", 0.45)),
      ] }],
    };
  }

  if (template === "conclusion") {
    return {
      id: sceneId, durationFrames: frames(4), layers: [{ id: `${sceneId}-visuals`, zIndex: 10, clips: [
        clip(`${sceneId}-title`, "typography.headline", 0, frames(3.7), { text: input.headline || "MAKE AI WORK FOR YOU.", layout: { position: [100, 115] }, font: "display", fontSize: 72, fontWeight: 800, letterSpacing: -0.06, sfx: "impact" }, intro("reveal", 0.6)),
        clip(`${sceneId}-checklist`, "ui.checklist", frames(0.8), frames(2.8), { layout: { position: [110, 315], width: 650 }, items: input.items || ["Set your context", "Build a repeatable workflow", "Review the output"] }, intro("slideUp", 0.5)),
      ] }],
    };
  }

  // hook-title and hook-stat default recipe
  const hasStatistic = template === "hook-stat" || /\d+\s*(%|hours|x|minutes?)/i.test(input.metric || "");
  return {
    id: sceneId, durationFrames: frames(3.5), layers: [{ id: `${sceneId}-visuals`, zIndex: 10, clips: [
      clip(`${sceneId}-label`, "typography.label", 0, frames(3), { text: input.eyebrow || "ZAID PRD MOTION ENGINE", layout: { position: [85, 86] }, font: "mono", fontSize: 20, letterSpacing: 0.08, opacity: 0.75 }, intro("fade", 0.2)),
      clip(`${sceneId}-title`, "typography.headline", frames(0.25), frames(3.15), { text: input.headline || title.toUpperCase(), layout: { position: [80, 175] }, font: "display", fontSize: hasStatistic ? 70 : 88, fontWeight: 800, letterSpacing: -0.06, sfx: "riser", sfxOffset: -0.1 }, intro("slideUp", 0.55)),
      ...(hasStatistic ? [clip(`${sceneId}-metric`, "chart.metric", frames(0.7), frames(2.5), { position: [860, 415], value: input.metric || "98%", label: input.metricLabel || "UNLOCKED" }, intro("scaleIn", 0.45))] : []),
    ] }],
  };
}

export function planScript(script, title = "AI Tutorial") {
  const project = createEmptyProject(title);
  const sentences = script.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 8);
  const beats = sentences.length ? sentences : ["Explain your idea clearly."];

  project.scenes = beats.map((sentence, index) => {
    const lower = sentence.toLowerCase();
    if (index === 0) return compileTemplate(/\d+\s*%/.test(sentence) ? "hook-stat" : "hook-title", { headline: sentence, metric: sentence.match(/\d+\s*%/)?.[0] }, index + 1);
    if (/settings|click|open|go to|personalization|custom instruction/.test(lower)) return compileTemplate("browser-demo", { headline: sentence }, index + 1);
    if (/then|workflow|automate|automation|process|memory/.test(lower)) return compileTemplate("workflow-demo", { headline: sentence }, index + 1);
    if (/mode|tools|features|voice|canvas|agent|research/.test(lower)) return compileTemplate("feature-grid", { headline: sentence }, index + 1);
    if (/before|after|versus| vs |instead/.test(lower)) return compileTemplate("comparison", { headline: sentence }, index + 1);
    if (index === beats.length - 1) return compileTemplate("conclusion", { headline: sentence }, index + 1);
    return compileTemplate("hook-title", { eyebrow: `KEY IDEA ${String(index + 1).padStart(2, "0")}`, headline: sentence }, index + 1);
  });

  return project;
}
