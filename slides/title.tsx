"use client";
import React, { useEffect, useRef, useState } from "react";

/* 01 · Title — "VS Code & TS: Modern Web Tooling" (reduced) */

const LOOP_MS = 25000; // intro replays on this cadence

const SUBTITLE =
  "Native debugging, linting & TypeScript type inference — the three habits that make JavaScript projects calmer to build.".split(
    " ",
  );

const rv = (d: string, extra: React.CSSProperties = {}) =>
  ({ "--d": d, ...extra }) as React.CSSProperties;

const SLIDE_CSS = `
.tl-root{ --mx:0; --my:0; }

/* loop envelope */
.tl-stage{
  --loop: 25s;
  animation-name: tlStageIn, tlLoopOut;
  animation-duration: 1.1s, 1.25s;
  animation-timing-function: cubic-bezier(.22,1,.36,1), ease-in;
  animation-delay: 0s, calc(var(--loop) - 1.25s);
  animation-fill-mode: both, forwards;
}
@keyframes tlStageIn{ from{ opacity:0; transform:scale(.965); } }
@keyframes tlLoopOut{ from{ opacity:1; } to{ opacity:0; } }

/* entrance reveal */
.tl-rv{ opacity:0; animation:tlRise .95s cubic-bezier(.22,1,.36,1) var(--d,0s) both; }
@keyframes tlRise{
  from{ opacity:0; transform:translateY(26px) scale(.985); filter:blur(8px); }
  to{ opacity:1; transform:none; filter:blur(0); }
}

/* pointer parallax */
.tl-par{ position:absolute; inset:0; will-change:transform;
  transform:translate3d(calc(var(--mx)*7px),calc(var(--my)*5px),0); }

/* typed headline */
.tl-tc{ display:inline-block; opacity:0;
  animation:tlType .01s steps(1) var(--cd,0s) both; }
@keyframes tlType{ to{ opacity:1; } }

/* second line wipes in */
.tl-wipe{ display:inline-block; clip-path:inset(-.2em 100% -.2em 0);
  animation:tlWipe 1.1s steps(18) 1.9s forwards; }
@keyframes tlWipe{ to{ clip-path:inset(-.2em -.05em -.2em 0); } }
.tl-word{ display:inline-block;
  background:linear-gradient(100deg,#1a6bff,#4f46f0 35%,#7a3cf0 55%,#4f46f0 75%,#1a6bff);
  background-size:220% 100%;
  -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; color:transparent;
  animation:tlFlow 6.5s ease-in-out 3s infinite; }
@keyframes tlFlow{ 0%,100%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } }

/* underline draws itself */
.tl-line{
  background:linear-gradient(90deg,#16b8ff,#7a35ef 45%,#4d8bff 75%,#16b8ff);
  background-size:200% 100%;
  transform:scaleX(0); transform-origin:left center;
  animation:tlLineGrow .85s cubic-bezier(.7,0,.2,1) 3.1s both,
            tlFlow 4.5s ease-in-out 4s infinite; }
@keyframes tlLineGrow{ to{ transform:scaleX(1); } }

/* editor tab strip */
.tl-tabs{ display:inline-flex; border-radius:8px; overflow:hidden;
  border:1px solid rgba(127,127,127,.28);
  box-shadow:0 12px 32px rgba(49,120,198,.22); }
.tl-tab{ display:flex; align-items:center; gap:9px; height:38px; padding:0 20px;
  font:600 13px var(--fm); white-space:nowrap; letter-spacing:.06em; }
.tl-tab-on{ background:#1e1e1e; color:#fff; border-top:2px solid var(--ts); }
.tl-tab-off{ background:#2d2d2d; color:#8b8b8b; border-top:2px solid transparent; }

/* badges pop */
.tl-badge-pop{ display:inline-block; transform:scale(0);
  animation:tlSqPop .55s cubic-bezier(.3,1.6,.4,1) var(--d,0s) both; }
@keyframes tlSqPop{ to{ transform:scale(1); } }

/* subtitle — word by word */
.tl-wordrv{ display:inline-block; opacity:0;
  animation:tlWordRise .7s cubic-bezier(.2,.9,.3,1.08) var(--cd,0s) both; }
@keyframes tlWordRise{
  from{ opacity:0; transform:translateY(18px); filter:blur(5px); }
  to{ opacity:1; transform:none; filter:blur(0); } }

@media (prefers-reduced-motion: reduce){
  .tl-stage, .tl-stage *{ animation:none !important; }
  .tl-rv,.tl-wordrv,.tl-tc{ opacity:1 !important; }
  .tl-wipe{ clip-path:none !important; }
  .tl-line,.tl-badge-pop{ transform:none !important; }
}
`;

function Badge({ label, js }: { label: string; js?: boolean }) {
  return (
    <span
      className="idle-bob"
      style={{
        display: "inline-grid",
        placeItems: "end",
        width: 66,
        height: 66,
        background: js ? "var(--js)" : "var(--ts)",
        color: js ? "#1b1b1b" : "#fff",
        borderRadius: 12,
        padding: "6px 9px",
        font: "800 26px var(--fd)",
        letterSpacing: "-.04em",
        boxShadow: js ? "0 8px 24px rgba(240,192,0,.35)" : "0 8px 24px rgba(49,120,198,.35)",
      }}
    >
      {label}
    </span>
  );
}

function Typed({ text, base = 0, step = 0.07 }: { text: string; base?: number; step?: number }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span
          key={i}
          className="tl-tc"
          style={{ "--cd": `${(base + i * step).toFixed(2)}s` } as React.CSSProperties}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </>
  );
}

export default function Slide() {
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tgt = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  /* loop: remount the stage every LOOP_MS so animations restart */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCycle((c) => c + 1), LOOP_MS);
    return () => clearInterval(id);
  }, []);

  /* smooth pointer parallax */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      cur.current.x += (tgt.current.x - cur.current.x) * 0.065;
      cur.current.y += (tgt.current.y - cur.current.y) * 0.065;
      root.style.setProperty("--mx", cur.current.x.toFixed(4));
      root.style.setProperty("--my", cur.current.y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={rootRef}
      className="tl-root"
      onMouseMove={(e) => {
        tgt.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        tgt.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      }}
      onMouseLeave={() => {
        tgt.current.x = 0;
        tgt.current.y = 0;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <style dangerouslySetInnerHTML={{ __html: SLIDE_CSS }} />

      <div
        key={cycle}
        className="tl-stage"
        style={{ position: "absolute", inset: 0, "--loop": `${LOOP_MS}ms` } as React.CSSProperties}
      >
        <div className="tl-par">
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {/* badges */}
            <div style={{ display: "flex", gap: 14 }}>
              <span className="tl-badge-pop" style={rv(".3s")}>
                <Badge label="JS" js />
              </span>
              <span className="tl-badge-pop" style={rv(".45s")}>
                <Badge label="TS" />
              </span>
            </div>

            {/* editor tabs */}
            <div className="tl-rv" style={rv(".7s", { marginTop: 22 })}>
              <div className="tl-tabs">
                <span className="tl-tab tl-tab-on">JavaScript / TS</span>
                <span className="tl-tab tl-tab-off">TypeScript 101</span>
              </div>
            </div>

            {/* headline */}
            <h1
              style={{
                font: "800 74px/1.06 var(--fd)",
                letterSpacing: "-.045em",
                color: "var(--ink)",
                margin: "24px 0 0",
              }}
            >
              <Typed text="VS Code & TS" base={0.95} />
              <br />
              <span className="tl-wipe">
                <span className="tl-word">Modern Web Tooling</span>
              </span>
            </h1>
            <div
              className="tl-line"
              style={{ marginTop: 20, width: 180, height: 6, borderRadius: 99 }}
            />

            {/* subtitle */}
            <p
              style={{
                font: "400 20px/1.5 var(--fb)",
                color: "var(--mut)",
                margin: "20px 0 0",
                maxWidth: 640,
              }}
            >
              {SUBTITLE.map((w, i) => (
                <React.Fragment key={i}>
                  {i > 0 && " "}
                  <span
                    className="tl-wordrv"
                    style={{ "--cd": `${(2.4 + i * 0.04).toFixed(2)}s` } as React.CSSProperties}
                  >
                    {w}
                  </span>
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
