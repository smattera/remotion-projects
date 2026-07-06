import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, interpolate } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { BrowserWindow } from "./shared/BrowserWindow";
import { SchemaBuilder } from "./shared/SchemaBuilder";
import { C, FONT } from "./shared/theme";

// ─── Payoff scene: "Adapts to your domain" ──────────────────────────────────
const Payoff: React.FC = () => {
  const f = useCurrentFrame();
  const scale = spring({ frame: f, fps: 30, config: { damping: 10, stiffness: 100 } });
  const opacity = interpolate(f, [0, 12], [0, 1], {
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
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: C.pr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          marginBottom: 36,
          boxShadow: "0 24px 80px rgba(168, 85, 247, 0.3)",
        }}
      >
        <span style={{ fontSize: 100 }}>🧱</span>
      </div>
      <h1
        style={{
          fontSize: 120,
          fontWeight: 800,
          color: C.wh,
          margin: 0,
          opacity,
          fontFamily: FONT.heading,
        }}
      >
        Adapts to Your Domain
      </h1>
      <p style={{ fontSize: 42, color: C.gy, marginTop: 20, opacity, fontFamily: FONT.heading, textAlign: "center", maxWidth: 1200 }}>
        Define any content type. Chukfi generates the schema, API, and TypeScript types.
      </p>
    </AbsoluteFill>
  );
};

// ─── Composition ────────────────────────────────────────────────────────────
export const SchemaBuilderTour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (0-1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: Browser window with Schema Builder (1-11s) */}
    <Sequence from={30} durationInFrames={300}>
      <BrowserWindow url="localhost:8080/admin/schema" scaleUp>
        <SchemaBuilder />
      </BrowserWindow>
    </Sequence>

    {/* Scene 3: Payoff + Logo outro (11-12s) */}
    <Sequence from={330} durationInFrames={30}>
      <Payoff />
    </Sequence>
  </AbsoluteFill>
);
