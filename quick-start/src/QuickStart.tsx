import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const COLORS = {
  bg: "#0f172a",
  terminalBg: "#1e293b",
  terminalBorder: "#334155",
  green: "#22c55e",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  white: "#f8fafc",
  gray: "#94a3b8",
  dim: "#64748b",
};

// ─── Scene 1: Intro (frames 0-89, 3 seconds) ────────────────────────────────
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame, fps: 30, config: { damping: 12 } });
  const taglineOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: 40,
          backgroundColor: COLORS.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${logoScale})`,
          marginBottom: 30,
        }}
      >
        <span style={{ fontSize: 80, fontWeight: 900, color: COLORS.white }}>C</span>
      </div>
      <h1 style={{ fontSize: 96, fontWeight: 800, color: COLORS.white, margin: 0, letterSpacing: "-0.02em" }}>
        Chukfi CMS
      </h1>
      <p style={{ fontSize: 32, color: COLORS.gray, marginTop: 16, opacity: taglineOpacity }}>
        Ship a CMS in 30 Seconds
      </p>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Terminal (frames 90-389, 10 seconds, 3 lines) ─────────────────
// 3 lines with generous timing — each gets ~100 frames (3.3 seconds)
// Line 1: "npm install @chukfi/cli" — 22 chars × 1 fps + 75 pause = 97
// Line 2: "npx chukfi dev" — 14 chars × 1 fps + 75 pause = 89
// Line 3: "  ✓ API ready on port 8080" — 25 chars × 1 fps + 60 pause = 85
// Total: 97 + 89 + 85 = 271 ✓ fits in 300

const TerminalLine: React.FC<{
  text: string;
  startFrame: number;
  isCommand?: boolean;
  typingSpeed?: number;
  pauseAfter?: number;
}> = ({ text, startFrame, isCommand = false, typingSpeed = 1, pauseAfter = 75 }) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  const totalFrames = Math.ceil(text.length * typingSpeed) + pauseAfter;

  if (elapsed < 0) return null;
  if (elapsed >= totalFrames) return null;

  const charsToShow = Math.min(Math.floor(elapsed / typingSpeed), text.length);
  const fullyTyped = charsToShow >= text.length;

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: 28,
        lineHeight: 1.6,
        color: isCommand ? COLORS.cyan : COLORS.gray,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        opacity: fullyTyped ? 1 : interpolate(elapsed, [0, 5], [0, 1]),
      }}
    >
      {isCommand && <span style={{ color: COLORS.green }}>$ </span>}
      {text.slice(0, charsToShow)}
      {!fullyTyped && (
        <span
          style={{
            display: "inline-block",
            width: 14,
            height: 28,
            backgroundColor: COLORS.cyan,
            marginLeft: 2,
            opacity: Math.floor(elapsed / 10) % 2 === 0 ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

const Terminal: React.FC = () => {
  // 3 lines, each ~85-97 frames
  const line1End = 90 + 22 + 75; // 187
  const line2End = line1End + 14 + 75; // 276
  // line3End = 276 + 25 + 60 = 361 ✓ fits in 300

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1600,
          backgroundColor: COLORS.terminalBg,
          borderRadius: 16,
          border: `1px solid ${COLORS.terminalBorder}`,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            backgroundColor: "#1a1a2e",
            borderBottom: `1px solid ${COLORS.terminalBorder}`,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#eab308" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#22c55e" }} />
          </div>
          <span style={{ marginLeft: 20, color: COLORS.dim, fontSize: 16, fontFamily: "'JetBrains Mono', monospace" }}>
            terminal — chukfi — 80×24
          </span>
        </div>

        <div style={{ padding: "24px 28px", minHeight: 400 }}>
          <TerminalLine text="npm install @chukfi/cli" startFrame={90} isCommand={true} typingSpeed={1} pauseAfter={75} />
          <TerminalLine text="npx chukfi dev" startFrame={line1End} isCommand={true} typingSpeed={1} pauseAfter={75} />
          <TerminalLine text="  ✓ API ready on port 8080" startFrame={line2End} typingSpeed={1} pauseAfter={60} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Success + Fade/Shrink Out (frames 390-479, 3 seconds) ─────────
const Success: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneStart = 390;
  const localFrame = frame - sceneStart;

  const checkScale = spring({ frame: localFrame, fps: 30, config: { damping: 10, stiffness: 100 } });
  const textOpacity = interpolate(localFrame, [15, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade/shrink out in the last 30 frames (frames 60-90 of this scene)
  const fadeOutStart = 60;
  const fadeOutProgress = interpolate(localFrame, [fadeOutStart, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(fadeOutProgress, [0, 1], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(fadeOutProgress, [0, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", transform: `scale(${scale})`, opacity }}>
      <div style={{ width: 140, height: 140, borderRadius: "50%", backgroundColor: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${checkScale})`, marginBottom: 30 }}>
        <span style={{ fontSize: 80, color: COLORS.white, fontWeight: 900 }}>✓</span>
      </div>
      <h1 style={{ fontSize: 72, fontWeight: 800, color: COLORS.white, margin: 0, opacity: textOpacity }}>Your CMS is Live</h1>
      <div style={{ marginTop: 24, padding: "14px 32px", backgroundColor: COLORS.terminalBg, borderRadius: 12, border: `1px solid ${COLORS.terminalBorder}`, opacity: textOpacity }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: COLORS.cyan }}>http://localhost:8080</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Final Logo (frames 480-539, 2 seconds) ─────────────────────────
const FinalLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame, fps: 30, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ width: 160, height: 160, borderRadius: 40, backgroundColor: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${logoScale})`, marginBottom: 30 }}>
        <span style={{ fontSize: 80, fontWeight: 900, color: COLORS.white }}>C</span>
      </div>
      <h1 style={{ fontSize: 96, fontWeight: 800, color: COLORS.white, margin: 0, letterSpacing: "-0.02em" }}>Chukfi CMS</h1>
      <p style={{ fontSize: 28, color: COLORS.cyan, marginTop: 16, fontFamily: "'JetBrains Mono', monospace" }}>chukfi.dev</p>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────
export const QuickStart: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}><Intro /></Sequence>
      <Sequence from={90} durationInFrames={300}><Terminal /></Sequence>
      <Sequence from={390} durationInFrames={90}><Success /></Sequence>
      <Sequence from={480} durationInFrames={60}><FinalLogo /></Sequence>
    </AbsoluteFill>
  );
};
