import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Search Panel — mock admin UI search with results ──────────────────────

const ALL_ENTRIES = [
  { title: "Build a blog with Astro and Chukfi", type: "blog-posts", match: true },
  { title: "Chukfi v1.0 release notes", type: "blog-posts", match: false },
  { title: "Astro integration guide", type: "pages", match: true },
  { title: "Welcome to Chukfi", type: "pages", match: false },
  { title: "How to deploy to AWS", type: "blog-posts", match: false },
];

export const SearchPanel: React.FC = () => {
  const f = useCurrentFrame();

  // ── Typing "Astro" in search bar ──
  const query = "Astro";
  const typeStart = 30;
  const queryChars = Math.min(Math.floor(Math.max(0, f - typeStart) / 2), query.length);
  const typingDone = queryChars >= query.length;

  // ── After typing finishes, results highlight with spring animation ──
  const resultsStart = 100;
  const showResults = f >= resultsStart;

  // ── Postgres badge pops in after results ──
  const badgeStart = 150;
  const badgeLocal = Math.max(0, f - badgeStart);
  const badgeSlide = spring({ frame: badgeLocal, fps: 30, config: { damping: 12, stiffness: 80 } });
  const badgeOpacity = interpolate(badgeLocal, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        height: "100%",
        padding: 32,
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
      </div>

      {/* Search bar */}
      <div
        style={{
          position: "relative",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "18px 24px",
            background: "#fff",
            borderRadius: 12,
            border: `2px solid ${typingDone ? C.bl : "#e2e8f0"}`,
            boxShadow: typingDone ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
          }}
        >
          <span style={{ fontSize: 28, marginRight: 14 }}>🔍</span>
          <input
            readOnly
            value={f >= typeStart ? query.slice(0, queryChars) : ""}
            placeholder="Search content..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 28,
              fontFamily: FONT.heading,
              color: C.tb,
              background: "transparent",
            }}
          />
          {!typingDone && f >= typeStart && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 32,
                background: C.bl,
                opacity: Math.floor((f - typeStart) / 10) % 2 ? 1 : 0,
              }}
            />
          )}
        </div>
      </div>

      {/* Results table */}
      <div
        style={{
          background: "#fff",
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
            gridTemplateColumns: "2.5fr 1fr",
            padding: "14px 24px",
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
        </div>

        {ALL_ENTRIES.map((entry, i) => {
          const rowLocal = Math.max(0, f - resultsStart - i * 12);
          const rowOpacity = interpolate(rowLocal, [0, 8], [0, entry.match ? 1 : 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          // Highlight matching text
          const parts = entry.match
            ? entry.title.split(new RegExp(`(${query})`, "gi"))
            : [entry.title];

          return (
            <div
              key={entry.title}
              style={{
                display: "grid",
                gridTemplateColumns: "2.5fr 1fr",
                padding: "18px 24px",
                borderBottom: "1px solid #e2e8f0",
                fontSize: 24,
                fontFamily: FONT.heading,
                opacity: rowOpacity,
                background: entry.match && showResults ? "#eff6ff" : "transparent",
                transition: "background 0.3s",
              }}
            >
              <div>
                {entry.match && showResults
                  ? parts.map((part, j) =>
                      part.toLowerCase() === query.toLowerCase() ? (
                        <mark
                          key={j}
                          style={{
                            background: "#fef08a",
                            color: C.tb,
                            fontWeight: 600,
                            borderRadius: 3,
                            padding: "2px 4px",
                          }}
                        >
                          {part}
                        </mark>
                      ) : (
                        <span key={j} style={{ color: rowLocal > 2 ? C.tb : C.gy }}>{part}</span>
                      )
                    )
                  : (
                    <span style={{ color: C.gy }}>{entry.title}</span>
                  )}
              </div>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 20,
                  color: "#64748b",
                }}
              >
                {entry.type}
              </span>
            </div>
          );
        })}
      </div>

      {/* PostgreSQL GIN Index badge */}
      {f >= badgeStart && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            background: C.tb,
            border: `2px solid ${C.pr}`,
            borderRadius: 12,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transform: `translateY(${(1 - badgeSlide) * 40}px)`,
            opacity: badgeOpacity,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 28 }}>⚡</span>
          <div>
            <div style={{ color: C.wh, fontSize: 22, fontWeight: 600, fontFamily: FONT.heading }}>
              PostgreSQL Full-Text Search
            </div>
            <div style={{ color: C.gy, fontSize: 18, fontFamily: FONT.mono, marginTop: 4 }}>
              tsvector + GIN index · No Algolia · No Elasticsearch
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
