// src/engine/ComponentRegistry.ts
// Phase 2 allow-list and component payload validation.

import { z } from "zod";

const position = z.tuple([z.number(), z.number()]);
const layout = z.object({ position, width: z.number().positive().optional(), height: z.number().positive().optional() });
const enter = z.object({ preset: z.enum(["fade", "slideUp", "slideLeft", "slideRight", "scaleIn", "wordPop", "reveal"]), durationFrames: z.number().int().positive() }).optional();
const sfx = z.enum(["auto", "whoosh", "impact", "tick", "riser", "click", "silent", "custom"]).optional();

const typographyPropsSchema = z.object({
  text: z.string(), layout: z.object({ position }),
  font: z.enum(["display", "displayItalic", "sans", "classic", "mono", "script", "playfair"]),
  fontStyle: z.enum(["normal", "italic"]).optional(), fontWeight: z.number().int().min(100).max(1000).optional(),
  fontSize: z.number().positive().max(600), letterSpacing: z.number().min(-1).max(1).optional(),
  maxWidth: z.number().positive().max(4000).optional(), textAlign: z.enum(["left", "center", "right"]).optional(),
  color: z.string().min(1).optional(),
  highlight: z.object({ word: z.string().min(1), color: z.string().min(1).optional() }).optional(),
  rotation: z.number().min(-20).max(20).optional(), opacity: z.number().min(0).max(1).optional(),
  sfx, sfxFile: z.string().min(1).optional(), sfxOffset: z.number().min(-3).max(3).optional(),
});

const browserProps = z.object({ title: z.string(), subtitle: z.string().optional(), layout, sections: z.array(z.object({ label: z.string(), value: z.string(), active: z.boolean().optional() })).optional() });
const notificationProps = z.object({ title: z.string(), body: z.string().optional(), tone: z.enum(["success", "warning", "info"]).optional(), layout });
const appGridProps = z.object({ title: z.string().optional(), layout, items: z.array(z.object({ icon: z.string().optional(), label: z.string(), accent: z.boolean().optional() })).min(1) });
const checklistProps = z.object({ title: z.string().optional(), layout, items: z.array(z.string()).min(1) });
const progressProps = z.object({ label: z.string(), value: z.number().min(0).max(100), accent: z.string().optional(), layout });
const terminalProps = z.object({ lines: z.array(z.string()).min(1), layout });
const cursorProps = z.object({ position, click: z.boolean().optional() });
const offerDashboardProps = z.object({
  greeting: z.string().optional(),
  offerTitle: z.string().optional(),
  offerBody: z.string().optional(),
  buttonLabel: z.string().optional(),
  accent: z.string().optional(),
  cardPosition: position.optional(),
  audioEnabled: z.boolean().optional(),
});
const paymentCollisionProps = z.object({
  gopayAsset: z.string().optional(),
  bcaAsset: z.string().optional(),
  background: z.string().optional(),
  audioEnabled: z.boolean().optional(),
});
const pricingDashboardProps = z.object({
  goPrice: z.string().optional(),
  plusPrice: z.string().optional(),
  businessPrice: z.string().optional(),
  audioEnabled: z.boolean().optional(),
});
const infographicProps = z.object({
  variant: z.enum(["circular", "vertical"]).optional(), title: z.string().optional(), centerLabel: z.string().optional(), background: z.string().optional(),
  items: z.array(z.object({label: z.string(), value: z.number().min(0).max(100), detail: z.string().optional()})).min(1).max(4).optional(),
});
const paymentWarningProps = z.object({eyebrow: z.string().optional(), italicWord: z.string().optional(), message: z.string().optional(), audioEnabled: z.boolean().optional()});
const gpuHeroProps = z.object({
  eyebrow: z.string().optional(), headline: z.string().optional(), question: z.string().optional(),
  primary: z.string().optional(), background: z.string().optional(), gpuLabel: z.string().optional(), integratedLabel: z.string().optional(),
});
const lucideIconName = z.enum(["activity", "chart-no-axes-combined", "cpu", "gauge", "list-checks", "microchip", "monitor", "mouse-pointer-click", "network", "panels-top-left", "presentation", "route", "settings", "table-2", "toggle-right", "workflow", "zap"]);
const iconFootageProps = z.object({
  icon: lucideIconName.optional(), motion: z.enum(["reveal", "pulse", "orbit", "float", "rotate", "scan", "pop"]).optional(),
  title: z.string().optional(), subtitle: z.string().optional(), primary: z.string().optional(), background: z.string().optional(),
  iconSize: z.number().positive().max(400).optional(), audioEnabled: z.boolean().optional(),
});
const appleMotionProps = z.object({
  variant: z.enum(["dark-stage", "light-stage", "glass-button", "toggle", "segment-control", "metric", "line-chart", "comparison", "data-flow", "table", "screen-window", "presenter-graphic", "big-statement", "process-network", "summary-steps"]),
  title: z.string().optional(), subtitle: z.string().optional(), primary: z.string().optional(), background: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(), secondaryValue: z.union([z.string(), z.number()]).optional(),
  labels: z.array(z.string()).optional(),
  items: z.array(z.union([z.string(), z.object({label: z.string(), value: z.union([z.string(), z.number()]).optional(), detail: z.string().optional(), color: z.string().optional()})])).optional(),
  audioEnabled: z.boolean().optional(),
});
const exchangeRateProps = z.object({rate: z.number().positive().optional(), currency: z.string().optional(), period: z.string().optional(), audioEnabled: z.boolean().optional()});
const workflowProps = z.object({ position, width: z.number().positive().optional(), title: z.string().optional(), nodes: z.array(z.object({ id: z.string(), label: z.string(), icon: z.string().optional(), tone: z.string().optional() })).min(2) });
const bigNumberProps = z.object({ position, value: z.string(), label: z.string().optional(), accent: z.string().optional() });
const comparisonProps = z.object({ position, width: z.number().positive().optional(), left: z.object({ label: z.string(), value: z.string() }), right: z.object({ label: z.string(), value: z.string() }) });
const barChartProps = z.object({ position, width: z.number().positive().optional(), height: z.number().positive().optional(), title: z.string().optional(), items: z.array(z.object({ label: z.string(), value: z.number(), accent: z.boolean().optional() })).min(1) });
const counterProps = z.object({ position, from: z.number().optional(), to: z.number(), prefix: z.string().optional(), suffix: z.string().optional(), label: z.string().optional() });
const calloutProps = z.object({ position, text: z.string(), side: z.enum(["left", "right", "top", "bottom"]).optional(), tone: z.string().optional() });
const spotlightProps = z.object({ rect: z.tuple([z.number(), z.number(), z.number().positive(), z.number().positive()]), dimOpacity: z.number().min(0).max(1).optional() });
const deviceProps = z.object({ position, width: z.number().positive().optional(), height: z.number().positive().optional(), title: z.string().optional(), frame: z.enum(["phone", "browser"]).optional() });
const iconProps = z.object({ position, name: z.string(), size: z.number().positive().optional(), color: z.string().optional() });
const audioClipProps = z.object({ asset: z.string().min(1), volume: z.number().min(0).max(1).optional() });
const mediaProps = z.object({
  asset: z.string().min(1),
  layout: z.object({ position, width: z.number().positive(), height: z.number().positive() }),
  fit: z.enum(["cover", "contain"]).optional(),
  opacity: z.number().min(0).max(1).optional(),
  overlay: z.number().min(0).max(1).optional(),
  radius: z.number().min(0).max(200).optional(),
});

const schemas = {
  "typography.headline": typographyPropsSchema,
  "typography.body": typographyPropsSchema,
  "typography.label": typographyPropsSchema,
  "ui.browser": browserProps,
  "ui.notification": notificationProps,
  "ui.appGrid": appGridProps,
  "ui.checklist": checklistProps,
  "ui.progress": progressProps,
  "ui.terminal": terminalProps,
  "ui.cursor": cursorProps,
  "ui.offerDashboard": offerDashboardProps,
  "ui.paymentCollision": paymentCollisionProps,
  "ui.pricingDashboard": pricingDashboardProps,
  "infographic.preset": infographicProps,
  "ui.paymentWarning": paymentWarningProps,
    "ui.gpuHero": gpuHeroProps,
      "apple.motion": appleMotionProps,
        "apple.iconFootage": iconFootageProps,
  "chart.exchangeRate": exchangeRateProps,
  "workflow.flow": workflowProps,
  "chart.metric": bigNumberProps,
  "chart.comparison": comparisonProps,
  "chart.bar": barChartProps,
  "chart.counter": counterProps,
  "callout.pointer": calloutProps,
  "effect.spotlight": spotlightProps,
  "device.frame": deviceProps,
  icon: iconProps,
  "audio.clip": audioClipProps,
  "media.image": mediaProps,
  "media.video": mediaProps,
} as const;

export type ComponentKind = keyof typeof schemas;
export const COMPONENT_KINDS = Object.keys(schemas) as ComponentKind[];

export function isRegisteredComponentKind(kind: string): kind is ComponentKind {
  return kind in schemas;
}

export function validateComponentProps(kind: string, props: unknown): string[] {
  if (!isRegisteredComponentKind(kind)) return [`Component kind belum terdaftar: ${kind}`];
  const result = schemas[kind].safeParse(props);
  if (result.success) return [];
  return result.error.issues.map((issue) => `${issue.path.join(".") || "props"}: ${issue.message}`);
}

export const COMPONENT_FAMILIES = {
  typography: ["typography.headline", "typography.body", "typography.label"],
  ui: ["ui.browser", "ui.notification", "ui.appGrid", "ui.checklist", "ui.progress", "ui.terminal", "ui.cursor", "ui.offerDashboard", "ui.paymentCollision", "ui.pricingDashboard", "ui.paymentWarning", "ui.gpuHero"], apple: ["apple.motion", "apple.iconFootage"], infographic: ["infographic.preset"],
  workflow: ["workflow.flow"], charts: ["chart.metric", "chart.comparison", "chart.bar", "chart.counter", "chart.exchangeRate"],
  callouts: ["callout.pointer"], effects: ["effect.spotlight"], devices: ["device.frame"], icons: ["icon"], media: ["media.image", "media.video"], audio: ["audio.clip"],
} as const;
