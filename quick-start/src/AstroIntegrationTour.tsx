import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LogoScene } from "./shared/LogoScene";
import { TerminalWindow, TypingLine } from "./shared/TerminalWindow";
import { CodeEditorWindow } from "./shared/CodeEditorWindow";
import { C } from "./shared/theme";

// ─── Scene 2: CLI Codegen Terminal ──────────────────────────────────────────
const CodegenTerminal: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}
  >
    <TerminalWindow title="terminal — npx chukfi codegen">
      <TypingLine text="npx chukfi codegen --out src/types" start={10} cmd speed={1} />
      <TypingLine text="  ✓ Generated src/types/chukfi-types.ts" start={65} speed={1} />
    </TerminalWindow>
  </AbsoluteFill>
);

// ─── Scene 3: VS Code Editor + IntelliSense ────────────────────────────────
const EditorScene: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}
  >
    <div style={{ width: 1720, height: 900 }}>
      <CodeEditorWindow
        intelliSenseAt={180}
        intelliSenseSelect={0}
        insertAt={240}
      />
    </div>
  </AbsoluteFill>
);

// ─── Composition ────────────────────────────────────────────────────────────
// Timeline (local frames inside each Sequence):
//   0-30:    Logo intro
//   30-130:  CLI codegen terminal
//   130-440: VS Code editor (local 0-309: typing, IntelliSense, autocomplete)
//   440-470: Logo outro
// Total: 470 frames (15.6s @ 30fps)

export const AstroIntegrationTour: React.FC = () => (
  <AbsoluteFill>
    {/* Scene 1: Logo intro (0-1s) */}
    <Sequence from={0} durationInFrames={30}>
      <LogoScene fadeIn fadeOut duration={30} />
    </Sequence>

    {/* Scene 2: CLI codegen (1-4.3s) */}
    <Sequence from={30} durationInFrames={100}>
      <CodegenTerminal />
    </Sequence>

    {/* Scene 3: VS Code IntelliSense (4.3-14.7s) — needs 310 local frames for insertAt=240 payoff */}
    <Sequence from={130} durationInFrames={310}>
      <EditorScene />
    </Sequence>

    {/* Scene 4: Logo outro (14.7-15.6s) */}
    <Sequence from={440} durationInFrames={30}>
      <LogoScene fadeOut duration={30} />
    </Sequence>
  </AbsoluteFill>
);
