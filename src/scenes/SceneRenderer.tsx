// src/scenes/SceneRenderer.tsx
// Generic Phase 2 renderer for validated MotionProject clips.

import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import type { CompiledClip, MotionProject } from "../engine/MotionProject";
import type { MotionRenderJob } from "../engine/RenderJob";
import { compileTimeline } from "../engine/TimelineCompiler";
import { resolveToken } from "../engine/TokenResolver";
import { TypographyClip } from "../components/typography/TypographyClip";
import { BrowserWindow, NotificationCard, AppGrid, Checklist, ProgressBar, TerminalTyping, CursorClick } from "../components/ui/UiComponents";
import { WorkflowFlow } from "../components/workflow/WorkflowFlow";
import { BigNumber, Comparison, BarChart, Counter } from "../components/charts/Charts";
import { Callout } from "../components/callouts/Callouts";
import { Spotlight } from "../components/effects/Effects";
import { DeviceFrame } from "../components/devices/DeviceFrame";
import { Icon } from "../components/icons/Icon";
import { AudioClip } from "../components/shared/AudioClip";
import { EditorialImage, EditorialVideo } from "../components/media/EditorialMedia";
import { resolveAsset, resolveAssetUrl } from "../engine/AssetResolver";
import { getSfxUrl } from "../sfx/synth";

function propsOf<T>(clip: CompiledClip): T {
  return clip.props as T;
}

function renderClip(clip: CompiledClip, job: MotionRenderJob): React.ReactNode {
  switch (clip.kind) {
    case "typography.headline":
    case "typography.body":
    case "typography.label": {
      const props = propsOf<Parameters<typeof TypographyClip>[0]["props"]>(clip);
      return <TypographyClip props={{ ...props, color: props.color ? resolveToken(props.color, job.project) : undefined }} enter={clip.enter} durationInFrames={clip.durationFrames} audioEnabled={job.audio.sfxEnabled} sfxVolume={job.audio.sfxVolume} />;
    }
    case "ui.browser": return <BrowserWindow {...propsOf<Parameters<typeof BrowserWindow>[0]>(clip)} enter={clip.enter} />;
    case "ui.notification": return <NotificationCard {...propsOf<Parameters<typeof NotificationCard>[0]>(clip)} enter={clip.enter} />;
    case "ui.appGrid": return <AppGrid {...propsOf<Parameters<typeof AppGrid>[0]>(clip)} enter={clip.enter} />;
    case "ui.checklist": return <Checklist {...propsOf<Parameters<typeof Checklist>[0]>(clip)} enter={clip.enter} />;
    case "ui.progress": return <ProgressBar {...propsOf<Parameters<typeof ProgressBar>[0]>(clip)} enter={clip.enter} />;
    case "ui.terminal": return <TerminalTyping {...propsOf<Parameters<typeof TerminalTyping>[0]>(clip)} enter={clip.enter} />;
    case "ui.cursor": return <CursorClick {...propsOf<Parameters<typeof CursorClick>[0]>(clip)} enter={clip.enter} />;
    case "workflow.flow": return <WorkflowFlow {...propsOf<Parameters<typeof WorkflowFlow>[0]>(clip)} enter={clip.enter} />;
    case "chart.metric": return <BigNumber {...propsOf<Parameters<typeof BigNumber>[0]>(clip)} enter={clip.enter} />;
    case "chart.comparison": return <Comparison {...propsOf<Parameters<typeof Comparison>[0]>(clip)} enter={clip.enter} />;
    case "chart.bar": return <BarChart {...propsOf<Parameters<typeof BarChart>[0]>(clip)} enter={clip.enter} />;
    case "chart.counter": return <Counter {...propsOf<Parameters<typeof Counter>[0]>(clip)} enter={clip.enter} />;
    case "callout.pointer": return <Callout {...propsOf<Parameters<typeof Callout>[0]>(clip)} enter={clip.enter} />;
    case "effect.spotlight": return <Spotlight {...propsOf<Parameters<typeof Spotlight>[0]>(clip)} enter={clip.enter} />;
    case "device.frame": return <DeviceFrame {...propsOf<Parameters<typeof DeviceFrame>[0]>(clip)} enter={clip.enter} />;
    case "icon": return <Icon {...propsOf<Parameters<typeof Icon>[0]>(clip)} enter={clip.enter} />;
    case "audio.clip": return <AudioClip project={job.project} {...propsOf<{ asset: string; volume?: number }>(clip)} />;
    case "media.image": {
      const props = propsOf<{ asset: string; layout: { position: [number, number]; width: number; height: number }; fit?: "cover" | "contain"; opacity?: number; overlay?: number; radius?: number }>(clip);
      const asset = resolveAsset(props.asset, job.project);
      if (asset.type !== "image") throw new Error(`Asset ${props.asset} harus bertipe image.`);
      return <EditorialImage {...props} src={resolveAssetUrl(props.asset, job.project)} enter={clip.enter} />;
    }
    case "media.video": {
      const props = propsOf<{ asset: string; layout: { position: [number, number]; width: number; height: number }; fit?: "cover" | "contain"; opacity?: number; overlay?: number; radius?: number }>(clip);
      const asset = resolveAsset(props.asset, job.project);
      if (asset.type !== "video") throw new Error(`Asset ${props.asset} harus bertipe video.`);
      return <EditorialVideo {...props} src={resolveAssetUrl(props.asset, job.project)} enter={clip.enter} />;
    }
    default: throw new Error(`Renderer belum tersedia untuk component: ${clip.kind}`);
  }
}

export const SceneRenderer: React.FC<{ job: MotionRenderJob }> = ({ job }) => {
  const timeline = compileTimeline(job.project);
  return <AbsoluteFill style={{ backgroundColor: resolveToken(job.project.format.background, job.project) }}>
    {job.audio.padEnabled && <Audio src={getSfxUrl("pad")} volume={job.audio.padVolume} />}
    {timeline.clips.map((clip) => <Sequence key={clip.id} from={clip.from} durationInFrames={clip.durationFrames}>{renderClip(clip, job)}</Sequence>)}
  </AbsoluteFill>;
};

export function getProjectDuration(project: MotionProject): number {
  return compileTimeline(project).durationInFrames;
}
