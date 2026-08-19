# ZAID PRD Motion Engine V2 — Architecture

**Status:** Approved architecture contract  
**Scope:** Documentation only. No Phase 1 implementation is implied by this file.

## 1. Purpose

ZAID PRD Motion Engine is a reusable, local-first Remotion engine for creating modern explanatory video scenes about AI, technology, automation, applications, and tutorials.

It is **not** a kinetic-typography-only generator. Typography remains a component family inside a broader visual storytelling system.

```text
Script
↓
Visual Plan
↓
Motion Components + Timeline
↓
Render MP4
```

The engine must support both workflows:

1. **Manual workflow** — a user selects templates, edits components, and renders locally.
2. **Script-driven workflow** — an AI or planner translates a script into a visual plan, then a MotionProject.

## 2. Architecture Principles

1. **MotionProject is the renderer source of truth.**
2. **Components own what/how; the timeline owns when/where.**
3. **Templates are recipes, not a second renderer.**
4. **Story Planner is optional and never required by the renderer.**
5. **All project data is declarative JSON.** No CSS, React code, JavaScript expressions, or arbitrary URLs in AI-generated project data.
6. **Stable IDs, never array indexes, connect components, effects, and audio.**
7. **Assets are local and manifest-based.**
8. **Visual Grammar provides warnings and recommendations, not unnecessary hard restrictions.**
9. **The existing typography engine is a compatibility layer until V2 proves itself with a real video.**
10. **No new feature outside the approved roadmap is implemented without architecture review.**

## 3. System Overview

```text
                    Script
                      │
                      ▼
             Story Planner (optional)
                      │
                      ▼
                 Visual Plan
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Scene Template             Manual Scene
          │                       │
          └───────────┬───────────┘
                      ▼
                MotionProject
                      │
                      ▼
            Visual Grammar Review
              errors / warnings / advice
                      │
                      ▼
             Timeline Compiler
                      │
                      ▼
            Component Registry
                      │
                      ▼
               Remotion Renderer
                      │
                      ▼
                    MP4
```

## 4. Layer Responsibilities

| Layer | Required | Responsibility | Must not own |
|---|---:|---|---|
| Story Planner | No | Script → Visual Plan | Rendering and pixel layout |
| Visual Plan | No | Semantic beats, message, intent, energy | Frame calculations and renderer internals |
| Scene Templates | No | Convert a known narrative pattern into reusable components | A special rendering path |
| MotionProject | Yes | Canonical render document | Arbitrary code or external fetching |
| Visual Grammar | Yes | Warnings, recommendations, consistency rules | Actual component rendering |
| Timeline Compiler | Yes | Frame ranges, scene offsets, transitions, ordering | Component visuals |
| Component Registry | Yes | `kind` → component renderer + validator | Timeline composition |
| Asset Resolver | Yes | Asset ID → controlled local `staticFile()` URL | Component layout decisions |
| Component Renderer | Yes | Render one normalized clip | Read unvalidated project JSON |
| Remotion Renderer | Yes | Render composition to video | Story/planning decisions |

## 5. Project Model

The canonical document is `MotionProject`.

```json
{
  "schemaVersion": "1.0",
  "id": "chatgpt-custom-instructions",
  "title": "ChatGPT Custom Instructions",
  "format": {
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "background": "@colors.ink"
  },
  "tokens": {},
  "assets": {},
  "scenes": []
}
```

### Required top-level fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Compatibility and migrations |
| `id` | Stable project identity |
| `title` | Human-readable title |
| `format` | Width, height, fps, background |
| `tokens` | Colors, fonts, spacing, motion defaults |
| `assets` | Local asset manifest |
| `scenes` | Ordered narrative scenes |

## 6. Scene Model

Scenes concatenate in declaration order. Transitions may overlap adjacent scenes.

```json
{
  "id": "custom-instructions",
  "durationFrames": 180,
  "background": {
    "type": "solid",
    "color": "@colors.ink"
  },
  "transitionOut": {
    "preset": "wipeLeft",
    "durationFrames": 12
  },
  "layers": []
}
```

### Standard layer names

Use these layers for V1:

1. `background`
2. `visuals`
3. `annotations`
4. `effects`
5. `audio`

Layers also carry `zIndex`. Custom layers can be added later only when there is a demonstrated need.

## 7. Clip Contract

Every visible, audio, or effect item is a clip.

```json
{
  "id": "headline-find",
  "kind": "typography.headline",
  "at": 12,
  "durationFrames": 90,
  "enter": {
    "preset": "slideUp",
    "durationFrames": 16,
    "easing": "outCubic"
  },
  "exit": {
    "preset": "fade",
    "durationFrames": 10
  },
  "props": {}
}
```

### Clip rules

- `id` is globally unique in one project.
- `kind` is a stable public renderer contract, such as `ui.browser`.
- `at` is relative to the containing scene and measured in frames.
- `durationFrames` is explicit.
- `props` is validated per component kind.
- Effects reference clip IDs, never array indexes.
- Animation values come from a controlled preset allow-list.

## 8. Timing and Layout

### Timing

- Renderer timing uses integer frames.
- `fps` belongs to project format.
- Planner/UI may show seconds, but converts them to frames before creating a MotionProject.
- Every scene and clip has explicit duration.

### Layout

Components should prefer anchors and offsets over absolute pixels.

```json
{
  "layout": {
    "anchor": "topLeft",
    "offset": [96, 84]
  }
}
```

Available anchors:

```text
topLeft, top, topRight,
left, center, right,
bottomLeft, bottom, bottomRight
```

Absolute `position: [x, y]` remains an escape hatch for editorial art direction.

## 9. Assets

Projects reference local asset IDs, never free-form URLs.

```json
{
  "assets": {
    "click-soft": {
      "type": "audio",
      "src": "sfx/click-soft.wav"
    },
    "chatgpt-logo": {
      "type": "image",
      "src": "icons/chatgpt.svg"
    },
    "settings-recording": {
      "type": "video",
      "src": "captures/settings.mp4"
    }
  }
}
```

### Asset rules

- Valid V1 types: `image`, `video`, `audio`, `font`.
- Paths are relative to a controlled local public asset root.
- Reject absolute paths, `..`, remote URLs, and missing asset IDs.
- The asset resolver alone calls `staticFile()`.
- Audio lives on the audio layer as `audio.clip`; it is not only a side effect of text animation.

## 10. Component Registry

The registry maps JSON `kind` values to renderers and validators.

```text
typography.headline  → KineticTitle
ui.browser           → BrowserWindow
workflow.flow        → WorkflowFlow
chart.bar             → BarChart
callout.pointer       → Callout
```

Each registered component supplies:

1. Kind identifier
2. Props schema
3. Defaults
4. Renderer
5. Optional semantic target regions for callouts/effects

## 11. V1 Component Scope

Only these components are in the approved first implementation scope.

### Typography

- `typography.headline` / KineticTitle
- `typography.keyword` / KeywordPop
- `typography.metric` / BigNumber
- `typography.label` / Label

### UI

- `ui.browser` / BrowserWindow
- `ui.appGrid` / AppGrid
- `ui.notification` / NotificationCard
- `ui.checklist` / Checklist
- `ui.progress` / ProgressBar
- `ui.terminal` / TerminalTyping
- `ui.cursor` / CursorClick

### Workflow and charts

- `workflow.flow` / WorkflowNode + FlowConnector
- `chart.comparison` / Comparison
- `chart.bar` / BarChart
- `chart.counter` / Counter

### Callouts, devices, effects, icons, audio

- `callout.pointer` / Callout
- `effect.spotlight` / Spotlight
- `effect.zoom` / ZoomFocus
- `device.frame` / DeviceFrame
- `icon`
- `audio.clip`

Anything outside this list requires a roadmap review first.

## 12. Story Planner

Story Planner is optional. It converts script language into a semantic Visual Plan.

```json
{
  "id": "hook",
  "purpose": "hook",
  "narration": "Most people only use 2% of ChatGPT.",
  "message": "You are using ChatGPT wrong",
  "visualIntent": "contrast",
  "suggestedTemplate": "hook-stat",
  "emphasis": ["2%", "wrong"],
  "energy": "high"
}
```

Story Planner must not emit:

- pixel coordinates
- CSS
- React code
- arbitrary component implementation details
- arbitrary URLs

## 13. Scene Templates

Templates are optional recipes that compile into normal MotionProject clips.

```text
hook-stat template
↓
Label + BigNumber + KineticTitle + audio.clip
↓
Normal MotionProject scene
```

Templates do not create a separate renderer or special scene runtime.

## 14. Visual Grammar

Visual Grammar supplements the Design System.

| System | Answers |
|---|---|
| Design System | Color, font, spacing, shadow, easing |
| Visual Grammar | Which component fits which narrative intent and which combinations should be avoided |

It reports:

- **Errors:** invalid asset, missing target, duplicate ID, invalid duration.
- **Warnings:** too many fonts, too many accents, overcrowded scene, too many primary components.
- **Recommendations:** use comparison for before/after, workflow for automation explanation, browser demo for product settings.

The full contract lives in `VISUAL-GRAMMAR-V1.md`.

## 15. Schema Versioning

Use a single root schema version.

```json
{ "schemaVersion": "1.0" }
```

| Version change | Meaning |
|---|---|
| Patch | Compatible clarification or optional field |
| Minor | Additive component/optional field |
| Major | Removed/renamed field or changed semantics |

Known older formats are converted by a migration layer into one normalized internal model.

## 16. Migration from Current Broll Studio

| Current format | V2 location |
|---|---|
| `elements[]` | visual layer clips |
| `text` | `props.text` |
| `x`, `y` | `props.layout.position` |
| `font`, `fontSize`, `fontWeight` | `props.style` |
| `delay` | `at` in frames |
| `duration` | `durationFrames` |
| `anim` | `enter.preset` |
| `sfx`, `sfxOffset` | `audio.clip` or compiled sound shorthand |

The old renderer remains until V2 renders a complete real tutorial video successfully.

## 17. Approved Roadmap

### Phase 0 — Stability

Complete. Existing local app remains stable and frozen except for bug fixes.

### Phase 1 — Foundation

1. Introduce `MotionProject` V1 schema.
2. Add runtime + semantic validation.
3. Add TokenResolver and AssetResolver.
4. Add TimelineCompiler.
5. Add ComponentRegistry.
6. Add migration adapter from current typography presets.
7. Replace mutable global generated config with per-render input/job data.

### Phase 2 — Core components

Implement only the approved V1 component list.

### Phase 3 — Scene Builder UI

Move from a flat Lines editor to Scene → Layer → Clip editing.

### Phase 4 — Script-driven workflow

Add Story Planner and Template Compiler after manual MotionProject rendering is proven.

## 18. Non-goals for V1

- Full browser simulator
- 3D device engine
- Particle engine
- Arbitrary external URL fetching
- Arbitrary executable animation expressions
- Large transition marketplace
- Unlimited component types
- AI-generated React/CSS code
