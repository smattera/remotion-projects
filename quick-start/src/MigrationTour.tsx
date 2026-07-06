import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { MigrationPanel } from "./shared/MigrationPanel";

// ─── Composition — Total: 360 frames (12s) @ 30fps ──────────────────────────
export const MigrationTour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (0-1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: Split-screen CLI import + content table (1-11s) — 300 frames to reach the "Import complete!" payoff at local frame 250 */}
    <Sequence from={30} durationInFrames={300}>
      <MigrationPanel />
    </Sequence>

    {/* Scene 3: Logo outro (11-12s) */}
    <Sequence from={330} durationInFrames={30}>
      <LogoScene fadeOut duration={30} />
    </Sequence>
  </AbsoluteFill>
);
