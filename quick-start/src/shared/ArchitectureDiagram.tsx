import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "./theme";

// ─── Architecture Diagram — Animated AWS Stack ─────────────────────────────
// Nodes light up sequentially. Wrap inside a <Sequence> for timing.
// Timing: each node fades in 20 frames apart starting at frame 0.
//   node 0: frames 0-20
//   node 1: frames 20-40
//   etc.

interface NodeDef {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

const NODES: NodeDef[] = [
  {
    id: "cloudfront",
    label: "CloudFront CDN",
    detail: "1 distribution · ACM cert",
    x: 680, y: 180, w: 560, h: 90,
    color: C.or,
  },
  {
    id: "s3",
    label: "S3 Media",
    detail: "Lifecycle rules · Free Tier 5 GB",
    x: 680, y: 320, w: 560, h: 90,
    color: C.gr,
  },
  {
    id: "vpc",
    label: "VPC (2 AZs)",
    detail: "No NAT Gateway · $0/month",
    x: 480, y: 480, w: 960, h: 280,
    color: C.br, // border only
  },
  {
    id: "ecs",
    label: "ECS Fargate",
    detail: "0.25 vCPU · 512 MB · auto-scale 1-2",
    x: 540, y: 540, w: 380, h: 90,
    color: C.bl,
  },
  {
    id: "rds",
    label: "RDS PostgreSQL",
    detail: "db.t4g.micro · 20 GB · single-AZ",
    x: 1000, y: 620, w: 380, h: 90,
    color: C.pr,
  },
  {
    id: "secrets",
    label: "Secrets Manager",
    detail: "DB creds · JWT secret",
    x: 540, y: 660, w: 380, h: 80,
    color: C.pi,
  },
];

const CLIENT_NODE = {
  x: 120, y: 420, w: 200, h: 80,
};

// Spring config for node pop-in
const springCfg = { damping: 12, stiffness: 100 };

const AnimatedNode: React.FC<{
  node: NodeDef;
  labelX?: number;      // override label position
  labelY?: number;
  startFrame: number;
  isBoundary?: boolean;
}> = ({ node, startFrame, labelX, labelY, isBoundary = false }) => {
  const f = useCurrentFrame();
  const localFrame = Math.max(0, f - startFrame);

  const scale = spring({ frame: localFrame, fps: 30, config: springCfg });
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (isBoundary) {
    // VPC border — dashed rectangle that fades in
    const borderOpacity = interpolate(f, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div
        style={{
          position: "absolute",
          left: node.x,
          top: node.y,
          width: node.w,
          height: node.h,
          borderRadius: 18,
          border: `2px dashed ${node.color}`,
          opacity: borderOpacity * 0.6,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -38,
            left: 20,
            fontSize: 24,
            color: C.gy,
            fontFamily: FONT.mono,
            background: C.bg,
            padding: "2px 12px",
            borderRadius: 6,
          }}
        >
          {node.label}
          <span style={{
            marginLeft: 16,
            color: C.gr,
            fontSize: 22,
            fontFamily: FONT.heading,
            fontWeight: 600,
          }}>
            {node.detail}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Node box */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 14,
          background: C.tb,
          border: `2px solid ${node.color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 20px ${node.color}33`,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: node.color,
            fontFamily: FONT.heading,
            marginBottom: 4,
          }}
        >
          {node.label}
        </span>
        <span
          style={{
            fontSize: 20,
            color: C.gy,
            fontFamily: FONT.mono,
          }}
        >
          {node.detail}
        </span>
      </div>
      {/* Checkmark badge (appears after scale completes) */}
      <div
        style={{
          position: "absolute",
          top: -18,
          right: -18,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: C.gr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(localFrame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${spring({ frame: Math.max(0, localFrame - 12), fps: 30, config: { damping: 8, stiffness: 200 } })})`,
          boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
        }}
      >
        <span style={{ color: C.wh, fontSize: 22, fontWeight: 900 }}>✓</span>
      </div>
    </div>
  );
};

// ─── Animated connection lines (simple horizontal/vertical) ─────────────────
const ConnectionLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  startFrame: number;
  color?: string;
}> = ({ x1, y1, x2, y2, startFrame, color = C.gy }) => {
  const f = useCurrentFrame();
  const localFrame = Math.max(0, f - startFrame);
  const progress = spring({ frame: localFrame, fps: 30, config: { damping: 14, stiffness: 60 } });

  const isHorizontal = Math.abs(x2 - x1) > Math.abs(y2 - y1);
  const length = isHorizontal ? x2 - x1 : y2 - y1;
  const currentLen = length * progress;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={isHorizontal ? x1 + currentLen : x1}
        y2={isHorizontal ? y1 : y1 + currentLen}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />
    </svg>
  );
};

// ─── Left-side "Internet" client node ───────────────────────────────────────
const ClientNode: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const f = useCurrentFrame();
  const localFrame = Math.max(0, f - startFrame);
  const scale = spring({ frame: localFrame, fps: 30, config: springCfg });
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: CLIENT_NODE.x,
        top: CLIENT_NODE.y,
        width: CLIENT_NODE.w,
        height: CLIENT_NODE.h,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 40,
          background: C.tb,
          border: `2px solid ${C.cy}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 24px ${C.cy}22`,
        }}
      >
        <span style={{ fontSize: 40 }}>🌐</span>
        <span
          style={{
            marginLeft: 12,
            fontSize: 28,
            fontWeight: 600,
            color: C.cy,
            fontFamily: FONT.heading,
          }}
        >
          Users
        </span>
      </div>
    </div>
  );
};

// ─── Cost badge (slides in at bottom) ──────────────────────────────────────
const CostBadge: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const f = useCurrentFrame();
  const localFrame = Math.max(0, f - startFrame);
  const slide = spring({ frame: localFrame, fps: 30, config: { damping: 14, stiffness: 80 } });
  const opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - slide) * -60}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: C.tb,
        borderRadius: 16,
        padding: "28px 56px",
        border: `2px solid ${C.gr}`,
        boxShadow: "0 16px 48px rgba(34,197,94,0.2)",
      }}
    >
      <span style={{ fontSize: 50, fontWeight: 800, color: C.gr, fontFamily: FONT.heading }}>
        $0/month
      </span>
      <span style={{ fontSize: 28, color: C.gy, fontFamily: FONT.heading, maxWidth: 500 }}>
        Everything under AWS Free Tier limits
      </span>
      <span style={{ fontSize: 44 }}>🎉</span>
    </div>
  );
};

// ─── Export the full diagram ────────────────────────────────────────────────
export const ArchitectureDiagram: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 1920,
      height: 1080,
      background: C.bg,
    }}
  >
    {/* Connections (drawn first so they're behind nodes) */}
    <ConnectionLine x1={380} y1={460} x2={680} y2={225} startFrame={10} color={C.cy} />
    <ConnectionLine x1={680} y2={225} x2={480} y2={480} startFrame={10} color={C.cy} />
    <ConnectionLine x1={960} y1={225} x2={960} y2={320} startFrame={20} color={C.or} />
    <ConnectionLine x1={960} y1={410} x2={960} y2={480} startFrame={35} color={C.or} />
    {/* VPC internal connections */}
    <ConnectionLine x1={730} y1={585} x2={1000} y2={665} startFrame={55} color={C.br} />
    <ConnectionLine x1={730} y1={585} x2={730} y2={700} startFrame={70} color={C.br} />

    {/* Nodes — lighting up in sequence */}
    <ClientNode startFrame={0} />
    <AnimatedNode node={NODES[0]} startFrame={5} />   {/* CloudFront */}
    <AnimatedNode node={NODES[1]} startFrame={25} />  {/* S3 */}
    <AnimatedNode node={NODES[2]} startFrame={40} isBoundary /> {/* VPC */}
    <AnimatedNode node={NODES[3]} startFrame={55} />  {/* ECS */}
    <AnimatedNode node={NODES[4]} startFrame={75} />  {/* RDS */}
    <AnimatedNode node={NODES[5]} startFrame={95} />  {/* Secrets Manager */}

    {/* Cost badge — appears after everything is live */}
    <CostBadge startFrame={120} />
  </div>
);
