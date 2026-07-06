import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";
import { TerminalWindow, TypingLine } from "./TerminalWindow";

// ─── Migration Panel — split-screen: CLI import (left) + table populate (right) ──

const IMPORTED_ROWS = [
  { title: "My Old WP Post 1", type: "blog-posts", status: "draft", frame: 80 },
  { title: "About Our Team", type: "pages", status: "published", frame: 120 },
  { title: "WP Migration Guide", type: "blog-posts", status: "draft", frame: 160 },
  { title: "Contact Us", type: "pages", status: "published", frame: 200 },
];

// ─── Right side: content table that populates as CLI runs ──────────────────
const ImportTable: React.FC = () => {
  const f = useCurrentFrame();

  // Table header visibility
  const headerOpacity = interpolate(f, [40, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: 820,
        height: 960,
        background: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        border: `1px solid ${C.br}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          background: C.bg,
          borderBottom: `1px solid ${C.br}`,
          fontSize: 26,
          fontWeight: 700,
          color: C.wh,
          fontFamily: FONT.heading,
          opacity: headerOpacity,
        }}
      >
        Content Entries
        <span style={{ marginLeft: 12, fontSize: 20, color: C.gr, fontFamily: FONT.mono }}>
          {f >= 40 ? `${Math.floor((f - 40) / 40) + 3} entries` : "3 entries"}
        </span>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          padding: "12px 24px",
          background: "#f1f5f9",
          borderBottom: "1px solid #e2e8f0",
          fontSize: 18,
          fontWeight: 600,
          color: "#64748b",
          fontFamily: FONT.heading,
          opacity: headerOpacity,
        }}
      >
        <span>Title</span>
        <span>Type</span>
        <span>Status</span>
      </div>

      {/* Rows — appear one by one */}
      <div style={{ flex: 1 }}>
        {IMPORTED_ROWS.map((row, i) => {
          if (f < row.frame) return null;
          const localF = f - row.frame;
          const scale = spring({ frame: localF, fps: 30, config: { damping: 12, stiffness: 100 } });
          const opacity = interpolate(localF, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const bg = interpolate(localF, [0, 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div
              key={row.title}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                fontSize: 22,
                fontFamily: FONT.heading,
                transform: `scale(${scale})`,
                opacity,
                background: bg > 0 ? `rgba(34,197,94,${bg * 0.08})` : "transparent",
              }}
            >
              <span style={{ fontWeight: 600, color: C.tb }}>{row.title}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 18, color: "#64748b" }}>{row.type}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: row.status === "published" ? C.gr : "#d97706",
                }}
              >
                {row.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Full split-screen panel ────────────────────────────────────────────────
export const MigrationPanel: React.FC = () => {
  const f = useCurrentFrame();
  const scale = spring({ frame: f, fps: 30, config: { damping: 12, stiffness: 80 } });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        padding: 40,
      }}
    >
      {/* Left: Terminal */}
      <div style={{ transform: `scale(${scale})`, opacity: scale }}>
        <TerminalWindow title="terminal — import">
          <TypingLine text="npx chukfi import --source wordpress.xml" start={10} cmd speed={0.8} />
          <TypingLine text="  ℹ Reading wordpress.xml..." start={60} speed={1} />
          <TypingLine text="  ℹ Parsed 47 posts, 12 pages, 89 media" start={90} speed={1} />
          <TypingLine text="  ✓ Imported blog-posts: 47 entries" start={130} speed={1} />
          <TypingLine text="  ✓ Imported pages: 12 entries" start={170} speed={1} />
          <TypingLine text="  ✓ Imported media: 89 files" start={210} speed={1} />
          <TypingLine text="✓ Import complete!" start={250} speed={1} />
        </TerminalWindow>
      </div>

      {/* Right: Import table */}
      <ImportTable />
    </div>
  );
};
