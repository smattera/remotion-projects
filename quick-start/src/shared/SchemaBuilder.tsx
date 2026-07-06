import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Schema Builder — custom content type definition UI ────────────────────

const FIELDS = [
  { label: "Text",    icon: "Aa", color: C.bl },
  { label: "Rich Text", icon: "¶", color: C.pr },
  { label: "Date",    icon: "📅", color: C.or },
  { label: "Number",  icon: "#", color: C.gr },
  { label: "Boolean", icon: "✓", color: C.cy },
  { label: "Media",   icon: "🖼", color: C.pi },
];

// Fields being added to "Job Openings" type, one at a time
const JOB_FIELDS = [
  { name: "title",         type: "Text" },
  { name: "salary",        type: "Text" },
  { name: "location",      type: "Text" },
  { name: "deadline",      type: "Date" },
];

export const SchemaBuilder: React.FC = () => {
  const f = useCurrentFrame();

  // ── Title typing ──
  const typeTitle = "Job Openings";
  const titleStart = 30;
  const titleChars = Math.min(Math.floor(Math.max(0, f - titleStart) / 1.5), typeTitle.length);

  // ── Field rows animate in ──
  const fieldStarts = [100, 140, 180, 220];

  // ── Codegen tab highlight (appears after all fields) ──
  const codegenHighlight = f >= 260;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f8fafc",
        display: "flex",
        fontFamily: FONT.heading,
      }}
    >
      {/* Left sidebar */}
      <div
        style={{
          width: 280,
          background: C.bg,
          padding: "24px 16px",
          borderRight: `1px solid ${C.br}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 18, color: "#64748b", textTransform: "uppercase", marginBottom: 16 }}>
          Content Types
        </div>
        {["Blog Posts", "Events", "Pages", "Services"].map((item) => (
          <div
            key={item}
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              marginBottom: 6,
              fontSize: 24,
              color: C.gy,
              cursor: "pointer",
            }}
          >
            {item}
          </div>
        ))}
        {/* Active "Job Openings" */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            fontSize: 24,
            color: C.wh,
            background: C.tb,
            fontWeight: 600,
            position: "relative",
          }}
        >
          {f >= 40 ? (
            <>
              <span style={{ color: C.gr, marginRight: 8 }}>●</span>
              {typeTitle.slice(0, titleChars)}
              {titleChars < typeTitle.length && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 28,
                    background: C.bl,
                    opacity: Math.floor((f - titleStart) / 10) % 2 ? 1 : 0,
                    marginLeft: 1,
                  }}
                />
              )}
            </>
          ) : (
            <span style={{ color: C.gy }}>+ New</span>
          )}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: "28px 36px",
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 40, fontWeight: 700, color: C.tb }}>
              Define Content Type
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: 24, color: "#94a3b8" }}>
              Add fields to create a structured content schema
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 28px",
              background: C.bl,
              borderRadius: 10,
              color: C.wh,
              fontSize: 26,
              fontWeight: 700,
              opacity: f >= 60 ? 1 : 0.4,
            }}
          >
            + Add Field
          </div>
        </div>

        {/* Field palette + added fields */}
        <div style={{ flex: 1, padding: "28px 36px", overflow: "auto" }}>
          {/* Field type palette */}
          {f >= 50 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 28,
                opacity: interpolate(f, [50, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              {FIELDS.map((field) => (
                <div
                  key={field.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 10,
                    background: "#fff",
                    border: `2px solid #e2e8f0`,
                    fontSize: 24,
                    color: C.tb,
                    cursor: "pointer",
                    fontFamily: FONT.heading,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: field.color, fontSize: 28, fontFamily: FONT.mono }}>
                    {field.icon}
                  </span>
                  {field.label}
                </div>
              ))}
            </div>
          )}

          {/* Added fields — appear one by one */}
          {JOB_FIELDS.map((field, i) => {
            const sf = fieldStarts[i];
            if (f < sf) return null;
            const localF = f - sf;
            const scale = spring({ frame: localF, fps: 30, config: { damping: 14, stiffness: 100 } });
            const opacity = interpolate(localF, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div
                key={field.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "18px 24px",
                  background: "#fff",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  marginBottom: 12,
                  transform: `scale(${scale})`,
                  opacity,
                  transformOrigin: "left",
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${C.bl}15`,
                    color: C.bl,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 22,
                      color: "#64748b",
                      marginBottom: 4,
                      fontFamily: FONT.heading,
                    }}
                  >
                    Field Name
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 600,
                      color: C.tb,
                      fontFamily: FONT.mono,
                    }}
                  >
                    {field.name}
                  </div>
                </div>
                <div
                  style={{
                    padding: "8px 18px",
                    background: `${C.cy}12`,
                    borderRadius: 8,
                    fontSize: 24,
                    fontWeight: 600,
                    color: C.cy,
                    fontFamily: FONT.heading,
                  }}
                >
                  {field.type}
                </div>
                <span style={{ fontSize: 24, color: C.gr }}>✓</span>
              </div>
            );
          })}

          {/* Codegen tab — slides up from bottom after last field */}
          {codegenHighlight && (
            <div
              style={{
                marginTop: 40,
                padding: "28px 32px",
                background: C.bg,
                borderRadius: 12,
                border: `2px solid ${C.cy}`,
                opacity: interpolate(f, [260, 275], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                transform: `translateY(${spring({ frame: f - 260, fps: 30, config: { damping: 14, stiffness: 80 } }) * 0}px)`,
              }}
            >
              <div style={{ fontSize: 22, color: C.gy, marginBottom: 12, fontFamily: FONT.heading }}>
                ⚡ Generated types
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 24, lineHeight: 1.8, color: C.wh }}>
                <span style={{ color: "#c084fc" }}>export</span>
                <span style={{ color: C.wh }}> interface </span>
                <span style={{ color: C.cy }}>JobOpenings</span>
                <span style={{ color: C.wh }}>{' {'}</span>
                <br />
                <span style={{ color: C.wh }}>  title: </span>
                <span style={{ color: C.gr }}>string</span>;
                <br />
                <span style={{ color: C.wh }}>  salary: </span>
                <span style={{ color: C.gr }}>string</span>;
                <br />
                <span style={{ color: C.wh }}>  location: </span>
                <span style={{ color: C.gr }}>string</span>;
                <br />
                <span style={{ color: C.wh }}>  deadline: </span>
                <span style={{ color: C.gr }}>string</span>;
                <br />
                <span style={{ color: C.wh }}>{'}'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
