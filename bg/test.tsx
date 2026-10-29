import { useEffect, useRef } from "react";

/**
 * CommonBg — title-slide background with a clear opening moment, graphics only (no code, no text).
 *
 * Opening (first ~2s, plays once):
 *   a light wipe sweeps corner to corner, the corner stripes flash, the dot grid
 *   ripples in from the bottom-right, and two graphic clusters pop in at the sides.
 *
 * Side graphics (loop):
 *   LEFT  — a glossy tile that flips from JS yellow to TS blue (and back), with an
 *           orbiting ring, orbiting orbs and a sparkle at the flip.
 *   RIGHT — a glass hexagon with a counter-rotating inner hexagon, three orbiting orbs
 *           and soft ripple rings radiating outward.
 *
 * Always running at the edges: light sweeps on the corner stripes, a spark on the
 * top-right line, a dot-grid ripple, and rising bokeh bubbles.
 *
 * The centre (title, badges, overlay) is never drawn on: effects are clipped
 * outside a centre ellipse and the clusters sit in the side margins.
 *
 * Put bg.png in /public (or pass `src`). Seamless 24s loop, 30fps cap, pauses when
 * hidden, prefers-reduced-motion paints one finished static frame.
 */

const TAU = Math.PI * 2;
const LOOP = 24;
const STORY = 12;
const FPS = 30;

const frac = (v: number) => v - Math.floor(v);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => {
  const k = clamp(v);
  return k * k * (3 - 2 * k);
};
const back = (v: number) => {
  const k = clamp(v) - 1;
  return 1 + k * k * (2.4 * k + 1.4);
};
const mix = (a: number[], b: number[], k: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * k));
const YEL = [240, 192, 0];
const SKY = [64, 150, 240];
const BLU = [49, 120, 198];
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const col = (x: number) => mix(YEL, SKY, clamp(x));

const STRIPES: { a: [number, number]; b: [number, number]; w: number; k: number; ph: number }[] = [
  { a: [0.837, 0.935], b: [1.0, 0.648], w: 0.034, k: 2, ph: 0.0 },
  { a: [0.867, 0.983], b: [0.987, 0.78], w: 0.022, k: 2, ph: 0.12 },
  { a: [0.0, 0.08], b: [0.05, 0.0], w: 0.016, k: 2, ph: 0.5 },
  { a: [0.0, 0.13], b: [0.045, 0.04], w: 0.012, k: 2, ph: 0.62 },
];
const LINE = { a: [0.807, 0.086], b: [1.0, 0.31] };

const DOTS: { x: number; y: number; u: number; base: number }[] = [];
for (let gx = 0; gx < 20; gx++)
  for (let gy = 0; gy < 15; gy++) {
    const u = gx / 19,
      v = gy / 14,
      d = u * 0.8 + v * 0.8;
    if (d < 0.45 || d > 1.45) continue;
    DOTS.push({
      x: 0.712 + u * 0.268,
      y: 0.585 + v * 0.34,
      u: u + v,
      base: 0.12 + 0.2 * (1 - Math.abs(d - 0.95)),
    });
  }

/* rising bokeh bubbles, side margins only */
const BUBBLES = [
  { x: 0.045, r: 15, k: 1, ph: 0.1 },
  { x: 0.19, r: 10, k: 2, ph: 0.55 },
  { x: 0.085, r: 22, k: 1, ph: 0.62 },
  { x: 0.955, r: 14, k: 1, ph: 0.3 },
  { x: 0.8, r: 11, k: 2, ph: 0.8 },
  { x: 0.915, r: 24, k: 1, ph: 0.9 },
];

const PAL = {
  light: { glow: 0.8, dot: 0.7, gloss: 0.85, glass: 0.55, bubble: 1 },
  dark: { glow: 0.45, dot: 0.9, gloss: 0.5, glass: 0.18, bubble: 0.6 },
} as const;

export default function CommonBg({
  src = "/bg.png",
  style,
}: {
  src?: string;
  style?: React.CSSProperties;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current,
      box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0,
      W = 0,
      H = 0,
      dpr = 1,
      sc = 1,
      last = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const getTheme = (): "light" | "dark" => {
      const el =
        document.getElementById("root") ?? document.querySelector<HTMLElement>("[data-theme]");
      return el?.getAttribute("data-theme") === "dark" ? "dark" : "light";
    };
    let theme = getTheme();
    const applyTheme = () => {
      box.style.backgroundImage =
        theme === "dark"
          ? "radial-gradient(ellipse at 50% 45%, #101A33 0%, #0A1020 45%, #05080F 100%)"
          : `url(${src})`;
    };
    applyTheme();

    const clipOutsideCentre = () => {
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.ellipse(W / 2, H / 2, W * 0.3, H * 0.3, 0, 0, TAU);
      ctx.clip("evenodd");
    };

    const sweep = (
      a: [number, number],
      b: [number, number],
      p: number,
      len: number,
      width: number,
      alpha: number,
    ) => {
      const fade = Math.sin(Math.PI * p);
      if (fade <= 0.02) return;
      const t0 = clamp(p - len / 2),
        t1 = clamp(p + len / 2);
      const x0 = (a[0] + (b[0] - a[0]) * t0) * W,
        y0 = (a[1] + (b[1] - a[1]) * t0) * H;
      const x1 = (a[0] + (b[0] - a[0]) * t1) * W,
        y1 = (a[1] + (b[1] - a[1]) * t1) * H;
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, `rgba(255,255,255,${Math.min(1, alpha * fade)})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = width * W;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    };

    /* glossy sphere */
    const orb = (x: number, y: number, r: number, c: number[], a: number, gloss: number) => {
      const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${0.95 * gloss * a})`);
      g.addColorStop(0.35, rgba(c, 0.9 * a));
      g.addColorStop(1, rgba(mix(c, [20, 50, 120], 0.35), 0.85 * a));
      ctx.save();
      ctx.shadowColor = rgba(c, 0.5 * a);
      ctx.shadowBlur = r * 1.4;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      ctx.restore();
    };

    const hex = (cx: number, cy: number, R: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + (i * TAU) / 6;
        const px = cx + Math.cos(a) * R,
          py = cy + Math.sin(a) * R;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
    };

    const sparkle = (x: number, y: number, r: number, a: number) => {
      if (a <= 0.01) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.shadowColor = `rgba(255,255,255,${a})`;
      ctx.shadowBlur = r;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rr = i % 2 ? r * 0.18 : r;
        const ang = (i * TAU) / 8;
        ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    /* LEFT: JS -> TS flipping tile with orbit */
    const tileCluster = (
      pal: (typeof PAL)[keyof typeof PAL],
      u: number,
      c: number,
      vis: number,
      still: boolean,
    ) => {
      if (vis <= 0.01) return;
      const cx = W * 0.115,
        cy = H * 0.4 + Math.sin(TAU * u * 2) * 5 * sc;
      const S = W * 0.07;
      const morph = c < 4 ? 0 : c < 6 ? ease((c - 4) / 2) : c < 10 ? 1 : 1 - ease((c - 10) / 2);
      const base = morph > 0.5 ? BLU : YEL;
      const accent = mix(YEL, BLU, morph);
      ctx.save();
      ctx.globalAlpha = clamp(vis);
      ctx.translate(cx, cy);
      ctx.scale(0.7 + 0.3 * vis, 0.7 + 0.3 * vis);

      /* orbit ring, tilted */
      ctx.save();
      ctx.rotate(-0.45);
      ctx.strokeStyle = rgba(accent, 0.5);
      ctx.setLineDash([3 * sc, 7 * sc]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 0, S * 1.2, S * 0.5, 0, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < 2; i++) {
        const a = TAU * (u * 4 + i * 0.5);
        orb(
          Math.cos(a) * S * 1.2,
          Math.sin(a) * S * 0.5,
          (i ? 6 : 9) * sc,
          i ? SKY : YEL,
          1,
          pal.gloss,
        );
      }
      ctx.restore();

      /* flipping tile */
      const sx = Math.cos(Math.PI * morph);
      ctx.save();
      ctx.rotate(Math.sin(TAU * u * 2) * 0.05);
      ctx.scale(Math.max(0.04, Math.abs(sx)), 1);
      const g = ctx.createLinearGradient(-S / 2, -S / 2, S / 2, S / 2);
      g.addColorStop(0, rgba(mix(base, [255, 255, 255], 0.35), 1));
      g.addColorStop(1, rgba(mix(base, [10, 40, 110], 0.25), 1));
      ctx.shadowColor = rgba(base, 0.55);
      ctx.shadowBlur = 28 * dpr;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.roundRect(-S / 2, -S / 2, S, S, S * 0.22);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255,255,255,${0.7 * pal.gloss})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      /* glossy highlight */
      const hg = ctx.createLinearGradient(0, -S / 2, 0, 0);
      hg.addColorStop(0, `rgba(255,255,255,${0.5 * pal.gloss})`);
      hg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.roundRect(-S / 2 + 4, -S / 2 + 4, S - 8, S / 2 - 4, S * 0.18);
      ctx.fill();
      /* inner mark: two small bars that change from rising to level with the flip */
      ctx.fillStyle = "rgba(255,255,255,.85)";
      ctx.beginPath();
      ctx.roundRect(-S * 0.22, S * 0.02, S * 0.44, S * 0.07, S * 0.035);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-S * 0.22, S * 0.17, S * (0.2 + 0.24 * morph), S * 0.07, S * 0.035);
      ctx.fill();
      ctx.restore();

      /* sparkle burst at the flip */
      const burst = 1 - clamp(Math.abs(morph - 0.5) / 0.35);
      if (morph > 0 && morph < 1) {
        sparkle(S * 0.45, -S * 0.45, 14 * sc * (0.5 + burst), burst);
        sparkle(-S * 0.5, S * 0.35, 9 * sc * (0.5 + burst), burst * 0.8);
      }
      ctx.restore();
      void still;
    };

    /* RIGHT: glass hexagon with orbs and ripples */
    const hexCluster = (pal: (typeof PAL)[keyof typeof PAL], u: number, vis: number) => {
      if (vis <= 0.01) return;
      const cx = W * 0.885,
        cy = H * 0.6 - Math.sin(TAU * u * 2) * 5 * sc;
      const R = W * 0.042;
      ctx.save();
      ctx.globalAlpha = clamp(vis);
      ctx.translate(cx, cy);
      ctx.scale(0.7 + 0.3 * vis, 0.7 + 0.3 * vis);
      ctx.translate(-cx, -cy);

      /* ripple rings */
      for (let i = 0; i < 3; i++) {
        const f = frac(u * 6 + i / 3);
        ctx.strokeStyle = rgba(mix(SKY, YEL, f * 0.6), (1 - f) ** 1.6 * 0.4);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.1 + f * R * 1.7, 0, TAU);
        ctx.stroke();
      }
      /* orbit ring + orbs */
      ctx.strokeStyle = rgba(SKY, 0.45);
      ctx.setLineDash([3 * sc, 7 * sc]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.65, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      const orbs = [YEL, SKY, BLU];
      for (let i = 0; i < 3; i++) {
        const a = TAU * (u * 3 + i / 3);
        orb(
          cx + Math.cos(a) * R * 1.65,
          cy + Math.sin(a) * R * 1.65,
          (i === 1 ? 6 : 8.5) * sc,
          orbs[i],
          1,
          pal.gloss,
        );
      }
      /* glass hexagon */
      hex(cx, cy, R, TAU * u * 2);
      const g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      g.addColorStop(0, `rgba(255,255,255,${pal.glass})`);
      g.addColorStop(1, rgba(SKY, 0.22));
      ctx.shadowColor = rgba(SKY, 0.5);
      ctx.shadowBlur = 24 * dpr;
      ctx.fillStyle = g;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = rgba(BLU, 0.9);
      ctx.lineWidth = 2;
      ctx.stroke();
      /* counter-rotating inner hexagon */
      hex(cx, cy, R * 0.55, -TAU * u * 4);
      ctx.strokeStyle = rgba(YEL, 0.95);
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.fillStyle = rgba(YEL, 0.22);
      ctx.fill();
      ctx.restore();
    };

    const draw = (s: number, still = false) => {
      const pal = PAL[theme];
      const u = frac(s / LOOP);
      const intro = still ? 9 : s;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      clipOutsideCentre();

      /* opening wipe */
      if (!still && s < 2.0) {
        const p = ease((s - 0.1) / 1.8);
        const g = ctx.createLinearGradient(0, H, W, 0);
        const c0 = clamp(p * 1.3 - 0.15);
        g.addColorStop(clamp(c0 - 0.14), "rgba(255,255,255,0)");
        g.addColorStop(c0, `rgba(255,255,255,${theme === "dark" ? 0.18 : 0.85})`);
        g.addColorStop(clamp(c0 + 0.14), "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      /* bokeh bubbles */
      for (const b of BUBBLES) {
        const f = frac(u * b.k + b.ph),
          sn = Math.sin(Math.PI * f);
        const a = 0.55 * sn * pal.bubble * ease(intro / 1.5);
        const x = b.x * W + Math.sin(TAU * (u * 2 + b.ph)) * 10 * sc,
          y = H * (1.05 - 1.1 * f),
          r = b.r * sc;
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
        g.addColorStop(0, `rgba(255,255,255,${a * 0.9})`);
        g.addColorStop(0.7, rgba(col(b.x), a * 0.35));
        g.addColorStop(1, rgba(col(b.x), 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.88, 0, TAU);
        ctx.stroke();
      }

      /* stripe sheens, stronger burst at the start */
      const burst = 1 + 1.2 * Math.exp(-intro * 0.9);
      for (const st of STRIPES)
        sweep(st.a, st.b, frac(u * st.k + st.ph), 0.6, st.w, pal.glow * burst);

      /* spark on top-right line, 3 passes per loop */
      {
        const p = frac(u * 3);
        const x0 = LINE.a[0] * W,
          y0 = LINE.a[1] * H,
          dx = (LINE.b[0] - LINE.a[0]) * W,
          dy = (LINE.b[1] - LINE.a[1]) * H;
        const from = Math.max(0, p - 0.24);
        const g = ctx.createLinearGradient(
          x0 + dx * from,
          y0 + dy * from,
          x0 + dx * p,
          y0 + dy * p,
        );
        g.addColorStop(0, rgba(col(from), 0));
        g.addColorStop(1, rgba(col(p), 0.95));
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(1.6, 2.4 * sc);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x0 + dx * from, y0 + dy * from);
        ctx.lineTo(x0 + dx * p, y0 + dy * p);
        ctx.stroke();
        const hx = x0 + dx * p,
          hy = y0 + dy * p,
          hr = 8 * sc;
        const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
        hg.addColorStop(0, "rgba(255,255,255,.95)");
        hg.addColorStop(0.4, rgba(col(p), 0.6));
        hg.addColorStop(1, rgba(col(p), 0));
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(hx, hy, hr, 0, TAU);
        ctx.fill();
      }

      /* dot-grid ripple, ripples in from bottom-right at start */
      for (const d of DOTS) {
        const reveal = ease((intro - 0.2 - (2 - d.u) * 0.28) / 0.6);
        if (reveal <= 0) continue;
        const wave = 0.5 + 0.5 * Math.sin(TAU * (d.u * 1.1 - u * 2));
        const w3 = wave * wave * wave;
        const a = (d.base * 0.5 + 1.6 * w3 * d.base) * pal.dot * reveal;
        ctx.fillStyle = `rgba(47,140,240,${clamp(a, 0, 0.9)})`;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, (1.5 + 1.5 * w3) * sc * (0.6 + 0.4 * reveal), 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      /* side graphics (hidden on narrow screens) */
      if (W / H >= 1.5) {
        const c = still ? 7.5 : (((s - 0.6) % STORY) + STORY) % STORY;
        tileCluster(pal, u, c, still ? 1 : back((s - 0.5) / 0.8), still);
        hexCluster(pal, u, still ? 1 : back((s - 0.9) / 0.8));
      }
    };

    const resize = () => {
      W = box.clientWidth || window.innerWidth;
      H = box.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      sc = Math.min(W, H) / 900;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      if (reduce) draw(6, true);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    const mo = new MutationObserver(() => {
      const next = getTheme();
      if (next === theme) return;
      theme = next;
      applyTheme();
      if (reduce) draw(6, true);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
      subtree: true,
    });

    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || now - last < 1000 / FPS) return;
      last = now;
      draw((now - start) / 1000);
    };
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [src]);

  return (
    <div
      ref={wrap}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        pointerEvents: "none",
        ...style,
      }}
    >
      <canvas
        ref={ref}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
