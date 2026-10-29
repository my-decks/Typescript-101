/* 12 · Type Inference 101 — you write less, TS still knows */

const Kw = (p: any) => <span style={{ color: "var(--tk-k)" }}>{p.children}</span>;
const V = (p: any) => <span style={{ color: "var(--tk-f)" }}>{p.children}</span>;
const S = (p: any) => <span style={{ color: "var(--tk-str)" }}>{p.children}</span>;
const N = (p: any) => <span style={{ color: "var(--tk-n)" }}>{p.children}</span>;
const Cm = (p: any) => <span style={{ color: "var(--tk-cm)", fontStyle: "italic" }}>{p.children}</span>;

function Code({ file, lang, size = 15, style, children }: any) {
  const lines: any[][] = [[]];
  const kids: any[] = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (typeof c === "string") {
      (c as string).split("\n").forEach((p, i) => {
        if (i > 0) lines.push([]);
        if (p) lines[lines.length - 1].push(p);
      });
    } else {
      lines[lines.length - 1].push(c);
    }
  }
  const clen = (xs: any[]): number =>
    xs.reduce((n, x) => n + (typeof x === "string" ? x.length : clen(Array.isArray(x.props.children) ? x.props.children : [x.props.children])), 0);
  let t = 0.55;
  return (
    <div className="code" style={style}>
      <div className="code-bar"><i /><i /><i /><b>{file}</b><em className={lang === "js" ? "js" : ""}>{(lang || "ts").toUpperCase()}</em></div>
      <div className="idle-scan" />
      <pre style={{ fontSize: size, padding: "13px 16px" }}>
        {lines.map((ln, i) => {
          const n = Math.max(4, clen(ln));
          const d = t;
          t += n * 0.011 + 0.045;
          return (
            <div className="tlw" key={i}>
              {ln.length === 0 ? "\u00A0" : <span className="tl" style={{ "--n": n, "--d": `${d.toFixed(2)}s` } as any}>{ln}</span>}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

const Ic = ({ children, size = 24 }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);

function Card({ y, icon, h, children }: any) {
  return (
    <div style={{ position: "relative", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "15px 17px", boxShadow: "var(--shadow)", overflow: "hidden" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: y ? "var(--js)" : "var(--ts)" }} />
      <span className="idle-float" style={{ color: y ? "#B58F00" : "var(--ts)", display: "inline-flex", marginBottom: 8 }}>{icon}</span>
      <h4 style={{ font: "600 16.5px var(--fd)", color: "var(--ink)", margin: "0 0 4px" }}>{h}</h4>
      <p style={{ font: "400 13.5px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>{children}</p>
    </div>
  );
}

export default function Slide() {
  return (
    <div style={{ position: "absolute", top: 92, left: 64, right: 64, bottom: 72, display: "flex", flexDirection: "column" }}>
      <p className="an up" style={{ font: "700 12.5px var(--fm)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ts)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="idle-nudge" style={{ color: "var(--js)", fontWeight: 700 }}>{"</>"}</span>
        Inference
      </p>
      <h2 className="an up d1" style={{ font: "700 40px/1.08 var(--fd)", letterSpacing: "-.03em", color: "var(--ink)", margin: "10px 0 0" }}>You write less. TS still knows.</h2>
      <div className="an bar d2" style={{ display: "flex", gap: 6, marginTop: 14 }}>
        <i className="idle-sheen" style={{ height: 5, borderRadius: 3, width: 52, background: "linear-gradient(90deg,var(--ts),var(--vs),var(--ts))", display: "block" }} />
        <i style={{ height: 5, borderRadius: 3, width: 18, background: "var(--js)", display: "block" }} />
      </div>
      <p className="an up d3" style={{ font: "400 18px/1.5 var(--fb)", color: "var(--mut)", margin: "13px 0 0", maxWidth: 1000 }}>
        Hover any variable in VS Code to see what the compiler inferred.
      </p>

      <div className="stag" style={{ display: "grid", gridTemplateColumns: "1.08fr 1fr", gap: 26, alignItems: "start", marginTop: 18 }}>
        <Code file="inference.ts" size={14.5}>
          <Kw>{"let "}</Kw><V>count</V>{" = "}<N>0</N>{";\n"}<Cm>{"// let count: number"}</Cm>{"\n\n"}
          <Kw>{"const "}</Kw><V>name</V>{" = "}<S>{'"Ada"'}</S>{";\n"}<Cm>{"// const name: \"Ada\"   ← literal type"}</Cm>{"\n\n"}
          <Kw>{"const "}</Kw><V>tags</V>{" = ["}<S>{'"ts"'}</S>{", "}<S>{'"js"'}</S>{"];\n"}<Cm>{"// const tags: string[]"}</Cm>{"\n\n"}
          <Kw>{"const "}</Kw><V>user</V>{" = { "}<V>id</V>{": "}<N>1</N>{", "}<V>active</V>{": "}<N>true</N>{" };\n"}<Cm>{"// { id: number; active: boolean }"}</Cm>
        </Code>
        <div className="stag sb" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card icon={<Ic><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></Ic>} h="Hover to learn">
            Use hover or <code className="i">Ctrl + K, Ctrl + I</code> to see the inferred type.
          </Card>
          <Card y icon={<Ic><path d="m12 2 9 5-9 5-9-5z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></Ic>} h="let vs const">
            <code className="i">const</code> keeps the narrow literal, <code className="i">let</code> widens it to a general type.
          </Card>
          <Card icon={<Ic><path d="m4 12.5 5 5L20 6.5" /></Ic>} h="Annotate boundaries">
            Let TS infer locals; write types on exports and function parameters.
          </Card>
        </div>
      </div>
    </div>
  );
}
