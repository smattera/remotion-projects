// Shared theme — single source of truth for color palette and typography
// Used by all Chukfi CMS video compositions

export const C = {
  bg: "#0f172a",
  tb: "#1e293b",
  br: "#334155",
  gr: "#22c55e",
  bl: "#3b82f6",
  cy: "#06b6d4",
  wh: "#f8fafc",
  gy: "#94a3b8",
  rd: "#ef4444",
  yw: "#eab308",
  pr: "#a855f7",
  pi: "#ec4899",
  or: "#f97316",
} as const;

export const FONT = {
  heading: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const DIMS = {
  video: { width: 1920, height: 1080 },
} as const;
