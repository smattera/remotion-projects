import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Security Panel — magic link login → 2FA → role badges ────────────────

const USERS = [
  { email: "alice@company.com", role: "Administrator", frame: 220 },
  { email: "bob@company.com", role: "Editor", frame: 250 },
  { email: "charlie@company.com", role: "Publisher", frame: 280 },
];

// ─── Left side: login flow ──────────────────────────────────────────────────
const LoginPanel: React.FC = () => {
  const f = useCurrentFrame();

  // Phase 1: Email input (frames 0-80)
  const emailText = "alice@company.com";
  const emailChars = Math.min(Math.floor(Math.max(0, f - 20) / 1.5), emailText.length);
  const typingDone = emailChars >= emailText.length;

  // Phase 2: "Check your inbox" (frames 80-120)
  const inboxOpacity = interpolate(f, [80, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: 2FA code (frames 120-180)
  const codeText = "847291";
  const codeChars = Math.min(Math.floor(Math.max(0, f - 120) / 1.5), codeText.length);
  const codeDone = codeChars >= codeText.length;

  // Phase 4: Success checkmark (frames 180-200)
  const successLocal = Math.max(0, f - 180);
  const successScale = spring({ frame: successLocal, fps: 30, config: { damping: 8, stiffness: 200 } });
  const successLabel = interpolate(f, [195, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 5: Role badge + shield (frames 210+)
  const badgeLocal = Math.max(0, f - 210);
  const badgeSlide = spring({ frame: badgeLocal, fps: 30, config: { damping: 14, stiffness: 80 } });

  return (
    <div
      style={{
        width: 820,
        height: 960,
        background: "#ffffff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        border: `1px solid ${C.br}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "22px 28px", background: C.bg, flexShrink: 0 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: C.wh, fontFamily: FONT.heading }}>
          🔐 Chukfi CMS Login
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        {/* Email input phase */}
        <div style={{ width: "100%", maxWidth: 540, textAlign: "center" }}>
          <label style={{ display: "block", fontSize: 24, fontWeight: 600, color: C.tb, marginBottom: 14, fontFamily: FONT.heading }}>
            {f >= 80 ? "✓" : ""} Email Address
          </label>
          <div
            style={{
              padding: "18px 24px",
              borderRadius: 10,
              border: `2px solid ${typingDone ? C.gr : "#e2e8f0"}`,
              fontSize: 28,
              fontFamily: FONT.mono,
              color: C.tb,
              background: typingDone ? "#f0fdf4" : "#fff",
              textAlign: "left",
            }}
          >
            {emailText.slice(0, emailChars)}
            {!typingDone && f >= 20 && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 32,
                  background: C.bl,
                  marginLeft: 1,
                  opacity: Math.floor((f - 20) / 10) % 2 ? 1 : 0,
                }}
              />
            )}
          </div>

          {/* Inbox message */}
          {f >= 80 && (
            <div
              style={{
                marginTop: 20,
                padding: "16px 24px",
                background: "#fef3c7",
                borderRadius: 10,
                fontSize: 24,
                color: "#d97706",
                fontFamily: FONT.heading,
                opacity: inboxOpacity,
              }}
            >
              📧 Check your inbox — magic link sent!
            </div>
          )}
        </div>

        {/* 2FA phase */}
        {f >= 110 && (
          <div style={{ width: "100%", maxWidth: 540, textAlign: "center", marginTop: 40 }}>
            <label style={{ display: "block", fontSize: 24, fontWeight: 600, color: C.tb, marginBottom: 14, fontFamily: FONT.heading }}>
              {codeDone ? "✓" : ""} Two-Factor Authentication
            </label>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
              }}
            >
              {codeText.split("").map((char, i) => {
                const shown = codeChars > i;
                return (
                  <div
                    key={i}
                    style={{
                      width: 64,
                      height: 72,
                      borderRadius: 10,
                      border: `2px solid ${shown ? C.gr : "#e2e8f0"}`,
                      background: shown ? "#f0fdf4" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 34,
                      fontWeight: 700,
                      fontFamily: FONT.mono,
                      color: shown ? C.tb : "#e2e8f0",
                    }}
                  >
                    {shown ? char : "−"}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Success checkmark */}
        {successLocal >= 0 && (
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: C.gr,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${successScale})`,
                boxShadow: "0 8px 30px rgba(34,197,94,0.3)",
              }}
            >
              <span style={{ fontSize: 48, color: C.wh, fontWeight: 900 }}>✓</span>
            </div>
            <span
              style={{
                marginTop: 12,
                fontSize: 26,
                fontWeight: 700,
                color: C.gr,
                opacity: successLabel,
                fontFamily: FONT.heading,
              }}
            >
              Authenticated
            </span>
          </div>
        )}
      </div>

      {/* Role badge — slides up from bottom */}
      {f >= 210 && (
        <div
          style={{
            padding: "20px 28px",
            background: C.bg,
            borderTop: `2px solid ${C.br}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `translateY(${(1 - badgeSlide) * 60}px)`,
            opacity: badgeSlide,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 32 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.wh, fontFamily: FONT.heading }}>
              alice@company.com
            </div>
            <div style={{ fontSize: 20, color: C.gr, fontFamily: FONT.heading, marginTop: 2 }}>
              Role: Administrator
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Right side: User management panel ─────────────────────────────────────
const UsersPanel: React.FC = () => {
  const f = useCurrentFrame();

  // Entra badge
  const entraLocal = Math.max(0, f - 270);
  const entraOpacity = interpolate(entraLocal, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entraSlide = spring({ frame: entraLocal, fps: 30, config: { damping: 14, stiffness: 80 } });

  return (
    <div
      style={{
        width: 820,
        height: 960,
        background: "#ffffff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        border: `1px solid ${C.br}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "22px 28px", background: C.bg, flexShrink: 0 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: C.wh, fontFamily: FONT.heading }}>
          ⚙️ Users & Permissions
        </span>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          padding: "14px 28px",
          background: "#f1f5f9",
          borderBottom: "1px solid #e2e8f0",
          fontSize: 20,
          fontWeight: 600,
          color: "#64748b",
          fontFamily: FONT.heading,
        }}
      >
        <span>Email</span>
        <span>Role</span>
      </div>

      {/* User rows — appear one by one */}
      <div style={{ flex: 1 }}>
        {USERS.map((user, i) => {
          if (f < user.frame) return null;
          const localF = f - user.frame;
          const scale = spring({ frame: localF, fps: 30, config: { damping: 12, stiffness: 100 } });
          const opacity = interpolate(localF, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          const roleColor = user.role === "Administrator" ? C.bl :
                           user.role === "Editor" ? C.pr : C.or;

          return (
            <div
              key={user.email}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                padding: "18px 28px",
                borderBottom: "1px solid #e2e8f0",
                fontSize: 24,
                fontFamily: FONT.heading,
                transform: `scale(${scale})`,
                opacity,
              }}
            >
              <span style={{ fontFamily: FONT.mono, fontSize: 22, color: C.tb }}>{user.email}</span>
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: 8,
                  background: `${roleColor}15`,
                  color: roleColor,
                  fontSize: 20,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  width: "fit-content",
                }}
              >
                {user.role}
              </div>
            </div>
          );
        })}
      </div>

      {/* Entra ID badge */}
      {f >= 270 && (
        <div
          style={{
            padding: "18px 28px",
            background: C.bg,
            borderTop: `2px solid ${C.br}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `translateY(${(1 - entraSlide) * 40}px)`,
            opacity: entraOpacity,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 28 }}>🔐</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.wh, fontFamily: FONT.heading }}>
              Auth Provider
            </div>
            <div style={{ fontSize: 20, color: C.gy, fontFamily: FONT.heading, marginTop: 2 }}>
              Microsoft Entra ID (OIDC)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Full split-screen panel ────────────────────────────────────────────────
export const SecurityPanel: React.FC = () => {
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
      <div style={{ transform: `scale(${scale})`, opacity: scale }}>
        <LoginPanel />
      </div>
      <div style={{ transform: `scale(${scale})`, opacity: scale }}>
        <UsersPanel />
      </div>
    </div>
  );
};
