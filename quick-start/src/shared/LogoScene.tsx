import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { C, FONT } from "./theme";

// ─── Standard Logo Scene ────────────────────────────────────────────────────
// Wrap inside a <Sequence> to control timing — useCurrentFrame() is
// already local to the sequence. Pass `duration` to match the parent
// <Sequence durationInFrames> so fade-out timing is correct.
//
// fadeOut: fades out over the last 15 frames of the sequence
// fadeIn:  fades in over the first 15 frames (default = true)

export const LogoScene: React.FC<{
  fadeIn?: boolean;
  fadeOut?: boolean;
  duration?: number; // MUST match parent <Sequence durationInFrames>
}> = ({ fadeIn = true, fadeOut = false, duration = 45 }) => {
  const f = useCurrentFrame();
  const fadeLen = 15;

  const o = fadeOut
    ? interpolate(f, [duration - fadeLen, duration], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : fadeIn
    ? interpolate(f, [0, fadeLen], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

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
          opacity: o,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 350,
            height: 350,
            borderRadius: 64,
            background: `linear-gradient(135deg, ${C.bl}, #6366f1)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            boxShadow: "0 24px 80px rgba(59, 130, 246, 0.35)",
          }}
        >
          <Img
            src={staticFile("logo-full-white.svg")}
            style={{ width: 350, height: 350 }}
          />
        </div>
        <h1
          style={{
            fontSize: 150,
            fontWeight: 800,
            color: C.wh,
            margin: 0,
            letterSpacing: "-0.02em",
            fontFamily: FONT.heading,
          }}
        >
          Chukfi CMS
        </h1>
        <p style={{ fontSize: 65, color: C.gy, marginTop: 16, fontFamily: FONT.heading }}>
          Ship a CMS in minutes
        </p>
      </div>
    </AbsoluteFill>
  );
};
