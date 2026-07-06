import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, interpolate } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { TerminalWindow, TypingLine } from "./shared/TerminalWindow";
import { C } from "./shared/theme";

// ─── Scene 2: Terminal (1.5-6.5s, frames 45-154) ───────────────────────────
// One `npx chukfi dev` command then shows outputs as they appear sequentially.

const Terminal: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}
  >
    <TerminalWindow>
      <TypingLine text="npm install @chukfi/cli" start={10} cmd speed={1} />
      <TypingLine text="npx chukfi dev" start={42} cmd speed={1} />
      <TypingLine text="  ✓ API ready on port 8080" start={70} speed={1} />
    </TerminalWindow>
  </AbsoluteFill>
);

// ─── Scene 3: Ready (6.5-8s, frames 155-199) ───────────────────────────────
const Ready: React.FC = () => {
  const f = useCurrentFrame();
  const cs = spring({
    frame: f,
    fps: 30,
    config: { damping: 10, stiffness: 100 },
  });
  const o = interpolate(f, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: C.gr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cs})`,
          marginBottom: 36,
          boxShadow: "0 24px 80px rgba(34, 197, 94, 0.3)",
        }}
      >
        <span style={{ fontSize: 140, color: C.wh, fontWeight: 900 }}>✓</span>
      </div>
      <h1
        style={{
          fontSize: 140,
          fontWeight: 800,
          color: C.wh,
          margin: 0,
          opacity: o,
        }}
      >
        Ready
      </h1>
      <div
        style={{
          marginTop: 24,
          padding: "28px 56px",
          background: C.tb,
          borderRadius: 12,
          border: `2px solid ${C.br}`,
          opacity: o,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 55,
            color: C.cy,
          }}
        >
          http://localhost:8080
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composition ────────────────────────────────────────────────────────────
export const QuickStart: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={45}>
      <LogoScene fadeIn />
    </Sequence>
    <Sequence from={45} durationInFrames={110}>
      <Terminal />
    </Sequence>
    <Sequence from={155} durationInFrames={45}>
      <Ready />
    </Sequence>
    <Sequence from={200} durationInFrames={45}>
      <LogoScene fadeOut />
    </Sequence>
  </AbsoluteFill>
);
