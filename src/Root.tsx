// src/Root.tsx
// MINIMAL: single Composition, no props, no spec, no LLM.

import React from "react";
import { Composition } from "remotion";
import { Broll } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Broll"
      component={Broll}
      durationInFrames={6 * 30}
      fps={30}
      width={1280}
      height={720}
    />
  );
};