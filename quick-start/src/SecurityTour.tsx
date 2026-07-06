import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { SecurityPanel } from "./shared/SecurityPanel";

// ─── Composition — Total: 370 frames (12.3s) @ 30fps ───────────────────────
// SecurityPanel has late-stage animations: Bob at frame 250, Charlie at 280,
// Entra badge at 270. The middle sequence needs 310 frames to reach all
// those payoffs with breathing room before the logo outro.
export const SecurityTour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (0-1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: Split-screen Security Panel (1-11.3s) */}
    <Sequence from={30} durationInFrames={310}>
      <SecurityPanel />
    </Sequence>

    {/* Scene 3: Logo outro (11.3-12.3s) */}
    <Sequence from={340} durationInFrames={30}>
      <LogoScene fadeOut duration={30} />
    </Sequence>
  </AbsoluteFill>
);
