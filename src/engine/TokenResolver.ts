// src/engine/TokenResolver.ts

import type { MotionProject } from "./MotionProject";

export function resolveToken(value: string, project: MotionProject): string {
  if (!value.startsWith("@")) return value;

  const [, group, key] = value.match(/^@([a-zA-Z]+)\.([a-zA-Z0-9-_]+)$/) ?? [];
  if (!group || !key) {
    throw new Error(`Format token tidak valid: ${value}`);
  }

  const tokenGroup = group === "colors"
    ? project.tokens.colors
    : group === "fonts"
      ? project.tokens.fonts
      : undefined;
  const resolved = tokenGroup?.[key];
  if (!resolved) throw new Error(`Token tidak ditemukan: ${value}`);
  return resolved;
}
