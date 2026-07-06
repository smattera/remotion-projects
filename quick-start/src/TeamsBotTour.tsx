import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, interpolate } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { BrowserWindow } from "./shared/BrowserWindow";
import { TeamsWindow, Message } from "./shared/TeamsWindow";
import { C, FONT } from "./shared/theme";

// ─── Message Timeline ──────────────────────────────────────────────────────
const MESSAGES: Message[] = [
  {
    sender: "user",
    text: "@Chukfi create a draft about our v1 release",
    startFrame: 50,
  },
  {
    sender: "bot",
    text: "📝 Draft created!\n\nTitle: v1 Release\nType: blog-posts\nStatus: draft\nID: 8f3b9a2c",
    startFrame: 130,
  },
];

// ─── Admin UI: Content Table (what appears on the right side) ──────────────
const ContentTable: React.FC = () => {
  const f = useCurrentFrame();

  // New draft row — appears at frame 135 (slightly after bot reply)
  const rowLocal = Math.max(0, f - 135);
  const rowScale = spring({ frame: rowLocal, fps: 30, config: { damping: 12, stiffness: 120 } });
  const rowOpacity = interpolate(rowLocal, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Toast notification — appears at frame 150
  const toastLocal = Math.max(0, f - 150);
  const toastSlide = spring({ frame: toastLocal, fps: 30, config: { damping: 14, stiffness: 80 } });
  const toastOpacity = interpolate(toastLocal, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        height: "100%",
        padding: 32,
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            color: C.tb,
            fontFamily: FONT.heading,
          }}
        >
          Content Entries
        </h3>
        <div
          style={{
            background: C.bl,
            color: C.wh,
            padding: "8px 20px",
            borderRadius: 8,
            fontSize: 22,
            fontWeight: 600,
            fontFamily: FONT.heading,
          }}
        >
          + New
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            padding: "16px 24px",
            background: "#f1f5f9",
            borderBottom: "1px solid #e2e8f0",
            fontSize: 20,
            fontWeight: 600,
            color: "#64748b",
            fontFamily: FONT.heading,
          }}
        >
          <span>Title</span>
          <span>Type</span>
          <span>Status</span>
        </div>

        {/* Row 1: Animated new draft (from Teams Bot) */}
        {f >= 135 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              padding: "20px 24px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 22,
              color: C.tb,
              background: "#f0fdf4",
              transform: `scaleY(${rowScale})`,
              opacity: rowOpacity,
              transformOrigin: "top",
              fontFamily: FONT.heading,
            }}
          >
            <span style={{ fontWeight: 600 }}>v1 Release</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 20, color: "#64748b" }}>blog-posts</span>
            <span
              style={{
                color: "#d97706",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{ width: 10, height: 10, borderRadius: "50%", background: "#d97706" }}
              />{" "}
              Draft
            </span>
          </div>
        )}

        {/* Row 2: Existing published entry */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            fontSize: 22,
            color: C.tb,
            fontFamily: FONT.heading,
          }}
        >
          <span style={{ fontWeight: 600 }}>Astro Integration Guide</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 20, color: "#64748b" }}>pages</span>
          <span
            style={{
              color: C.gr,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.gr }} />{" "}
            Published
          </span>
        </div>

        {/* Row 3: Existing published entry */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            padding: "20px 24px",
            fontSize: 22,
            color: C.tb,
            fontFamily: FONT.heading,
          }}
        >
          <span style={{ fontWeight: 600 }}>Welcome to Chukfi</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 20, color: "#64748b" }}>pages</span>
          <span
            style={{
              color: C.gr,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.gr }} />{" "}
            Published
          </span>
        </div>
      </div>

      {/* Real-time toast notification */}
      {f >= 150 && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            background: C.tb,
            border: `2px solid ${C.gr}`,
            borderRadius: 12,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transform: `translateY(${(1 - toastSlide) * 40}px)`,
            opacity: toastOpacity,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: 28 }}>⚡</span>
          <span
            style={{
              color: C.wh,
              fontSize: 22,
              fontFamily: FONT.heading,
              fontWeight: 500,
            }}
          >
            Draft created via Teams Bot
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Split-Screen Scene ────────────────────────────────────────────────────
const SplitScreen: React.FC = () => {
  const f = useCurrentFrame();
  const scale = spring({ frame: f, fps: 30, config: { damping: 12, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: 40,
      }}
    >
      {/* Teams Chat (Left) */}
      <div style={{ transform: `scale(${scale})`, opacity: scale }}>
        <TeamsWindow messages={MESSAGES} typingStart={80} typingEnd={130} />
      </div>

      {/* Admin UI Browser (Right) */}
      <BrowserWindow
        url="localhost:8080/admin/content"
        scaleUp
        width={840}
        height={880}
        inline
      >
        <ContentTable />
      </BrowserWindow>
    </AbsoluteFill>
  );
};

// ─── Composition ────────────────────────────────────────────────────────────
export const TeamsBotTour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (frames 0-30, 1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: Split-screen demo (frames 30-330, 10s) */}
    <Sequence from={30} durationInFrames={300}>
      <SplitScreen />
    </Sequence>

    {/* Scene 3: Logo outro (frames 330-360, 1s) */}
    <Sequence from={330} durationInFrames={30}>
      <LogoScene fadeOut duration={30} />
    </Sequence>
  </AbsoluteFill>
);
