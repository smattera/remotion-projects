import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { BrowserWindow } from "./shared/BrowserWindow";
import { MediaLibrary } from "./shared/MediaLibrary";

// ─── Composition ────────────────────────────────────────────────────────────
export const MediaLibraryTour: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>
    <Sequence from={30} durationInFrames={240}>
      <BrowserWindow url="localhost:8080/admin/media" scaleUp>
        <MediaLibrary />
      </BrowserWindow>
    </Sequence>
    <Sequence from={270} durationInFrames={30}>
      <LogoScene fadeOut duration={30} />
    </Sequence>
  </AbsoluteFill>
);
