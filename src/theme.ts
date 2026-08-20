// src/theme.ts
// Brand colors — Zaid PRD visual identity

export const theme = {
  bg: "#1E293B",
  text: "#FFFFFF",
  surface: "#F8FAFC",
  muted: "#94A3B8",
  primary: "#10B981",
  accent: {
    blue: "#2563EB",
  },
  chroma: "#00FF00",
} as const;

export type Theme = typeof theme;
