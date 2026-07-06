import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
} from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { BrowserWindow } from "./shared/BrowserWindow";
import { C, FONT } from "./shared/theme";

// ─── Admin UI Tour Composition ──────────────────────────────────────────────
// Shows the actual CMS interface: dashboard → content editor → media library.
// Total: 360 frames (12s) @ 30fps.

// ─── Mock Sidebar ──────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { label: "Dashboard",  icon: "📊", active: false },
  { label: "Content",    icon: "📝", active: true },
  { label: "Media",      icon: "🖼️", active: false },
  { label: "Schema",     icon: "🧱", active: false },
  { label: "Settings",   icon: "⚙️", active: false },
];

const Sidebar: React.FC = () => (
  <div
    style={{
      width: 280,
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      gap: 8,
      flexShrink: 0,
      borderRight: `1px solid ${C.br}`,
    }}
  >
    {/* Logo area */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
        padding: "0 8px",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${C.bl}, #6366f1)`,
        }}
      />
      <span style={{ color: C.wh, fontWeight: 700, fontSize: 32, fontFamily: FONT.heading }}>
        Chukfi
      </span>
    </div>
    {SIDEBAR_ITEMS.map((item) => (
      <div
        key={item.label}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          borderRadius: 10,
          fontSize: 32,
          fontFamily: FONT.heading,
          color: item.active ? C.wh : C.gy,
          background: item.active ? C.tb : "transparent",
          fontWeight: item.active ? 600 : 400,
        }}
      >
        <span style={{ fontSize: 36 }}>{item.icon}</span>
        {item.label}
      </div>
    ))}
  </div>
);

// ─── Content Editor Scene (frames 0-300) ───────────────────────────────────
// Shows the main content area with an animated "create post" workflow.

const ContentEditor: React.FC = () => {
  const f = useCurrentFrame();

  // Title field typing animation — starts at frame 50, types "My First Astro Post" letter by letter
  const titleText = "My First Astro Post";
  const titleStart = 50;
  const titleSpeed = 2; // 2 frames per char
  const titleChars = Math.min(
    Math.floor(Math.max(0, f - titleStart) / titleSpeed),
    titleText.length
  );

  // Body field — starts typing after title finishes (~frame 120)
  const bodyText = "Building a CMS-powered Astro site has never been this simple. Just write your content, hit publish, and Chukfi handles the rest.";
  const bodyStart = 120;
  const bodySpeed = 1.2;
  const bodyChars = Math.min(
    Math.floor(Math.max(0, f - bodyStart) / bodySpeed),
    bodyText.length
  );
  const bodyDone = bodyChars >= bodyText.length;

  // Publish button spring — triggers after body is done (~frame 260)
  const pubStart = 260;
  const pubLocal = Math.max(0, f - pubStart);
  const pubScale = spring({
    frame: pubLocal,
    fps: 30,
    config: { damping: 10, stiffness: 200 },
  });

  // Success toast slide-in
  const toastLocal = Math.max(0, f - pubStart - 15);
  const toastSlide = spring({
    frame: toastLocal,
    fps: 30,
    config: { damping: 14, stiffness: 100 },
  });
  const toastOpacity = interpolate(toastLocal, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Status pill transition (Draft → Published)
  const statusOpacity = interpolate(toastLocal, [5, 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", flex: 1, height: "100%" }}>
      <Sidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 40px",
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 48, fontWeight: 700, color: C.tb, fontFamily: FONT.heading }}>
              New Blog Post
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: 28, color: "#94a3b8", fontFamily: FONT.heading }}>
              Create and publish a new content entry
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Status pill: Draft */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 40,
                background: "#fef3c7",
                opacity: statusOpacity,
                fontSize: 28,
                fontWeight: 600,
                color: "#d97706",
                fontFamily: FONT.heading,
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d97706" }} />
              Draft
            </div>
            {/* Status pill: Published (slides in) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 40,
                background: "#dcfce7",
                position: "absolute",
                right: 40,
                opacity: toastOpacity,
                fontSize: 28,
                fontWeight: 600,
                color: C.gr,
                fontFamily: FONT.heading,
                transform: `translateY(${(1 - toastSlide) * -20}px)`,
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: C.gr }} />
              Published
            </div>
            {/* Publish button */}
            <div
              style={{
                padding: "14px 36px",
                borderRadius: 10,
                background: C.bl,
                color: C.wh,
                fontSize: 30,
                fontWeight: 700,
                fontFamily: FONT.heading,
                transform: `scale(${pubScale})`,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              }}
            >
              Publish
            </div>
          </div>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, padding: "40px 40px", overflow: "auto" }}>
          {/* Title input */}
          <div style={{ marginBottom: 36 }}>
            <label
              style={{
                display: "block",
                fontSize: 26,
                fontWeight: 600,
                color: C.tb,
                marginBottom: 10,
                fontFamily: FONT.heading,
              }}
            >
              Title
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "22px 28px",
                background: "#ffffff",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                minHeight: 76,
                fontSize: 36,
                fontFamily: FONT.heading,
                color: C.tb,
              }}
            >
              {titleChars > 0 ? titleText.slice(0, titleChars) : null}
              {titleChars < titleText.length && f >= titleStart && (
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 42,
                    background: C.bl,
                    opacity: Math.floor((f - titleStart) / 10) % 2 ? 1 : 0,
                    marginLeft: 2,
                  }}
                />
              )}
              {f < titleStart && (
                <span style={{ color: "#94a3b8" }}>Enter post title...</span>
              )}
            </div>
          </div>

          {/* Body editor */}
          <div style={{ marginBottom: 36 }}>
            <label
              style={{
                display: "block",
                fontSize: 26,
                fontWeight: 600,
                color: C.tb,
                marginBottom: 10,
                fontFamily: FONT.heading,
              }}
            >
              Content
            </label>
            <div
              style={{
                padding: "28px",
                background: "#ffffff",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                minHeight: 320,
                fontSize: 28,
                fontFamily: FONT.heading,
                color: C.tb,
                lineHeight: 1.7,
              }}
            >
              {bodyChars > 0 ? bodyText.slice(0, bodyChars) : null}
              {!bodyDone && f >= bodyStart && (
                <span
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 34,
                    background: C.bl,
                    opacity: Math.floor((f - bodyStart) / 10) % 2 ? 1 : 0,
                    marginLeft: 2,
                  }}
                />
              )}
              {f < bodyStart && (
                <span style={{ color: "#94a3b8" }}>Write your content here...</span>
              )}
            </div>
          </div>

          {/* Stats row at bottom */}
          <div style={{ display: "flex", gap: 24, marginTop: "auto" }}>
            {[
              { label: "Words", value: Math.max(0, bodyChars > 0 ? Math.floor(bodyChars / 5) : 0).toString() },
              { label: "Read Time", value: bodyChars > 20 ? "2 min" : "—" },
              { label: "Type", value: "blog-posts" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: "16px 28px",
                  background: "#ffffff",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                  fontFamily: FONT.heading,
                }}
              >
                <div style={{ fontSize: 22, color: "#94a3b8", marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 600, color: C.tb }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Composition ────────────────────────────────────────────────────────────
export const AdminUITour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (frames 0-30, 1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: Browser window with Admin UI content editor (frames 30-340, ~10.3s) */}
    <Sequence from={30} durationInFrames={310}>
      <BrowserWindow url="my-site.com/admin" scaleUp>
        <ContentEditor />
      </BrowserWindow>
    </Sequence>

    {/* Scene 3: Logo outro (frames 340-360, ~0.7s) */}
    <Sequence from={340} durationInFrames={20}>
      <LogoScene fadeOut duration={20} />
    </Sequence>
  </AbsoluteFill>
);
