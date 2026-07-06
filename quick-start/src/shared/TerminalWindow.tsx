import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { C, FONT } from "./theme";

// ─── Terminal Window wrapper with macOS-style controls ──────────────────────
// Renders a dark terminal frame. Children are rendered inside the terminal body.

export const TerminalWindow: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = "terminal — chukfi — 80×24",
  children,
}) => (
  <div
    style={{
      width: 1400,
      maxWidth: 1400,
      background: C.tb,
      borderRadius: 16,
      border: `2px solid ${C.br}`,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    }}
  >
    {/* Title bar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 24px",
        background: "#1a1a2e",
        borderBottom: `2px solid ${C.br}`,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ width: 25, height: 25, borderRadius: "50%", background: C.rd }} />
        <div style={{ width: 25, height: 25, borderRadius: "50%", background: C.yw }} />
        <div style={{ width: 25, height: 25, borderRadius: "50%", background: C.gr }} />
      </div>
      <span
        style={{
          marginLeft: 30,
          color: "#64748b",
          fontSize: 45,
          fontFamily: FONT.mono,
        }}
      >
        {title}
      </span>
    </div>
    {/* Terminal body */}
    <div style={{ padding: "24px 28px", minHeight: 360 }}>
      {children}
    </div>
  </div>
);

// ─── Typing Line ────────────────────────────────────────────────────────────
// Animated typewriter effect for a single terminal line.

export const TypingLine: React.FC<{
  text: string;
  start: number;
  cmd?: boolean;
  speed?: number;
}> = ({ text, start, cmd = false, speed = 1 }) => {
  const f = useCurrentFrame();
  const e = f - start;
  if (e < 0) return null;
  const chars = Math.min(Math.floor(e / speed), text.length);
  const done = chars >= text.length;
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: 65,
        lineHeight: 2,
        color: cmd ? C.cy : C.gy,
        whiteSpace: "pre",
        opacity: done ? 1 : interpolate(e, [0, 3], [0, 1]),
      }}
    >
      {cmd && <span style={{ color: C.gr }}>$ </span>}
      {text.slice(0, chars)}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: 60,
            height: 80,
            background: C.wh,
            marginLeft: 2,
            opacity: Math.floor(e / 8) % 2 ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};
