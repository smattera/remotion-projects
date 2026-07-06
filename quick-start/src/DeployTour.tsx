import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, interpolate } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { TerminalWindow, TypingLine } from "./shared/TerminalWindow";
import { ArchitectureDiagram } from "./shared/ArchitectureDiagram";
import { C, FONT } from "./shared/theme";

// ─── Scene 2: Deploy Terminal (frames 30-150, 4s) ──────────────────────────
const DeployTerminal: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}
  >
    <TerminalWindow title="terminal — npx chukfi deploy">
      <TypingLine text="npx chukfi deploy" start={10} cmd speed={1} />
      <TypingLine text="  ℹ Detecting AWS credentials..." start={34} speed={1} />
      <TypingLine text="  ℹ Synthesizing CloudFormation stack..." start={54} speed={1} />
      <TypingLine text="  ✓ Deploying: VPC, RDS, ECS, S3, CloudFront..." start={74} speed={1} />
      <TypingLine text="  ✓ Created .env.production" start={94} speed={1} />
    </TerminalWindow>
  </AbsoluteFill>
);

// ─── Scene 4: Payoff — Live URL card (frames 330-360, 1s) ──────────────────
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
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: C.gr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          marginBottom: 36,
          boxShadow: "0 24px 80px rgba(34, 197, 94, 0.3)",
        }}
      >
        <span style={{ fontSize: 140, color: C.wh, fontWeight: 900 }}>🚀</span>
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
        Live on AWS
      </h1>
      <div
        style={{
          marginTop: 24,
          padding: "28px 56px",
          background: C.tb,
          borderRadius: 12,
          border: `2px solid ${C.br}`,
          opacity,
        }}
      >
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 50,
            color: C.cy,
          }}
        >
          https://d1234.cloudfront.net
        </span>
      </div>
      <p
        style={{
          fontSize: 36,
          color: C.gy,
          marginTop: 32,
          opacity,
          fontFamily: FONT.heading,
        }}
      >
        One command. No AWS console.
      </p>
    </AbsoluteFill>
  );
};

// ─── Composition ────────────────────────────────────────────────────────────
export const DeployTour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (0-1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: CLI deploy execution (1-5s) */}
    <Sequence from={30} durationInFrames={120}>
      <DeployTerminal />
    </Sequence>

    {/* Scene 3: AWS Architecture Diagram (5-11s) */}
    <Sequence from={150} durationInFrames={180}>
      <ArchitectureDiagram />
    </Sequence>

    {/* Scene 4: Payoff + Outro (11-12s) */}
    <Sequence from={330} durationInFrames={30}>
      <Payoff />
    </Sequence>
  </AbsoluteFill>
);
