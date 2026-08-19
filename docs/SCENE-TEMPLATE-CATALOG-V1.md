# ZAID PRD Motion Engine — Scene Template Catalog V1

**Status:** Approved V1 catalog  
**Purpose:** Provide reusable storytelling recipes without creating a second renderer.

## 1. Template Rules

A scene template is a **recipe** that compiles into normal MotionProject clips.

```text
Template input
↓
Template compiler
↓
Scene + layers + normal component clips
↓
MotionProject renderer
```

Templates must not:

- Render outside the Component Registry
- Introduce special template-only runtime behavior
- Generate arbitrary code
- Use random coordinates from an AI model
- Lock users out of editing the generated scene

Every generated template scene remains editable as regular layers and clips.

## 2. V1 Templates

Only the following eight templates are approved for V1.

| ID | Narrative role | Primary visual mode |
|---|---|---|
| `hook-title` | Strong opening claim | Typography |
| `hook-stat` | Statistic/contrast hook | BigNumber + Comparison |
| `problem` | Pain point / misconception | Typography + Notification |
| `browser-demo` | Explain settings/app UI | Browser + cursor |
| `workflow-demo` | Explain process/automation | Workflow |
| `comparison` | Before vs after | Comparison + data |
| `feature-grid` | Explain several modes/tools | AppGrid |
| `conclusion` | Recap / takeaway / CTA | Checklist + title |

## 3. `hook-title`

### Use when

- Opening a video with one strong claim
- Announcing a surprising idea
- Creating a memorable section divider

### Input

```json
{
  "template": "hook-title",
  "input": {
    "eyebrow": "CHATGPT TIP 01",
    "headline": "STOP STARTING FROM ZERO",
    "keyword": "ZERO",
    "tone": "direct",
    "accent": "lime"
  }
}
```

### Generated components

```text
Label
+ KineticTitle
+ KeywordPop
+ optional audio.clip (riser/impact)
```

### Rules

- One headline idea only.
- Keyword is optional and should be short.
- Do not add BrowserWindow or WorkflowFlow inside this template.
- Duration: 2–4 seconds.

## 4. `hook-stat`

### Use when

- The hook contains a number, percentage, time, or result
- Need to create contrast such as `2%` vs `98%`

### Input

```json
{
  "template": "hook-stat",
  "input": {
    "eyebrow": "THE REAL PROBLEM",
    "primaryValue": "2%",
    "headline": "OF CHATGPT USERS USE IT PROPERLY",
    "comparisonValue": "98%",
    "comparisonLabel": "UNUSED POTENTIAL",
    "accent": "lime"
  }
}
```

### Generated components

```text
Label
+ BigNumber
+ Comparison
+ KineticTitle
+ restrained impact audio
```

### Rules

- Use no more than two values.
- The statistic must be meaningful to the narration.
- Do not show unrelated charts in the same scene.
- Duration: 3–5 seconds.

## 5. `problem`

### Use when

- Explaining a misconception
- Showing a recurring pain point
- Introducing a warning before the solution

### Input

```json
{
  "template": "problem",
  "input": {
    "headline": "CHATGPT STARTS AS A STRANGER",
    "supportingText": "It knows nothing about your work or preferences.",
    "severity": "medium",
    "accent": "orange"
  }
}
```

### Generated components

```text
KineticTitle
+ NotificationCard or Callout
+ optional subtle Spotlight
```

### Rules

- Use orange only for a real warning/pain point.
- Supporting text must explain, not repeat the headline.
- Duration: 2–4 seconds.

## 6. `browser-demo`

### Use when

- Showing app settings
- Explaining where to click
- Walking through a UI action

### Input

```json
{
  "template": "browser-demo",
  "input": {
    "title": "ChatGPT Settings",
    "focusTarget": "custom-instructions",
    "callout": "Tell ChatGPT who you are here.",
    "cursorAction": "click",
    "accent": "blue"
  }
}
```

### Generated components

```text
BrowserWindow
+ CursorClick
+ Spotlight
+ Callout
+ click audio.clip
```

### Rules

- One interaction/focus target per short scene.
- Use a screenshot/capture when visual accuracy is required.
- Use illustrative BrowserWindow when explaining conceptually.
- Do not overlay oversized typography over important UI regions.
- Duration: 3–7 seconds.

## 7. `workflow-demo`

### Use when

- Explaining automation
- Showing cause → filter → action
- Explaining a process or system pipeline

### Input

```json
{
  "template": "workflow-demo",
  "input": {
    "title": "HOW MEMORY LEARNS",
    "nodes": [
      { "id": "conversation", "label": "Conversation", "icon": "message" },
      { "id": "memory", "label": "Memory", "icon": "brain" },
      { "id": "response", "label": "Better response", "icon": "sparkles" }
    ],
    "edges": [
      { "from": "conversation", "to": "memory" },
      { "from": "memory", "to": "response" }
    ],
    "reveal": "path"
  }
}
```

### Generated components

```text
Label / KineticTitle
+ WorkflowFlow
+ optional NotificationCard
+ connector whoosh audio
```

### Rules

- Use 2–5 nodes in V1.
- Keep node labels short.
- Use workflow only when causal sequence matters.
- Duration: 3–7 seconds.

## 8. `comparison`

### Use when

- Showing old vs new
- Comparing two approaches
- Showing manual vs automated

### Input

```json
{
  "template": "comparison",
  "input": {
    "left": {
      "label": "DEFAULT CHATGPT",
      "value": "STARTS OVER",
      "tone": "muted"
    },
    "right": {
      "label": "WITH MEMORY",
      "value": "LEARNS CONTEXT",
      "tone": "accent"
    },
    "dividerLabel": "VS"
  }
}
```

### Generated components

```text
Comparison
+ optional BigNumber / BarChart
+ contrast SFX
```

### Rules

- Only compare directly related things.
- Prefer short labels.
- One side may use accent; the other stays muted.
- Duration: 3–5 seconds.

## 9. `feature-grid`

### Use when

- Explaining multiple modes, tools, apps, or features
- Introducing a grouped list

### Input

```json
{
  "template": "feature-grid",
  "input": {
    "eyebrow": "CHATGPT MODES",
    "headline": "SIX WAYS TO WORK",
    "items": [
      { "icon": "mic", "label": "Voice" },
      { "icon": "panel-top", "label": "Canvas" },
      { "icon": "graduation-cap", "label": "Study" },
      { "icon": "bot", "label": "Agent" },
      { "icon": "image", "label": "Image" },
      { "icon": "search", "label": "Research" }
    ]
  }
}
```

### Generated components

```text
Label
+ KineticTitle
+ AppGrid
+ Icon clips
+ staggered tick audio
```

### Rules

- 3–8 items only.
- Use concise labels.
- Stagger appearance by item.
- Do not combine with a detailed workflow in the same scene.
- Duration: 3–6 seconds.

## 10. `conclusion`

### Use when

- Summarizing the lesson
- Ending a section
- Giving next action / CTA

### Input

```json
{
  "template": "conclusion",
  "input": {
    "headline": "MAKE CHATGPT WORK LIKE YOUR ASSISTANT",
    "points": [
      "Set Custom Instructions",
      "Turn on Memory",
      "Challenge its answers"
    ],
    "cta": "Save this for later"
  }
}
```

### Generated components

```text
KineticTitle
+ Checklist
+ Label / CTA
+ restrained ambient or final impact
```

### Rules

- Maximum three summary points in V1.
- CTA must be short.
- Avoid showing product UI unless the conclusion is an explicit final action.
- Duration: 3–6 seconds.

## 11. Template Selection Matrix

| Script signal | Recommended template |
|---|---|
| “Most people do X wrong” | `hook-title` or `problem` |
| “Only 2% / 98% / 10,000 hours” | `hook-stat` |
| “Go to Settings and click…” | `browser-demo` |
| “First this happens, then…” | `workflow-demo` |
| “Before this / after this” | `comparison` |
| “There are six modes/tools” | `feature-grid` |
| “Remember these three things” | `conclusion` |

## 12. Template Compiler Contract

A template compiler must:

1. Validate template ID and input fields.
2. Apply token defaults.
3. Generate globally stable scene/clip IDs.
4. Generate normal MotionProject clips.
5. Preserve an editable output scene.
6. Return warnings from Visual Grammar.

A template compiler must not:

- Write JSX or CSS into the project document
- Render directly
- Fetch external URLs
- Create components outside the Component Registry
- Produce random unbounded layouts

## 13. V1 Non-goals

- Do not make templates for every narrative situation.
- Do not create a “universal scene template”.
- Do not make template names dependent on a creator or brand identity.
- Do not add template-specific runtime renderers.
- Do not add new templates without reviewing the Visual Grammar and a real use case.
