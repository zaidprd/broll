// src/theme.ts
// Brand colors — Zaid PRD visual identity

export const theme = {
  bg: "#0A0A0A",
  text: "#FFFFFF",
  primary: "#A3E635", // lime
  accent: {
    yellow: "#FFD600",
    blue: "#3B82F6",
    orange: "#F97316",
  },
} as const;

export type Theme = typeof theme;
