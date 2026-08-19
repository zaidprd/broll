# ZAID PRD Motion Engine — Visual Grammar V1

**Status:** Approved visual decision framework  
**Purpose:** Keep scenes clear, consistent, and editorial without copying any creator identity.

## 1. What Visual Grammar Is

Visual Grammar defines **how components communicate ideas together**.

It is different from the Design System.

| Design System | Visual Grammar |
|---|---|
| Which color/font/spacing/easing? | Which component should explain this idea? |
| How rounded is a card? | When is a card better than a chart? |
| Which shadow is allowed? | How many major elements can exist in a scene? |

Visual Grammar is used by:

- Scene Templates
- Story Planner
- Manual Scene Builder warnings
- Future AI prompts
- MotionProject semantic validation

## 2. Core Principles

1. **One scene, one message.**
2. **One primary visual mechanism per scene.**
3. **Typography explains; UI demonstrates; workflow connects; charts prove.**
4. **Movement must clarify hierarchy or causality.**
5. **Accent color is meaningful, not decoration.**
6. **Audio supports action, not every animation.**
7. **Whitespace is part of the composition.**
8. **Use components to show an idea, not to fill empty space.**

## 3. Narrative Intent → Component Selection

| Narrative intent | Primary component | Supporting component | Avoid |
|---|---|---|---|
| Strong opening statement | KineticTitle | KeywordPop, Label | BrowserWindow + chart at once |
| Large claim/statistic | BigNumber | Comparison, Counter | Multiple unrelated cards |
| Before vs after | Comparison | BigNumber, BarChart | Workflow unless process is central |
| Product setting/tutorial | BrowserWindow | CursorClick, Spotlight, Callout | Large decorative typography over UI |
| Step-by-step process | WorkflowFlow | StepIndicator, Notification | Multiple charts |
| Explain tool modes/features | AppGrid | Label, Icon | Dense workflow graph |
| Show completed action | NotificationCard | CursorClick, Check icon | Multiple competing callouts |
| Explain risk/warning | NotificationCard | Spotlight, Callout | Lime as the only warning color |
| Show command/code | TerminalTyping | Callout, CursorClick | Script/calligraphy font |
| Show progress | ProgressBar | Counter, Notification | Multiple unrelated metrics |
| Closing takeaway | KineticTitle | Checklist, Label | Browser UI demo |

## 4. Scene Complexity Budget

### 2–5 second scene

```text
1 primary component
+ 1 supporting component
+ maximum 2 annotations/effects
```

Examples:

```text
BrowserWindow
+ CursorClick
+ Spotlight
+ Callout
```

```text
BigNumber
+ Comparison
+ Impact SFX
```

### Warning conditions

The Scene Builder should warn when a scene has:

- More than 2 primary visual components
- More than 4 visible components excluding effects/audio
- More than 2 annotation components
- More than 2 font families
- More than 1 primary accent color
- More than 1 full-strength SFX event within 12 frames

Warnings are advisory, not hard errors.

## 5. Component Combinations

### Approved combinations

| Primary | Good pairings |
|---|---|
| KineticTitle | KeywordPop, Label, BigNumber |
| BigNumber | Comparison, BarChart, Counter |
| BrowserWindow | CursorClick, Spotlight, Callout, NotificationCard |
| WorkflowFlow | StepIndicator, NotificationCard, Callout |
| AppGrid | Label, Icon, KeywordPop |
| TerminalTyping | CursorClick, Callout, NotificationCard |
| DeviceFrame | BrowserWindow, NotificationCard, Spotlight |
| BarChart | BigNumber, Callout, Comparison |

### Combinations requiring caution

| Combination | Why |
|---|---|
| BrowserWindow + PhoneMockup | Use only if cross-device explanation is the message |
| WorkflowFlow + BarChart | Use only if the metric proves the workflow outcome |
| BigNumber + BigNumber | Must be comparison/contrast, not two unrelated numbers |
| Multiple NotificationCards | Can look like dashboard clutter |
| BigNumber + BrowserWindow + WorkflowFlow | Usually split into separate scenes |

## 6. Typography Grammar

### Hierarchy

| Role | Font guidance | Typical use |
|---|---|---|
| Hero | Display bold, Classic italic, Playfair italic | Main claim / emotion |
| Supporting | Inter / display medium | Context sentence |
| System label | JetBrains Mono | Step, status, technical tag |
| Calligraphy accent | Great Vibes | One short word only |

### Rules

- Maximum two font families per scene, unless mono is used as a small system label.
- Great Vibes/calligraphy is limited to a short accent word.
- Serif italic is an accent, not the entire paragraph.
- Hero must be visibly larger or stronger than supporting copy.
- Avoid subtitle-like centered text blocks unless the template explicitly requires it.
- Rotation usually stays between `-4°` and `+4°`.
- Avoid outline and glow by default.

## 7. Color Grammar

### Core palette roles

| Token | Role |
|---|---|
| Ink / black | Background and depth |
| Paper / cream | Primary readable text |
| Lime | AI, automation, success, primary emphasis |
| Yellow | Attention, key note, selected state |
| Blue | App/UI/data context |
| Orange | Warning, risk, recording, action needed |
| Muted gray | Secondary labels and inactive context |

### Rules

1. One scene has one dominant accent.
2. Cream is the default content color on dark backgrounds.
3. Lime is not a replacement for all text.
4. Orange is preferred for risk/warning.
5. Blue is preferred for UI/data-oriented scenes.
6. Color must carry meaning; it is not random decoration.

## 8. Motion Grammar

### Motion intent

| Intent | Recommended motion |
|---|---|
| Reveal hierarchy | slideUp, reveal, fade |
| Show causality | connector draw, node-by-node reveal |
| Show interaction | cursor move, click, spotlight |
| Show growth | chart grow, counter, progress fill |
| Focus attention | zoomFocus, spotlight, highlight |
| Transition idea | wipe, hard cut, brief fade |

### Rules

- Every visible entrance needs a reason: hierarchy, causality, interaction, or emphasis.
- Do not animate every item in the same way.
- Preserve a readable hold after the main reveal.
- Avoid bounce unless a specific playful tone is chosen.
- UI movement is smoother and subtler than typography movement.
- Effects should target an object by ID rather than use arbitrary screen coordinates when possible.

## 9. Audio Grammar

Audio clips belong on the timeline and may be attached semantically to an action.

| Event | Default audio suggestion |
|---|---|
| Hero statement | subtle riser + restrained impact |
| BigNumber reveal | impact |
| Cursor click | click |
| Workflow connector reveal | light whoosh |
| Notification appears | pop/tick |
| UI modal enters | soft whoosh |
| Scene hold | silence or low ambient pad |
| Warning | restrained alert/tick, not a loud impact |

### Rules

- Never assign SFX solely because a visual uses `slideUp`.
- Keep at least 8–12 frames between strong SFX hits when possible.
- Use silence for contrast.
- Ambient pads stay low enough that voice-over remains dominant.
- User-selected custom SFX always overrides default mapping.
- SFX offset may be negative when a riser must lead a visual action.

## 10. Visual Modes for Tutorial Videos

Use these modes to prevent a tutorial from becoming a text-only video.

| Mode | Primary component family | Typical purpose |
|---|---|---|
| Statement | Typography | Hook, claim, takeaway |
| Proof | Charts / BigNumber | Evidence, contrast, result |
| Product demo | UI / cursor / spotlight | Explain an app setting/action |
| Process | Workflow | Explain automation or sequence |
| Feature overview | AppGrid / icons | Explain multiple modes/tools |
| Warning | Notification / callout | Risk, security, caveat |
| Recap | Checklist / title | Conclusion, CTA, summary |

A 30–60 second tutorial should normally alternate modes rather than repeat one mode for every scene.

## 11. Validation Levels

### Errors

Block rendering:

- Duplicate component ID
- Invalid component kind
- Missing asset ID
- Invalid target ID
- Negative duration
- Invalid scene transition bounds
- Unsupported schema version

### Warnings

Allow rendering but inform the author:

- More than two font families
- More than one primary accent
- More than two primary components
- More than four visible component clips
- More than two annotations/effects
- Strong SFX clustering
- Text area exceeds safe visual region

### Recommendations

Non-blocking creative advice:

- Use Comparison for a before/after claim
- Use BrowserWindow + CursorClick for UI explanation
- Use WorkflowFlow for automation explanation
- Use Spotlight when a UI screen has a specific focus target

## 12. Example: ChatGPT Tutorial Sequence

```text
Scene 01 — Hook
KineticTitle + KeywordPop

Scene 02 — 2% vs 98%
BigNumber + Comparison

Scene 03 — Custom Instructions
BrowserWindow + CursorClick + Spotlight + Callout

Scene 04 — Memory
WorkflowFlow + NotificationCard

Scene 05 — Six Modes
AppGrid + Label

Scene 06 — Agent Security Warning
NotificationCard + Spotlight

Scene 07 — Conclusion
KineticTitle + Checklist
```

This uses varying visual modes while maintaining one message per scene.
