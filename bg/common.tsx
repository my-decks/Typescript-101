import { useEffect, useRef } from "react";

/**
 * Type Flow — the deck's living background (port of the standalone
 * "Type Flow – VS Code & TypeScript" canvas).
 *
 * - Four flowing ribbons (two along the top, two along the bottom) whose
 *   colour runs JS-yellow → sky → TS-blue left to right, breathing in
 *   width and height on a 40s cycle with a travelling white sheen.
 * - Mono code-token pairs ("var"→"const", "=="→"===", "any"→"<T>"…)
 *   drift along the ribbons, swapping vocabulary at the centre line.
 * - Bokeh bubbles + a fixed noise layer finish the sky.
 * - Theme-aware: light = pastel sky (#EEF5FF), dark = deep ink navy.
 * - Seeded RNG → every load renders the identical field.
 * - Honours prefers-reduced-motion by painting one static frame.
 */

const TAU = Math.PI * 2;
const T = 40;

/* seeded RNG so every load looks the same */
let seed = 20261021;
const rnd = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* colour ramp: JS yellow → sky → TS blue by horizontal position */
const Y = [240, 192, 0],
  M = [142, 197, 240],
  B = [49, 120, 198];
const mix = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sstep = (a: number, b: number, v: number) => {
  const k = clamp((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const col = (x: number) => {
  x = clamp(x);
  return (x < 0.5 ? mix(Y, M, x / 0.5) : mix(M, B, (x - 0.5) / 0.5)).map(Math.round);
};
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const frac = (v: number) => v - Math.floor(v);

interface Ribbon {
  b: number;
  w: number;
  s: number;
  a: number[];
  k: number[];
  n: number[];
  p: number[];
  wk: number;
  wn: number;
  wp: number;
  ph: number;
  nt: number;
  tok: {
    ph: number;
    lane: number;
    n: number;
    pair: [string, string];
    sz: number;
    s1: number;
    s2: number;
    s3: number;
  }[];
}

const PAIRS: [string, string][] = [
  ["var", "const"],
  ["any", "string"],
  ["function", "=>"],
  ["==", "==="],
  ["obj", "<T>"],
  ["{ }", "{ }"],
  ["?", "?."],
  ["()", "()"],
  ["[]", "[]"],
  ["let", "type"],
  ["null", "null"],
  ["/>", "/>"],
  ["interface", "interface"],
  ["{ }", "type"],
  ["=>", "=>"],
  ["<T>", "<T>"],
];

const R: Ribbon[] = [
  {
    b: 0.075,
    w: 0.075,
    s: 1,
    a: [0.012, 0.007],
    k: [1, 3],
    n: [1, 2],
    p: [0, 1.7],
    wk: 2,
    wn: 1,
    wp: 0.8,
    ph: 0,
    nt: 15,
    tok: [],
  },
  {
    b: 0.19,
    w: 0.05,
    s: 1,
    a: [0.01, 0.006],
    k: [2, 4],
    n: [1, 3],
    p: [2.1, 0.4],
    wk: 3,
    wn: 2,
    wp: 2.4,
    ph: 1.3,
    nt: 11,
    tok: [],
  },
  {
    b: 0.925,
    w: 0.075,
    s: -1,
    a: [0.012, 0.007],
    k: [1, 3],
    n: [1, 2],
    p: [3.1, 4.4],
    wk: 2,
    wn: 1,
    wp: 3.9,
    ph: 0,
    nt: 15,
    tok: [],
  },
  {
    b: 0.81,
    w: 0.05,
    s: -1,
    a: [0.01, 0.006],
    k: [2, 4],
    n: [1, 3],
    p: [5.2, 2.6],
    wk: 3,
    wn: 2,
    wp: 5.5,
    ph: 1.3,
    nt: 11,
    tok: [],
  },
];
R.forEach((r) => {
  r.tok = Array.from({ length: r.nt }, (_, i) => ({
    ph: (i + rnd() * 0.6) / r.nt,
    lane: (rnd() - 0.5) * 0.8,
    n: rnd() < 0.3 ? 2 : 1,
    pair: PAIRS[Math.floor(rnd() * PAIRS.length)],
    sz: 0.85 + rnd() * 0.35,
    s1: rnd() * TAU,
    s2: rnd() * TAU,
    s3: rnd() * TAU,
  }));
});
const BK = Array.from({ length: 40 }, () => ({
  x: rnd(),
  ph: rnd(),
  r: 8 + rnd() * 26,
  s: rnd() * TAU,
  a: 0.12 + rnd() * 0.14,
}));

/* theme palettes */
const PAL = {
  light: {
    bgStops: ["#FBFDFF", "#EEF5FF", "#D9E8FB", "#C4DBF6"],
    centerGlow: "rgba(255,255,255,.85)",
    ribbonA: 0.42,
    hairline: 0.75,
    edge: 0.9,
    sheen: 0.5,
    innerTop: 0.6,
    innerMid: 0.14,
    innerBot: 0.03,
    veil: ["rgba(251,253,255,.85)", "rgba(251,253,255,.55)"],
    bokeh: 1,
    tokenA: 0.95,
    ring: 0.9,
  },
  dark: {
    bgStops: ["#101A33", "#0A1020", "#070D1C", "#05080F"],
    centerGlow: "rgba(90,166,240,.10)",
    ribbonA: 0.21,
    hairline: 0.5,
    edge: 0.5,
    sheen: 0.22,
    innerTop: 0.2,
    innerMid: 0.06,
    innerBot: 0.015,
    veil: ["rgba(10,16,32,.85)", "rgba(10,16,32,.55)"],
    bokeh: 0.45,
    tokenA: 0.8,
    ring: 0.5,
  },
} as const;

type Pal = (typeof PAL)[keyof typeof PAL];

export default function CommonBg({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0,
      H = 0,
      dpr = 1,
      sc = 1;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* fixed noise layer, ~2% alpha */
    const nc = document.createElement("canvas");
    nc.width = nc.height = 128;
    const nx = nc.getContext("2d")!;
    const id = nx.createImageData(128, 128);
    for (let i = 0; i < id.data.length; i += 4) {
      id.data[i] = id.data[i + 1] = id.data[i + 2] = rnd() * 255;
      id.data[i + 3] = 5;
    }
    nx.putImageData(id, 0, 0);
    const noise = ctx.createPattern(nc, "repeat")!;

    const getTheme = (): "light" | "dark" => {
      const el =
        document.getElementById("root") ?? document.querySelector<HTMLElement>("[data-theme]");
      return el?.getAttribute("data-theme") === "dark" ? "dark" : "light";
    };

    const cy = (r: Ribbon, u: number, t: number, h: number) => {
      const a = (TAU * t) / T;
      let y = r.b;
      for (let i = 0; i < 2; i++) y += r.a[i] * Math.sin(TAU * r.k[i] * u - a * r.n[i] + r.p[i]);
      return (y + r.s * 0.008 * Math.sin(a + r.ph)) * h;
    };
    const wd = (r: Ribbon, u: number, t: number, h: number) => {
      const a = (TAU * t) / T;
      return (
        r.w *
        h *
        (1 + 0.28 * Math.sin(TAU * r.wk * u - a * r.wn + r.wp)) *
        (1 + r.s * 0.1 * Math.sin(a + r.ph + 1))
      );
    };
    const X = (u: number, w: number) => (u * 1.1 - 0.05) * w;

    function ribbon(r: Ribbon, t: number, pal: Pal) {
      const N = 90,
        top: [number, number][] = [],
        bot: [number, number][] = [];
      let mn = 1e9,
        mx = -1e9;
      for (let i = 0; i <= N; i++) {
        const u = i / N,
          x = X(u, W),
          c = cy(r, u, t, H),
          h = wd(r, u, t, H) / 2;
        top.push([x, c - h]);
        bot.push([x, c + h]);
        mn = Math.min(mn, c - h);
        mx = Math.max(mx, c + h);
      }
      const path = () => {
        ctx!.beginPath();
        ctx!.moveTo(top[0][0], top[0][1]);
        for (let i = 1; i <= N; i++) ctx!.lineTo(top[i][0], top[i][1]);
        for (let i = N; i >= 0; i--) ctx!.lineTo(bot[i][0], bot[i][1]);
        ctx!.closePath();
      };
      const hg = (a: number) => {
        const g = ctx!.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, rgba(Y, a));
        g.addColorStop(0.5, rgba(M, a));
        g.addColorStop(1, rgba(B, a));
        return g;
      };
      path();
      ctx!.fillStyle = hg(pal.ribbonA);
      ctx!.fill();
      ctx!.save();
      path();
      ctx!.clip();
      let g = ctx!.createLinearGradient(0, mn, 0, mx);
      g.addColorStop(0, `rgba(255,255,255,${pal.innerTop})`);
      g.addColorStop(0.5, `rgba(255,255,255,${pal.innerMid})`);
      g.addColorStop(1, `rgba(255,255,255,${pal.innerBot})`);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, mn, W, mx - mn);
      const sw = W * 0.18,
        sx = -sw + frac(t / T + r.ph / TAU) * (W + 2 * sw);
      g = ctx!.createLinearGradient(sx - sw, 0, sx + sw, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, `rgba(255,255,255,${pal.sheen})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, mn, W, mx - mn);
      ctx!.restore();
      /* bright lower edge */
      ctx!.save();
      ctx!.beginPath();
      ctx!.moveTo(bot[0][0], bot[0][1]);
      for (let i = 1; i <= N; i++) ctx!.lineTo(bot[i][0], bot[i][1]);
      ctx!.strokeStyle = `rgba(255,255,255,${pal.edge})`;
      ctx!.lineWidth = Math.max(1.2, 2 * sc);
      ctx!.shadowColor = `rgba(255,255,255,${pal.edge})`;
      ctx!.shadowBlur = 6 * dpr;
      ctx!.stroke();
      ctx!.restore();
      /* fine coloured hairline on upper edge */
      ctx!.beginPath();
      ctx!.moveTo(top[0][0], top[0][1]);
      for (let i = 1; i <= N; i++) ctx!.lineTo(top[i][0], top[i][1]);
      ctx!.strokeStyle = hg(pal.hairline);
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    function tokens(r: Ribbon, t: number, pal: Pal) {
      const fs = Math.max(11, 20 * sc);
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (const k of r.tok) {
        const u = frac(k.ph + (k.n * t) / T);
        const edge = sstep(0, 0.07, u) * sstep(0, 0.07, 1 - u);
        if (edge <= 0) continue;
        let x = X(u, W),
          c = cy(r, u, t, H),
          h = wd(r, u, t, H),
          y = c + k.lane * h;
        const c2 = cy(r, u + 0.003, t, H),
          ang0 = Math.atan2(c2 - c, X(u + 0.003, W) - x);
        const xr = x / W,
          js = 1 - sstep(0.3, 0.6, xr);
        const ang = ang0 + js * 0.45 * Math.sin((TAU * 3 * t) / T + k.s1);
        y += js * h * 0.12 * Math.sin((TAU * 4 * t) / T + k.s2);
        x += js * 4 * sc * Math.sin((TAU * 5 * t) / T + k.s3);
        const d = ((x - W / 2) / (W * 0.36)) ** 2 + ((y - H / 2) / (H * 0.27)) ** 2;
        const vf = sstep(0.7, 1.3, d);
        const swap = 0.3 + 0.7 * Math.min(1, Math.abs(xr - 0.5) / 0.03);
        const al = edge * vf * swap * pal.tokenA;
        if (al < 0.01) continue;
        const cc = col(xr),
          txt = xr < 0.5 ? k.pair[0] : k.pair[1];
        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(ang);
        ctx!.font = `600 ${(fs * k.sz).toFixed(1)}px 'Cascadia Code','JetBrains Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace`;
        ctx!.shadowColor = rgba(cc, al * 0.7);
        ctx!.shadowBlur = 9 * dpr;
        ctx!.fillStyle = rgba(cc, al);
        ctx!.fillText(txt, 0, 0);
        ctx!.restore();
      }
    }

    function draw(t: number, pal: Pal) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      /* sky */
      const cx = W / 2,
        cyy = H / 2;
      let g = ctx!.createRadialGradient(cx, cyy, 0, cx, cyy, Math.hypot(W, H) / 2);
      g.addColorStop(0, pal.bgStops[0]);
      g.addColorStop(0.35, pal.bgStops[1]);
      g.addColorStop(0.7, pal.bgStops[2]);
      g.addColorStop(1, pal.bgStops[3]);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
      g = ctx!.createRadialGradient(cx, cyy, 0, cx, cyy, W * 0.35);
      g.addColorStop(0, pal.centerGlow);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
      /* bokeh */
      for (const b of BK) {
        const f = frac(b.ph + t / T),
          s = Math.sin(Math.PI * f);
        const a = b.a * s * s * (0.7 + 0.3 * Math.sin((TAU * 2 * t) / T + b.s)) * pal.bokeh;
        const x = b.x * W + 18 * sc * Math.sin((TAU * t) / T + b.s);
        const y = H * (1.08 - 1.16 * f),
          rad = b.r * sc * 1.3;
        const c = col(b.x);
        const bg = ctx!.createRadialGradient(x, y, 0, x, y, rad);
        bg.addColorStop(0, `rgba(255,255,255,${a * 0.8})`);
        bg.addColorStop(0.7, rgba(c, a * 0.6));
        bg.addColorStop(1, rgba(c, 0));
        ctx!.fillStyle = bg;
        ctx!.beginPath();
        ctx!.arc(x, y, rad, 0, TAU);
        ctx!.fill();
        ctx!.strokeStyle = `rgba(255,255,255,${a * pal.ring})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(x, y, rad * 0.85, 0, TAU);
        ctx!.stroke();
      }
      /* ribbons + tokens */
      for (const r of R) {
        ribbon(r, t, pal);
        tokens(r, t, pal);
      }
      /* elliptical veil keeps the centre clear */
      ctx!.save();
      ctx!.translate(cx, cyy);
      const rx = W * 0.42,
        ry = H * 0.34;
      ctx!.scale(1, ry / rx);
      g = ctx!.createRadialGradient(0, 0, 0, 0, 0, rx);
      g.addColorStop(0, pal.veil[0]);
      g.addColorStop(0.55, pal.veil[1]);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(-rx, -rx, rx * 2, rx * 2);
      ctx!.restore();
      /* noise, fixed in device pixels */
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.fillStyle = noise;
      ctx!.fillRect(0, 0, cv!.width, cv!.height);
    }

    let theme = getTheme();
    const resize = () => {
      const parent = cv.parentElement;
      W = parent?.clientWidth || window.innerWidth;
      H = parent?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      sc = Math.min(W, H) / 1000;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      if (reduce) draw(14, PAL[theme]);
    };

    const ro = new ResizeObserver(resize);
    if (cv.parentElement) ro.observe(cv.parentElement);
    resize();

    /* follow theme switches (harness + smdeck runtime set data-theme) */
    const mo = new MutationObserver(() => {
      const next = getTheme();
      if (next !== theme) {
        theme = next;
        if (reduce) draw(14, PAL[theme]);
      }
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
      subtree: true,
    });

    let last = performance.now();
    const frame = (now: number) => {
      const dt = now - last;
      if (dt > 90) {
        last = now;
        draw((now / 1000) % T, PAL[theme]);
      }
      raf = requestAnimationFrame(frame);
    };
    if (!reduce) {
      draw(0, PAL[theme]);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
