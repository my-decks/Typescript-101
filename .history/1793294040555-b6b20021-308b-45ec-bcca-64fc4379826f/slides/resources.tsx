/* 20 · Resources — keep learning */

const Ic = ({ children }: any) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

const ROWS = [
  { icon: <Ic><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z" /><path d="M20 17v5H6.5a2.5 2.5 0 0 1 0-5" /></Ic>, h: "TypeScript Handbook", p: <>typescriptlang.org/docs — start with “Everyday Types”.</> },
  { icon: <Ic><circle cx="12" cy="13" r="5" /><path d="M12 8V6M8.5 9.5 6 7M15.5 9.5 18 7M7 13H4M20 13h-3M8.5 16.5 6 19M15.5 16.5 18 19" /></Ic>, h: "VS Code: Debugging", p: <>code.visualstudio.com/docs/editor/debugging</> },
  { icon: <Ic><path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z" /></Ic>, h: "typescript-eslint", p: <>typescript-eslint.io — rules and flat-config guide.</> },
  { icon: <Ic><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></Ic>, h: "Microsoft Learn", p: <>Search Microsoft Learn for “TypeScript” learning paths.</> },
];

export default function Slide() {
  return (
    <div style={{ position: "absolute", top: 92, left: 64, right: 64, bottom: 72, display: "flex", flexDirection: "column" }}>
      <p className="an up" style={{ font: "700 12.5px var(--fm)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ts)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="idle-nudge" style={{ color: "var(--js)", fontWeight: 700 }}>{"</>"}</span>
        Keep Learning
      </p>
      <h2 className="an up d1" style={{ font: "700 40px/1.08 var(--fd)", letterSpacing: "-.03em", color: "var(--ink)", margin: "10px 0 0" }}>Resources &amp; next steps</h2>
      <div className="an bar d2" style={{ display: "flex", gap: 6, marginTop: 14 }}>
        <i className="idle-sheen" style={{ height: 5, borderRadius: 3, width: 52, background: "linear-gradient(90deg,var(--ts),var(--vs),var(--ts))", display: "block" }} />
        <i style={{ height: 5, borderRadius: 3, width: 18, background: "var(--js)", display: "block" }} />
      </div>

      <div className="stag" style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, maxWidth: 900 }}>
        {ROWS.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 15, padding: "13px 16px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow)", alignItems: "center" }}>
            <span style={{ width: 46, height: 46, borderRadius: 11, display: "grid", placeItems: "center", background: "var(--ts-soft)", color: "var(--ts)" }}>{r.icon}</span>
            <div>
              <h4 style={{ font: "600 16.5px var(--fd)", color: "var(--ink)", margin: 0 }}>{r.h}</h4>
              <p style={{ font: "400 13.5px/1.45 var(--fb)", color: "var(--mut)", margin: "3px 0 0" }}>{r.p}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
