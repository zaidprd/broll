import React from "react";
import { Img, OffthreadVideo } from "remotion";
import type { ClipAnimation } from "../../engine/MotionProject";
import { useEntrance } from "../shared/motion";

export type EditorialMediaProps = {
  src: string;
  layout: { position: [number, number]; width: number; height: number };
  fit?: "cover" | "contain";
  opacity?: number;
  overlay?: number;
  radius?: number;
  enter?: ClipAnimation;
};

const frameStyle = (props: EditorialMediaProps, motion: ReturnType<typeof useEntrance>): React.CSSProperties => ({
  position: "absolute",
  left: props.layout.position[0],
  top: props.layout.position[1],
  width: props.layout.width,
  height: props.layout.height,
  overflow: "hidden",
  borderRadius: props.radius ?? 0,
  opacity: (props.opacity ?? 1) * motion.opacity,
  transform: `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})`,
  transformOrigin: "center center",
  background: "#1E293B",
});

const mediaStyle = (fit: "cover" | "contain"): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  objectFit: fit,
});

const Overlay: React.FC<{ opacity: number }> = ({ opacity }) => opacity > 0 ? <div style={{ position: "absolute", inset: 0, background: "#000", opacity, pointerEvents: "none" }} /> : null;

export const EditorialImage: React.FC<EditorialMediaProps> = (props) => {
  const motion = useEntrance(props.enter);
  return <div style={frameStyle(props, motion)}>
    <Img src={props.src} style={mediaStyle(props.fit ?? "cover")} />
    <Overlay opacity={props.overlay ?? 0} />
  </div>;
};

export const EditorialVideo: React.FC<EditorialMediaProps> = (props) => {
  const motion = useEntrance(props.enter);
  return <div style={frameStyle(props, motion)}>
    <OffthreadVideo src={props.src} style={mediaStyle(props.fit ?? "cover")} muted />
    <Overlay opacity={props.overlay ?? 0} />
  </div>;
};
