/* 17 · Live Demo — break it, catch it, fix it */

const Ic = ({ children, size = 25 }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

function Card({ y, icon, h, children }: any) {
  return (
    <div style={{ position: "relative", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "17px 18px", boxShadow: "var(--shadow)", overflow: "hidden" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: y ? "var(--js)" : "var(--ts)" }} />
      <span className="idle-float" style={{ color: y ? "#B58F00" : "var(--ts)", display: "inline-flex" }}>{icon}</span>
      <h4 style={{ font: "600 18px var(--fd)", color: "var(--ink)", margin: "10px 0 5px" }}>{h}</h4>
      <p style={{ font: "400 14px/1.5 var(--fb)", color: "var(--mut)", margin: 0 }}>{children}</p>
    </div>
  );
}

export default function Slide() {
  return (
    <div style={{ position: "absolute", top: 92, left: 64, right: 64, bottom: 72, display: "flex", flexDirection: "column" }}>
      <p className="an up" style={{ font: "700 12.5px var(--fm)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ts)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="idle-nudge" style={{ color: "var(--js)", fontWeight: 700 }}>{"</>"}</span>
        Demo
      </p>
      <h2 className="an up d1" style={{ font: "700 40px/1.08 var(--fd)", letterSpacing: "-.03em", color: "var(--ink)", margin: "10px 0 0" }}>Break it. Catch it. Fix it.</h2>
      <div className="an bar d2" style={{ display: "flex", gap: 6, marginTop: 14 }}>
        <i className="idle-sheen" style={{ height: 5, borderRadius: 3, width: 52, background: "linear-gradient(90deg,var(--ts),var(--vs),var(--ts))", display: "block" }} />
        <i style={{ height: 5, borderRadius: 3, width: 18, background: "var(--js)", display: "block" }} />
      </div>

      <div className="stag poppy" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 26 }}>
        <Card icon={<Ic><path d="m4 17 6-5-6-5M12 19h8" /></Ic>} h="Scaffold">
          <code className="i">npm init -y</code> → install <code className="i">typescript</code> and <code className="i">eslint</code>; add tsconfig.
        </Card>
        <Card y icon={<Ic><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></Ic>} h="See the errors">
          Trigger a type error and an ESLint warning; use Quick Fix.
        </Card>
        <Card icon={<Ic><circle cx="12" cy="13" r="5" /><path d="M12 8V6M8.5 9.5 6 7M15.5 9.5 18 7M7 13H4M20 13h-3M8.5 16.5 6 19M15.5 16.5 18 19" /></Ic>} h="Debug">
          Set a conditional breakpoint; step through a mapped .ts file.
        </Card>
        <Card y icon={<Ic><path d="M12 3l2.1 5.6L20 11l-5.9 2.4L12 19l-2.1-5.6L4 11l5.9-2.4z" /></Ic>} h="Inference tour">
          Hover variables, add a generic, narrow a union.
        </Card>
      </div>

      <div className="an up d8" style={{ marginTop: 22, alignSelf: "center", padding: "9px 20px", borderRadius: 999, border: "1px dashed var(--border-strong)", color: "var(--mut)", font: "500 13.5px var(--fm)" }}>
        live terminal on the side — stop me at any step
      </div>
    </div>
  );
}
