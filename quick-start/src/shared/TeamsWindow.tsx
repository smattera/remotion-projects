import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Teams Chat Window — fake Microsoft Teams conversation ─────────────────

const TEAMS = {
  headerBg: "#6264A7",
  headerFg: "#FFFFFF",
  sidebarBg: "#F3F2F1",
  chatBg: "#FAF9F8",
  userBubble: "#FFFFFF",
  botBubble: "#E2E1F4",
  border: "#E1DFDD",
  timestamp: "#8A8886",
  userColor: "#6264A7",
  botColor: "#3B2E5A",
  inputBg: "#FFFFFF",
} as const;

export interface Message {
  text: string;
  sender: "user" | "bot";
  /** Local frame (0-based inside Sequence) to start showing this message */
  startFrame: number;
}

// ─── Single chat bubble ────────────────────────────────────────────────────
const ChatBubble: React.FC<{
  msg: Message;
  index: number;
}> = ({ msg }) => {
  const f = useCurrentFrame();
  const localF = Math.max(0, f - msg.startFrame);
  const isBot = msg.sender === "bot";

  // Fade + slide in
  const opacity = interpolate(localF, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slideY = interpolate(localF, [0, 12], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (localF < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isBot ? "flex-start" : "flex-end",
        marginBottom: 18,
        opacity,
        transform: `translateY(${slideY}px)`,
      }}
    >
      {/* Sender label */}
      <span
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: isBot ? TEAMS.botColor : TEAMS.userColor,
          marginBottom: 6,
          marginLeft: isBot ? 4 : 0,
          marginRight: isBot ? 0 : 4,
          fontFamily: FONT.heading,
        }}
      >
        {isBot ? "Chukfi Bot" : "You"}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: 560,
          padding: "18px 24px",
          borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          background: isBot ? TEAMS.botBubble : TEAMS.userBubble,
          border: isBot ? "none" : `1px solid ${TEAMS.border}`,
          boxShadow: isBot ? "0 1px 3px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
          fontSize: 28,
          lineHeight: 1.5,
          color: "#242424",
          fontFamily: FONT.heading,
        }}
      >
        {msg.text}
      </div>
    </div>
  );
};

// ─── Typing indicator (three bouncing dots) ────────────────────────────────
const TypingIndicator: React.FC<{ startFrame: number; endFrame: number }> = ({
  startFrame,
  endFrame,
}) => {
  const f = useCurrentFrame();
  if (f < startFrame || f > endFrame) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: 18,
        opacity: interpolate(f, [startFrame, startFrame + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: TEAMS.botColor,
          marginBottom: 6,
          marginLeft: 4,
          fontFamily: FONT.heading,
        }}
      >
        Chukfi Bot
      </span>
      <div style={{ display: "flex", gap: 6, marginTop: 6, marginBottom: 6, marginLeft: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: TEAMS.botColor,
              opacity: 0.3 + 0.5 * Math.max(0, Math.sin(((f - startFrame) / 10 + i * 0.8) * Math.PI)),
              transform: `translateY(${Math.sin(((f - startFrame) / 8 + i * 0.6) * Math.PI) * -5}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Main Teams Chat Window ─────────────────────────────────────────────────
export const TeamsWindow: React.FC<{
  messages: Message[];
  typingStart?: number;
  typingEnd?: number;
}> = ({ messages, typingStart, typingEnd }) => {
  return (
    <div
      style={{
        width: 860,
        height: 880,
        background: TEAMS.chatBg,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        border: `1px solid ${TEAMS.border}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Teams header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
          background: TEAMS.headerBg,
          color: TEAMS.headerFg,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            marginRight: 14,
          }}
        >
          💬
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: FONT.heading }}>
            Chukfi Bot
          </div>
          <div style={{ fontSize: 20, opacity: 0.8, fontFamily: FONT.heading }}>
            Native Consulting Services
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div
        style={{
          flex: 1,
          padding: "28px 32px",
          overflow: "hidden",
        }}
      >
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} index={i} />
        ))}

        {typingStart !== undefined && typingEnd !== undefined && (
          <TypingIndicator startFrame={typingStart} endFrame={typingEnd} />
        )}
      </div>

      {/* Input bar at bottom */}
      <div
        style={{
          padding: "14px 24px",
          background: TEAMS.inputBg,
          borderTop: `1px solid ${TEAMS.border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            background: TEAMS.chatBg,
            borderRadius: 10,
            border: `1px solid ${TEAMS.border}`,
            fontSize: 26,
            color: "#8A8886",
            fontFamily: FONT.heading,
          }}
        >
          Type a new message
        </div>
      </div>
    </div>
  );
};
