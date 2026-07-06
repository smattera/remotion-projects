import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Code Editor Window — mock VS Code with IntelliSense ──────────────────

const LINE_HEIGHT = 40;
const FONT_SIZE = 28;

// ─── Sidebar: mock file tree ───────────────────────────────────────────────
const SidebarFiles: React.FC = () => (
  <div
    style={{
      width: 240,
      background: C.tb,
      padding: "16px 12px",
      borderRight: `1px solid ${C.br}`,
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontFamily: FONT.heading,
      }}
    >
      Explorer
    </span>
    <div
      style={{
        marginTop: 16,
        fontSize: 22,
        fontFamily: FONT.mono,
        color: C.wh,
      }}
    >
      <div style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#64748b" }}>▼</span> SRC
      </div>
      <div style={{ marginLeft: 20, fontSize: 20, color: C.gy }}>
        <div style={{ padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span>▼</span> pages
        </div>
        <div
          style={{
            marginLeft: 20,
            padding: "4px 0",
            color: C.cy,
            background: "#1e293b80",
            borderRadius: 4,
          }}
        >
          📄 blog/[slug].astro
        </div>
        <div style={{ padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span>▼</span> types
        </div>
        <div
          style={{
            marginLeft: 20,
            padding: "4px 0",
            color: C.gr,
            fontWeight: 600,
            background: "#22c55e15",
            borderRadius: 4,
          }}
        >
          ✨ chukfi-types.ts
        </div>
      </div>
    </div>
  </div>
);

// ─── LineNumber component ──────────────────────────────────────────────────
const LineNo: React.FC<{ n: number; active?: boolean }> = ({ n, active = false }) => (
  <span
    style={{
      display: "inline-block",
      width: 44,
      textAlign: "right",
      paddingRight: 16,
      color: "#4b5563",
      fontSize: FONT_SIZE - 2,
      fontFamily: FONT.mono,
      background: active ? C.tb : "transparent",
    }}
  >
    {n}
  </span>
);

// ─── Line component: code text + optional cursor ───────────────────────────
const CodeLine: React.FC<{
  line: number;
  text: string;
  cursor?: boolean;
  active?: boolean;
}> = ({ line, text, cursor = false, active = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: LINE_HEIGHT,
      background: active ? C.tb : "transparent",
    }}
  >
    <LineNo n={line} active={active} />
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: FONT_SIZE,
        color: C.wh,
      }}
    >
      {text}
    </span>
    {cursor && (
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: FONT_SIZE - 4,
          background: C.wh,
          marginLeft: 1,
          opacity: Math.floor(useCurrentFrame() / 15) % 2 ? 1 : 0,
        }}
      />
    )}
  </div>
);

// We need a static cursor — useCurrentFrame inside the loop won't work per-line.
const BlinkingCursor: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: FONT_SIZE - 4,
        background: C.wh,
        marginLeft: 1,
        opacity: Math.floor(f / 15) % 2 ? 1 : 0,
      }}
    />
  );
};

// ─── IntelliSense dropdown ─────────────────────────────────────────────────
interface IntelliSenseItem {
  label: string;
  detail: string;
}

const INTELLISENSE_ITEMS: IntelliSenseItem[] = [
  { label: "title", detail: "string" },
  { label: "slug", detail: "string" },
  { label: "body", detail: "string" },
  { label: "status", detail: '"draft" | "published"' },
  { label: "createdAt", detail: "string" },
  { label: "updatedAt", detail: "string" },
];

const IntelliSensePopup: React.FC<{
  startFrame: number;
  selectedIndex?: number;
}> = ({ startFrame, selectedIndex = 0 }) => {
  const f = useCurrentFrame();
  const localF = Math.max(0, f - startFrame);

  if (localF < 0) return null;

  const opacity = interpolate(localF, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 400,
        top: 325, // below the cursor line
        width: 520,
        background: C.tb,
        borderRadius: 10,
        border: `1px solid ${C.br}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        opacity,
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid ${C.br}`,
          fontSize: 18,
          color: "#64748b",
          fontFamily: FONT.heading,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Suggestions</span>
        <span style={{ fontFamily: FONT.mono }}>Ctrl+Space</span>
      </div>
      {/* Items */}
      {INTELLISENSE_ITEMS.map((item, i) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: i === selectedIndex ? `${C.bl}25` : "transparent",
            borderLeft: i === selectedIndex ? `3px solid ${C.bl}` : "3px solid transparent",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 18,
                color: i === selectedIndex ? C.bl : C.cy,
                fontFamily: FONT.mono,
                width: 24,
                textAlign: "center",
              }}
            >
              {i === selectedIndex ? "●" : "○"}
            </span>
            <span
              style={{
                fontSize: 24,
                fontFamily: FONT.mono,
                color: i === selectedIndex ? C.wh : "#e2e8f0",
                fontWeight: i === selectedIndex ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              fontFamily: FONT.mono,
              color: C.gy,
              fontStyle: "italic",
            }}
          >
            {item.detail}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Macro: typed partial line ─────────────────────────────────────────────
const TypedPartial: React.FC<{
  text: string;
  startFrame: number;
  speed?: number;
  color?: string;
}> = ({ text, startFrame, speed = 1, color = C.wh }) => {
  const f = useCurrentFrame();
  const localF = Math.max(0, f - startFrame);
  const chars = Math.min(Math.floor(localF / speed), text.length);

  if (localF < 0) return null;

  return (
    <span style={{ fontFamily: FONT.mono, fontSize: FONT_SIZE, color }}>
      {text.slice(0, chars)}
      {chars < text.length && <BlinkingCursor />}
    </span>
  );
};

// ─── Main Code Editor component ────────────────────────────────────────────
export const CodeEditorWindow: React.FC<{
  /** Frame when IntelliSense popup appears */
  intelliSenseAt: number;
  /** After popup, which item gets highlighted? (0-indexed) */
  intelliSenseSelect: number;
  /** Frame when the selected item gets inserted into code */
  insertAt: number;
}> = ({ intelliSenseAt, intelliSenseSelect, insertAt }) => {
  const f = useCurrentFrame();

  // Show IntelliSense after popup frame and before insertion
  const showIS = f >= intelliSenseAt && f < insertAt + 10;

  // After insertion, show the completed line
  const postInsert = f >= insertAt;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: C.bg,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        border: `1px solid ${C.br}`,
        display: "flex",
        position: "relative",
      }}
    >
      <SidebarFiles />

      {/* Editor area */}
      <div style={{ flex: 1, position: "relative", paddingTop: 20 }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${C.br}`,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              background: C.bg,
              borderRight: `1px solid ${C.br}`,
              borderBottom: `2px solid ${C.bl}`,
              fontSize: 22,
              fontFamily: FONT.heading,
              fontWeight: 600,
              color: C.wh,
            }}
          >
            📄 [slug].astro
          </div>
          <div
            style={{
              padding: "10px 24px",
              fontSize: 22,
              fontFamily: FONT.heading,
              color: C.gy,
            }}
          >
            chukfi-types.ts
          </div>
        </div>

        {/* Code area */}
        <div style={{ padding: "8px 0", fontFamily: FONT.mono, fontSize: FONT_SIZE }}>
          {/* Line 1: --- */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={1} />
            <span style={{ fontFamily: FONT.mono, fontSize: FONT_SIZE, color: "#64748b" }}>
              ---
            </span>
          </div>

          {/* Line 2: import */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={2} />
            <span style={{ fontFamily: FONT.mono, fontSize: FONT_SIZE }}>
              <span style={{ color: "#c084fc" }}>import</span>
              <span style={{ color: C.wh }}> type </span>
              <span style={{ color: C.cy }}>BlogPost</span>
              <span style={{ color: C.wh }}> from </span>
              <span style={{ color: C.gr }}>"../types/chukfi-types"</span>
              <span style={{ color: C.wh }}>;</span>
            </span>
          </div>

          {/* Line 3: empty */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={3} />
          </div>

          {/* Line 4: const { post } = Astro.props */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={4} />
            <span style={{ fontFamily: FONT.mono, fontSize: FONT_SIZE }}>
              <TypedPartial
                text='const { post } = Astro.props;'
                startFrame={40}
                speed={2}
              />
            </span>
          </div>

          {/* Line 5: empty */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={5} />
          </div>

          {/* Line 6: --- */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={6} />
            <span style={{ fontFamily: FONT.mono, fontSize: FONT_SIZE, color: "#64748b" }}>
              <TypedPartial text="---" startFrame={120} speed={3} color="#64748b" />
            </span>
          </div>

          {/* Line 7: empty before the good stuff */}
          <div style={{ display: "flex", height: LINE_HEIGHT }}>
            <LineNo n={7} />
          </div>

          {/* Line 8: The magic line — <h1>{post. */}
          <div
            style={{
              display: "flex",
              height: LINE_HEIGHT,
              background: f >= 160 ? C.tb : "transparent",
              position: "relative",
            }}
          >
            <LineNo n={8} active={f >= 160} />
            <span style={{ fontFamily: FONT.mono, fontSize: FONT_SIZE }}>
              {f >= 150 && (
                <>
                  <span style={{ color: "#fbbf24" }}>&lt;h1&gt;</span>
                  <span style={{ color: C.wh }}>{'{'}</span>
                  <TypedPartial text="post." startFrame={160} speed={2} color={C.cy} />
                </>
              )}
              {/* After insertion, show completed line */}
              {postInsert && (
                <>
                  <span style={{ color: C.wh }}>{'{'}</span>
                  <span style={{ color: C.cy }}>post</span>
                  <span style={{ color: C.wh }}>.</span>
                  <span style={{ color: C.gr, fontWeight: 600 }}>title</span>
                  <span style={{ color: C.wh }}>{'}'}</span>
                  <span style={{ color: "#fbbf24" }}>&lt;/h1&gt;</span>
                </>
              )}
            </span>

            {/* IntelliSense popup */}
            {showIS && (
              <IntelliSensePopup startFrame={intelliSenseAt} selectedIndex={intelliSenseSelect} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
