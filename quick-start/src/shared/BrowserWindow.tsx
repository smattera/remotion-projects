import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Browser Window wrapper ─────────────────────────────────────────────────
// Mock browser chrome with macOS dots, address bar, and content slot.
// Wrap inside a <Sequence> to control timing.
// scaleUp: animates the window in from center with a spring (default=true).

export const BrowserWindow: React.FC<{
  url?: string;
  scaleUp?: boolean;
  children: React.ReactNode;
}> = ({ url = "localhost:8080/admin", scaleUp = true, children }) => {
  const f = useCurrentFrame();

  // Single scale animation controls both transform and opacity
  const s = scaleUp
    ? spring({ frame: f + 1, fps: 30, config: { damping: 12, stiffness: 80 } })
    : 1;

  const o = s; // opacity tracks the same spring — avoids desync

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
          width: 1680,
          height: 950,
          background: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          transform: `scale(${s})`,
          opacity: o,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 20px",
            background: C.tb,
            borderBottom: `1px solid ${C.br}`,
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 10, marginRight: 10 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.rd }} />
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.yw }} />
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.gr }} />
          </div>
          <div
            style={{
              flex: 1,
              background: C.bg,
              borderRadius: 8,
              padding: "10px 18px",
              fontFamily: FONT.mono,
              fontSize: 30,
              color: C.gy,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ color: C.gr, fontSize: 32 }}>🔒</span>
            <span>{url}</span>
          </div>
        </div>
        {/* Content area */}
        <div style={{ flex: 1, overflow: "hidden", background: "#f8fafc" }}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};
