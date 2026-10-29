import React, { useEffect, useRef } from "react";

/**
 * Glass Scene — a fully procedural "glass tooling" background (seamless 12 s loop). No images.
 *
 * - Left: a tilting glass panel with a glowing logo and a sweeping sheen.
 * - Right: a spinning amber hex prism inside an orbiting glass band, with cubes
 *   circling it (a tiny 3-D mesh renderer: rotate → depth-sort → shade).
 * - Bottom: silk ribbons surging left → right, plus a guide line that small
 *   cubes ride along, spinning as they go.
 * - Aurora glows, sparkles and drifting specks keep the whole frame moving.
 *
 * Every motion is sin/cos of (2π/T)·n·t with integer n, so it repeats every 12 s.
 *
 * Usage: <GlassScene /> fills the viewport (position: fixed). Pass `style` /
 * `className` to override, e.g. style={{ position: "absolute" }}.
 */

const T = 12;
const TAU = Math.PI * 2;
const OM = TAU / T;
const frac = (n: number) => n - Math.floor(n);

type V3 = [number, number, number];
type RGB = [number, number, number];
interface Face {
  v: V3[]; // 2 vertices = a rim line, otherwise a polygon
  c: RGB;
  a: number; // base alpha
  ns?: boolean; // no outline (smooth glass strips)
}

const BLUE: RGB = [62, 110, 240];
const AMBER: RGB = [255, 190, 60];
const GLASS: RGB = [205, 224, 252];
const LIGHT: V3 = [-0.35, -0.6, -0.72];

const rotY = (p: V3, a: number): V3 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};
const rotX = (p: V3, a: number): V3 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};
const move = (f: Face[], rot: number, off: V3): Face[] =>
  f.map((q) => ({
    ...q,
    v: q.v.map((p) => {
      const r = rotY(p, rot);
      return [r[0] + off[0], r[1] + off[1], r[2] + off[2]] as V3;
    }),
  }));

function box(sz: number, c: RGB, a: number): Face[] {
  const h = sz;
  const P: V3[] = [
    [-h, -h, -h],
    [h, -h, -h],
    [h, h, -h],
    [-h, h, -h],
    [-h, -h, h],
    [h, -h, h],
    [h, h, h],
    [-h, h, h],
  ];
  const Q = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [3, 2, 6, 7],
    [0, 3, 7, 4],
    [1, 2, 6, 5],
  ];
  return Q.map((q) => ({ v: q.map((i) => P[i]), c, a }));
}

function hexPrism(r: number, h: number, c: RGB, a: number): Face[] {
  const top: V3[] = [];
  const bot: V3[] = [];
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * TAU;
    top.push([Math.cos(t) * r, -h, Math.sin(t) * r]);
    bot.push([Math.cos(t) * r, h, Math.sin(t) * r]);
  }
  const f: Face[] = [
    { v: top, c, a },
    { v: bot, c, a },
  ];
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    f.push({ v: [top[i], top[j], bot[j], bot[i]], c, a });
  }
  return f;
}

function band(a0: number, a1: number, R: number, h: number, n: number): Face[] {
  const f: Face[] = [];
  for (let i = 0; i < n; i++) {
    const t0 = a0 + ((a1 - a0) * i) / n;
    const t1 = a0 + ((a1 - a0) * (i + 1)) / n;
    f.push({
      v: [
        [Math.cos(t0) * R, -h, Math.sin(t0) * R],
        [Math.cos(t1) * R, -h, Math.sin(t1) * R],
        [Math.cos(t1) * R, h, Math.sin(t1) * R],
        [Math.cos(t0) * R, h, Math.sin(t0) * R],
      ],
      c: GLASS,
      a: 0.6,
      ns: true,
    });
    const top: V3 = [Math.cos(t0) * R, -h, Math.sin(t0) * R];
    const top1: V3 = [Math.cos(t1) * R, -h, Math.sin(t1) * R];
    const bot: V3 = [Math.cos(t0) * R, h, Math.sin(t0) * R];
    const bot1: V3 = [Math.cos(t1) * R, h, Math.sin(t1) * R];
    f.push({ v: [top, top1], c: GLASS, a: 1 }, { v: [bot, bot1], c: GLASS, a: 1 });
  }
  return f;
}

interface RibbonDef {
  base: number;
  A1: number;
  n1: number;
  ph1: number;
  A2: number;
  n2: number;
  w0: number;
  nw: number;
  g: [number, number, number, number, number][];
}

const RIBBONS: RibbonDef[] = [
  {
    base: 0.05,
    A1: 0.04,
    n1: 1,
    ph1: 1.6,
    A2: 0.012,
    n2: 3,
    w0: 0.016,
    nw: 2,
    g: [
      [0, 150, 190, 248, 0.28],
      [1, 175, 150, 236, 0.3],
    ],
  },
  {
    base: 0.92,
    A1: 0.04,
    n1: 2,
    ph1: 0.2,
    A2: 0.012,
    n2: 5,
    w0: 0.03,
    nw: 3,
    g: [
      [0, 200, 218, 250, 0.4],
      [1, 168, 208, 250, 0.4],
    ],
  },
  {
    base: 0.88,
    A1: 0.06,
    n1: 1,
    ph1: -0.9,
    A2: 0.015,
    n2: 4,
    w0: 0.026,
    nw: 2,
    g: [
      [0, 112, 148, 238, 0.5],
      [0.4, 176, 160, 242, 0.4],
      [1, 146, 190, 248, 0.42],
    ],
  },
  {
    base: 0.84,
    A1: 0.07,
    n1: 2,
    ph1: -0.6,
    A2: 0.012,
    n2: 6,
    w0: 0.016,
    nw: 4,
    g: [
      [0, 160, 156, 240, 0.4],
      [0.5, 182, 212, 250, 0.3],
      [1, 148, 194, 250, 0.42],
    ],
  },
];

interface Speck {
  x0: number;
  y0: number;
  r: number;
  n: number;
  m: number;
  ph: number;
  a: number;
  rgb: string;
}

function makeSpecks(): Speck[] {
  let s = 11;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const tints = ["255,255,255", "150,190,252", "255,206,100"];
  return Array.from({ length: 44 }, () => ({
    x0: rnd(),
    y0: 0.05 + rnd() * 0.9,
    r: 3 + rnd() * 8,
    n: 1 + Math.floor(rnd() * 3),
    m: 1 + Math.floor(rnd() * 3),
    ph: rnd() * TAU,
    a: 0.45 + rnd() * 0.4,
    rgb: tints[Math.floor(rnd() * 3)],
  }));
}

export interface GlassSceneProps {
  className?: string;
  style?: React.CSSProperties;
}

const FALLBACK_BG =
  "radial-gradient(ellipse 70% 60% at 50% 50%, #f8fcff 0%, #eaf4fe 45%, #d2e5fa 80%, #bcd6f6 100%)";

export default function GlassScene({ className, style }: GlassSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const specks = makeSpecks();
    const ring = band(0.25, 0.25 + Math.PI * 1.55, 1.9, 1.05, 56);

    let W = 0;
    let H = 0;
    let S = 1;
    let rafId = 0;

    function resize() {
      W = Math.max(1, cv!.clientWidth || window.innerWidth);
      H = Math.max(1, cv!.clientHeight || window.innerHeight);
      S = Math.max(0.5, Math.min(H / 941, W / 1400));
      cv!.width = Math.round(W * DPR);
      cv!.height = Math.round(H * DPR);
      if (reduced) draw(3);
    }

    /** Rotate, depth-sort, shade and fill a list of faces. */
    function drawFaces(faces: Face[], ry: number, rx: number, cx: number, cy: number, s: number) {
      const out = faces.map((f) => {
        const r = f.v.map((p) => rotX(rotY(p, ry), rx));
        const z = r.reduce((q, p) => q + p[2], 0) / r.length;
        if (r.length === 2) return { f, r, z, b: 0 };
        const ux = r[1][0] - r[0][0],
          uy = r[1][1] - r[0][1],
          uz = r[1][2] - r[0][2];
        const vx = r[2][0] - r[0][0],
          vy = r[2][1] - r[0][1],
          vz = r[2][2] - r[0][2];
        const nx = uy * vz - uz * vy,
          ny = uz * vx - ux * vz,
          nz = ux * vy - uy * vx;
        const len = Math.hypot(nx, ny, nz) || 1;
        const b = Math.abs(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / len;
        return { f, r, z, b };
      });
      out.sort((p, q) => q.z - p.z);
      for (const { f, r, b } of out) {
        if (r.length === 2) {
          ctx!.beginPath();
          ctx!.moveTo(cx + r[0][0] * s, cy + r[0][1] * s);
          ctx!.lineTo(cx + r[1][0] * s, cy + r[1][1] * s);
          ctx!.strokeStyle = "rgba(255,255,255,.85)";
          ctx!.lineWidth = Math.max(1.2, 1.8 * S);
          ctx!.stroke();
          ctx!.strokeStyle = "rgba(120,160,240,.35)";
          ctx!.lineWidth = Math.max(0.6, 0.7 * S);
          ctx!.stroke();
          continue;
        }
        ctx!.beginPath();
        r.forEach((p, i) =>
          i ? ctx!.lineTo(cx + p[0] * s, cy + p[1] * s) : ctx!.moveTo(cx + p[0] * s, cy + p[1] * s),
        );
        ctx!.closePath();
        const al = Math.min(0.95, f.a * (0.6 + 0.6 * b));
        ctx!.fillStyle = `rgba(${f.c[0]},${f.c[1]},${f.c[2]},${al.toFixed(3)})`;
        ctx!.fill();
        if (b > 0.72) {
          ctx!.fillStyle = `rgba(255,255,255,${((b - 0.72) * 1.3 * f.a).toFixed(3)})`;
          ctx!.fill();
        }
        ctx!.strokeStyle = f.ns
          ? `rgba(${f.c[0]},${f.c[1]},${f.c[2]},${al.toFixed(3)})`
          : `rgba(255,255,255,${(0.28 + 0.4 * b).toFixed(3)})`;
        ctx!.lineWidth = f.ns ? 1.2 : Math.max(0.8, S);
        ctx!.stroke();
      }
    }

    function sparkle(x: number, y: number, r: number, e: number) {
      if (e < 0.02) return;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${(0.9 * e).toFixed(3)})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, TAU);
      ctx!.fill();
      ctx!.fillStyle = `rgba(255,255,255,${(0.75 * e).toFixed(3)})`;
      ctx!.fillRect(x - r * 1.5, y - 0.6, r * 3, 1.2);
      ctx!.fillRect(x - 0.6, y - r * 1.5, 1.2, r * 3);
    }

    function aurora(t: number) {
      const blobs: [number, number, number, number, string][] = [
        [0.3, 0.15, 1, 0.0, "150,190,250"],
        [0.75, 0.9, 2, 1.7, "176,160,242"],
        [0.55, 0.45, 1, 3.1, "255,255,255"],
      ];
      for (const [bx, by, n, ph, c] of blobs) {
        const x = (bx + 0.12 * Math.sin(OM * n * t + ph)) * W;
        const y = (by + 0.08 * Math.cos(OM * n * t + ph * 1.3)) * H;
        const r = 0.42 * Math.max(W, H);
        const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${c},.34)`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, W, H);
      }
    }

    function ribbon(q: RibbonDef, i: number, t: number) {
      const N = Math.max(80, Math.min(240, Math.round(W / 8)));
      const step = (W + 60) / N;
      const amp = 1 + 0.3 * Math.sin(OM * t + i * 1.57);
      const top: number[] = [];
      const bot: number[] = [];
      for (let k = 0; k <= N; k++) {
        const u = (-30 + k * step) / W;
        const sp =
          q.base +
          q.A1 * amp * Math.sin(TAU * u - OM * q.n1 * t + q.ph1) +
          q.A2 * Math.sin(TAU * 2 * u - OM * q.n2 * t + i);
        const hw = q.w0 * (1 + 0.55 * Math.sin(TAU * u - OM * q.nw * t + i * 2));
        top.push((sp - hw) * H);
        bot.push((sp + hw) * H);
      }
      const fill = new Path2D();
      const eu = new Path2D();
      const el = new Path2D();
      for (let k = 0; k <= N; k++) {
        const x = -30 + k * step;
        if (k === 0) {
          fill.moveTo(x, top[k]);
          eu.moveTo(x, top[k]);
          el.moveTo(x, bot[k]);
        } else {
          fill.lineTo(x, top[k]);
          eu.lineTo(x, top[k]);
          el.lineTo(x, bot[k]);
        }
      }
      for (let k = N; k >= 0; k--) fill.lineTo(-30 + k * step, bot[k]);
      fill.closePath();
      const g = ctx!.createLinearGradient(0, 0, W, 0);
      q.g.forEach(([p, r, gg, b, a]) => g.addColorStop(p, `rgba(${r},${gg},${b},${a})`));
      ctx!.fillStyle = g;
      ctx!.fill(fill);
      ctx!.save();
      ctx!.clip(fill);
      const xc = (frac(t / T + i * 0.23) * 1.8 - 0.4) * W;
      const sg = ctx!.createLinearGradient(xc - 0.25 * W, 0, xc + 0.25 * W, 0);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,.3)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = sg;
      ctx!.fillRect(0, 0, W, H);
      ctx!.restore();
      ctx!.lineCap = ctx!.lineJoin = "round";
      ctx!.strokeStyle = "rgba(255,255,255,.55)";
      ctx!.lineWidth = 1.4;
      ctx!.stroke(el);
      ctx!.strokeStyle = "rgba(116,142,226,.4)";
      ctx!.lineWidth = 1;
      ctx!.stroke(eu);
      ctx!.strokeStyle = "rgba(255,255,255,.6)";
      ctx!.lineWidth = 0.8;
      ctx!.stroke(eu);
    }

    function panel(t: number) {
      const w = 300 * S;
      const h = 340 * S;
      const yaw = Math.cos(OM * t + 0.5);
      ctx!.save();
      ctx!.translate(0.075 * W, 0.41 * H + 22 * S * Math.sin(OM * t + 0.3));
      ctx!.rotate(-0.2 + 0.07 * Math.sin(OM * 2 * t));
      ctx!.transform(0.94 + 0.06 * yaw, 0.08 * yaw, 0, 1, 0, 0);
      // glass thickness
      ctx!.fillStyle = "rgba(140,178,245,.35)";
      ctx!.fillRect(-w / 2 + 8 * S, -h / 2 + 8 * S, w, h);
      const g = ctx!.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      g.addColorStop(0, "rgba(255,255,255,.78)");
      g.addColorStop(1, "rgba(200,222,252,.5)");
      ctx!.fillStyle = g;
      ctx!.fillRect(-w / 2, -h / 2, w, h);
      ctx!.strokeStyle = "rgba(100,145,240,.9)";
      ctx!.lineWidth = 1.6 * S;
      ctx!.strokeRect(-w / 2, -h / 2, w, h);
      // sheen
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(-w / 2, -h / 2, w, h);
      ctx!.clip();
      const xc = (frac((2 * t) / T + 0.1) * 1.8 - 0.4) * w - w / 2;
      const sg = ctx!.createLinearGradient(xc - 0.35 * w, -h / 2, xc + 0.35 * w, h / 2);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,.5)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = sg;
      ctx!.fillRect(-w / 2, -h / 2, w, h);
      ctx!.restore();
      // logo
      ctx!.save();
      ctx!.translate(w * 0.06, 0);
      const k = 1.35 + 0.06 * Math.sin(OM * 3 * t);
      ctx!.scale(k, k);
      ctx!.shadowColor = "rgba(60,110,240,.55)";
      ctx!.shadowBlur = 14 * S * (1 + 0.4 * Math.sin(OM * 3 * t));
      ctx!.strokeStyle = "#3b6cf0";
      ctx!.lineWidth = 13 * S;
      ctx!.lineCap = "butt";
      ctx!.beginPath();
      ctx!.moveTo(-46 * S, 10 * S);
      ctx!.lineTo(10 * S, -26 * S);
      ctx!.moveTo(-46 * S, -14 * S);
      ctx!.lineTo(10 * S, 24 * S);
      ctx!.stroke();
      ctx!.lineWidth = 15 * S;
      ctx!.strokeStyle = "#4f86f7";
      ctx!.beginPath();
      ctx!.moveTo(20 * S, -34 * S);
      ctx!.lineTo(20 * S, 36 * S);
      ctx!.stroke();
      ctx!.restore();
      ctx!.restore();
    }

    function guideLine(t: number) {
      const p0: [number, number] = [-20, 0.7 * H];
      const p1: [number, number] = [0.24 * W, 0.8 * H + 16 * S * Math.sin(OM * 2 * t)];
      const p2: [number, number] = [0.5 * W, 0.875 * H];
      const at = (u: number): [number, number] => [
        (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0],
        (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1],
      ];
      const g = ctx!.createLinearGradient(0, 0, p2[0], 0);
      g.addColorStop(0, "rgba(90,130,240,.7)");
      g.addColorStop(1, "rgba(90,130,240,0)");
      ctx!.strokeStyle = g;
      ctx!.lineWidth = 1.6;
      ctx!.beginPath();
      ctx!.moveTo(p0[0], p0[1]);
      ctx!.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]);
      ctx!.stroke();
      // cubes riding the line
      const riders: [number, RGB, number][] = [
        [0, BLUE, 1],
        [0.33, AMBER, 2],
        [0.66, BLUE, 3],
      ];
      for (const [ph, col, spin] of riders) {
        const u = frac(t / T + ph);
        const [x, y] = at(u);
        const e = Math.pow(Math.sin(Math.PI * u), 0.6);
        ctx!.globalAlpha = e;
        drawFaces(
          box(0.8, col, 0.75),
          OM * spin * t + ph * 9,
          0.6,
          x,
          y - 8 * S,
          26 * S * (0.7 + 0.3 * e),
        );
        ctx!.globalAlpha = 1;
      }
    }

    function cluster(t: number) {
      const cx = 0.93 * W;
      const cy = 0.56 * H + 16 * S * Math.sin(OM * t + 1);
      const s = 140 * S;
      const faces: Face[] = [
        ...ring,
        ...move(hexPrism(0.95, 0.72, AMBER, 0.5), -OM * 2 * t, [0, -0.55, 0]),
        ...move(box(0.38, BLUE, 0.8), OM * 3 * t, [0.1, 1.0, 0.15]),
        ...move(box(0.3, AMBER, 0.85), -OM * 2 * t + 1, [-0.9, 0.65, 0.9]),
        ...move(box(0.26, BLUE, 0.8), OM * 4 * t, [1.1, 0.2, -1.4]),
      ];
      drawFaces(faces, OM * t, 0.38 + 0.08 * Math.sin(OM * t), cx, cy, s);
      sparkle(
        cx - 0.2 * s,
        cy - 0.75 * s,
        22 * S,
        Math.pow(Math.max(0, Math.sin(OM * 2 * t + 0.4)), 6),
      );
    }

    function small(t: number) {
      const spots: [number, number, number, number, RGB][] = [
        [0.807, 0.27, 2, 0.5, AMBER],
        [0.092, 0.66, 3, 2.4, AMBER],
        [0.33, 0.12, 1, 4.0, BLUE],
      ];
      for (const [fx, fy, n, ph, col] of spots) {
        const x = fx * W + 12 * S * Math.sin(OM * n * t + ph);
        const y = fy * H + 20 * S * Math.sin(OM * ((n % 3) + 1) * t + ph);
        drawFaces(box(1, col, 0.8), OM * n * t + ph, 0.5, x, y, 20 * S);
        sparkle(x, y, 20 * S, Math.pow(Math.max(0, Math.sin(OM * n * t + ph * 2)), 8));
      }
    }

    function speck(p: Speck, t: number) {
      const u = frac((p.n * t) / T + p.x0);
      const x = -40 + u * (W + 80);
      const y = p.y0 * H + 26 * S * Math.sin(OM * p.m * t + p.ph);
      const a = p.a * Math.sin(Math.PI * u) * (0.65 + 0.35 * Math.sin(OM * p.m * 2 * t + p.ph));
      if (a < 0.01) return;
      const r = p.r * S;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${p.rgb},${a.toFixed(3)})`);
      g.addColorStop(1, `rgba(${p.rgb},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, TAU);
      ctx!.fill();
    }

    function draw(t: number) {
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx!.globalCompositeOperation = "source-over";
      const bg = ctx!.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 0.62 * Math.hypot(W, H));
      bg.addColorStop(0, "#f8fcff");
      bg.addColorStop(0.35, "#eaf4fe");
      bg.addColorStop(0.7, "#d2e5fa");
      bg.addColorStop(1, "#bcd6f6");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);
      aurora(t);
      RIBBONS.forEach((q, i) => ribbon(q, i, t));
      guideLine(t);
      panel(t);
      cluster(t);
      small(t);
      for (const p of specks) speck(p, t);
    }

    function frame(now: number) {
      try {
        if (Math.round(cv!.clientWidth) !== W || Math.round(cv!.clientHeight) !== H) resize();
        draw((now / 1000) % T);
        rafId = requestAnimationFrame(frame);
      } catch {
        cv!.style.display = "none";
      }
    }

    try {
      resize();
      if (!reduced) rafId = requestAnimationFrame(frame);
    } catch {
      cv.style.display = "none";
    }
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={className}
      style={{ position: "fixed", inset: 0, overflow: "hidden", background: FALLBACK_BG, ...style }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
