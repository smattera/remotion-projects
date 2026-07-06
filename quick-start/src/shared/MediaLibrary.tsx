import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Media Library — grid upload + filter by type ──────────────────────────

const MEDIA_ITEMS = [
  { name: "hero-banner.png", type: "image", size: "2.4 MB", color: C.bl },
  { name: "team-photo.jpg", type: "image", size: "1.8 MB", color: C.pr },
  { name: "guide.pdf", type: "doc", size: "420 KB", color: C.rd },
  { name: "logo.svg", type: "image", size: "18 KB", color: C.gr },
  { name: "report.pdf", type: "doc", size: "890 KB", color: C.rd },
  { name: "screenshot.png", type: "image", size: "3.1 MB", color: C.bl },
];

export const MediaLibrary: React.FC = () => {
  const f = useCurrentFrame();

  // ── Drag zone highlight (frames 30-60) ──
  const dragActive = f >= 30 && f < 90;

  // ── Upload progress bar (frames 60-140) ──
  const uploadStart = 60;
  const uploadLocal = Math.max(0, f - uploadStart);
  const uploadProgress = interpolate(uploadLocal, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  const uploadDone = uploadProgress >= 1;

  // ── New image card pops in (frame 140) ──
  const cardStart = 140;
  const cardLocal = Math.max(0, f - cardStart);
  const cardScale = spring({ frame: cardLocal, fps: 30, config: { damping: 10, stiffness: 120 } });
  const cardOpacity = interpolate(cardLocal, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Filter tabs ──
  const filterStart = 200;
  const filterLocal = Math.max(0, f - filterStart);
  const activeFilter = filterLocal > 0 && filterLocal < 60 ? "images" : "all";

  // ── Filter highlight spring ──
  const filterScale = spring({ frame: filterLocal, fps: 30, config: { damping: 14, stiffness: 100 } });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        height: "100%",
      }}
    >
      {/* Header with upload button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 32px",
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: C.tb, fontFamily: FONT.heading }}>
          Media Library
        </h3>
        <div
          style={{
            padding: "12px 28px",
            background: C.bl,
            borderRadius: 10,
            color: C.wh,
            fontSize: 26,
            fontWeight: 700,
            fontFamily: FONT.heading,
          }}
        >
          + Upload
        </div>
      </div>

      {/* Drag-and-drop zone */}
      <div
        style={{
          margin: "20px 32px 0",
          padding: "32px",
          border: `2px dashed ${dragActive ? C.bl : C.br}`,
          borderRadius: 14,
          background: dragActive ? `${C.bl}08` : "#fff",
          textAlign: "center",
          transition: "all 0.3s",
          flexShrink: 0,
          minHeight: dragActive ? 120 : 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 32, marginBottom: 4 }}>📁</span>
        <span style={{ fontSize: 24, color: C.gy, fontFamily: FONT.heading }}>
          {dragActive ? "hero-banner.png — uploading..." : "Drop files here or click Upload"}
        </span>

        {/* Upload progress bar */}
        {f >= uploadStart && !uploadDone && (
          <div
            style={{
              marginTop: 16,
              width: 400,
              height: 8,
              background: "#e2e8f0",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${uploadProgress * 100}%`,
                height: "100%",
                background: C.gr,
                borderRadius: 4,
                transition: "width 0.1s",
              }}
            />
          </div>
        )}
        {uploadDone && f >= cardStart && (
          <span style={{ marginTop: 12, fontSize: 22, color: C.gr, fontFamily: FONT.heading, fontWeight: 600 }}>
            ✓ Upload complete
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "20px 32px 0",
          flexShrink: 0,
        }}
      >
        {[
          { key: "all", label: "All", count: MEDIA_ITEMS.length + (uploadDone ? 1 : 0) },
          { key: "images", label: "Images", count: MEDIA_ITEMS.filter((m) => m.type === "image").length + (uploadDone ? 1 : 0) },
          { key: "documents", label: "Documents", count: MEDIA_ITEMS.filter((m) => m.type === "doc").length },
        ].map((tab) => {
          const isActive = activeFilter === tab.key || (activeFilter === "all" && tab.key === "all");
          return (
            <div
              key={tab.key}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                background: isActive ? C.bl : "#fff",
                color: isActive ? C.wh : C.tb,
                fontSize: 24,
                fontWeight: 600,
                fontFamily: FONT.heading,
                cursor: "pointer",
                border: isActive ? "none" : "1px solid #e2e8f0",
                transform: filterLocal > 0 && isActive ? `scale(${filterScale})` : "none",
              }}
            >
              {tab.label}
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 20,
                  opacity: 0.7,
                  fontFamily: FONT.mono,
                }}
              >
                {tab.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Media grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          padding: "20px 32px",
          flex: 1,
          overflow: "auto",
          alignContent: "start",
        }}
      >
        {/* New upload card (appears with spring) */}
        <div
          style={{
            padding: "24px",
            background: "#fff",
            borderRadius: 12,
            border: `2px solid ${C.gr}`,
            textAlign: "center",
            fontFamily: FONT.heading,
            transform: `scale(${cardScale})`,
            opacity: cardOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 160,
          }}
        >
          <span style={{ fontSize: 48, marginBottom: 12 }}>🖼️</span>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.tb, marginBottom: 6 }}>hero-banner.png</div>
          <div style={{ fontSize: 18, color: C.gy, fontFamily: FONT.mono }}>2.4 MB</div>
          <div
            style={{
              marginTop: 10,
              padding: "4px 12px",
              borderRadius: 6,
              background: `${C.gr}15`,
              color: C.gr,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            NEW
          </div>
        </div>

        {/* Existing media items */}
        {MEDIA_ITEMS.map((item, i) => {
          const itemOpacity = interpolate(i * 4 + 20, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={item.name}
              style={{
                padding: "24px",
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                textAlign: "center",
                fontFamily: FONT.heading,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 160,
                opacity: uploadDone ? 1 : itemOpacity,
              }}
            >
              <span style={{ fontSize: 48, marginBottom: 12 }}>
                {item.type === "image" ? "🖼️" : "📄"}
              </span>
              <div style={{ fontSize: 22, fontWeight: 600, color: C.tb, marginBottom: 6 }}>{item.name}</div>
              <div style={{ fontSize: 18, color: C.gy, fontFamily: FONT.mono }}>{item.size}</div>
              <div
                style={{
                  marginTop: 10,
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: `${item.color}12`,
                  color: item.color,
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {item.type === "image" ? "Image" : "Document"}
              </div>
            </div>
          );
        })}
      </div>

      {/* S3 storage badge */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 32,
          background: C.tb,
          border: `1px solid ${C.br}`,
          borderRadius: 10,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(f, [170, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          zIndex: 5,
        }}
      >
        <span style={{ fontSize: 24 }}>☁️</span>
        <span style={{ color: C.wh, fontSize: 20, fontFamily: FONT.heading, fontWeight: 500 }}>
          Backed by Amazon S3
        </span>
      </div>
    </div>
  );
};
