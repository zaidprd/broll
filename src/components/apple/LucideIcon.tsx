import React from "react";
import {staticFile} from "remotion";

export type LucideIconName =
  | "activity"
  | "chart-no-axes-combined"
  | "cpu"
  | "gauge"
  | "list-checks"
  | "microchip"
  | "monitor"
  | "mouse-pointer-click"
  | "network"
  | "panels-top-left"
  | "presentation"
  | "route"
  | "settings"
  | "table-2"
  | "toggle-right"
  | "workflow"
  | "zap";

export const LucideIcon: React.FC<{
  name: LucideIconName;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({name, size = 28, color = "#10B981", opacity = 1}) => {
  const source = staticFile(`icons/lucide/${name}.svg`);
  return <span style={{
    display: "inline-block",
    width: size,
    height: size,
    flex: "0 0 auto",
    backgroundColor: color,
    opacity,
    WebkitMaskImage: `url(${source})`,
    maskImage: `url(${source})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  }} />;
};
