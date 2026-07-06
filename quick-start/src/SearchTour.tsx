import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { BrowserWindow } from "./shared/BrowserWindow";
import { SearchPanel } from "./shared/SearchPanel";

// ─── Composition ────────────────────────────────────────────────────────────
export const SearchTour: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>
    <Sequence from={30} durationInFrames={180}>
      <BrowserWindow url="localhost:8080/admin/content" scaleUp>
        <SearchPanel />
      </BrowserWindow>
    </Sequence>
    <Sequence from={210} durationInFrames={30}>
      <LogoScene fadeOut duration={30} />
    </Sequence>
  </AbsoluteFill>
);
