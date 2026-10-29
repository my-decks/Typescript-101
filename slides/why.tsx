/* 04 · Why Tooling? — JavaScript fails at runtime */

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
    xs.reduce(
      (n, x) =>
        n +
        (typeof x === "string"
          ? x.length
          : clen(Array.isArray(x.props.children) ? x.props.children : [x.props.children])),
      0,
    );
  let t = 0.55;
  return (
    <div className="code" style={style}>
      <div className="code-bar">
        <i />
        <i />
        <i />
        <b>{file}</b>
        <em className={lang === "js" ? "js" : ""}>{(lang || "ts").toUpperCase()}</em>
      </div>
      <div className="idle-scan" />
      <pre style={{ fontSize: size, padding: "13px 16px" }}>
        {lines.map((ln, i) => {
          const n = Math.max(4, clen(ln));
          const d = t;
          t += n * 0.011 + 0.045;
          return (
            <div className="tlw" key={i}>
              {ln.length === 0 ? (
                "\u00A0"
              ) : (
                <span className="tl" style={{ "--n": n, "--d": `${d.toFixed(2)}s` } as any}>
                  {ln}
                </span>
              )}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

const F = (p: any) => <span style={{ color: "var(--tk-d)" }}>{p.children}</span>;
const V = (p: any) => <span style={{ color: "var(--tk-f)" }}>{p.children}</span>;
const N = (p: any) => <span style={{ color: "var(--tk-n)" }}>{p.children}</span>;
const Cm = (p: any) => (
  <span style={{ color: "var(--tk-cm)", fontStyle: "italic" }}>{p.children}</span>
);
const Kw = (p: any) => <span style={{ color: "var(--tk-k)" }}>{p.children}</span>;

export default function Slide() {
  return (
    <div
      style={{
        position: "absolute",
        top: 92,
        left: 64,
        right: 64,
        bottom: 72,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <p
        className="an up"
        style={{
          font: "700 12.5px var(--fm)",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "var(--ts)",
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span className="idle-nudge" style={{ color: "var(--js)", fontWeight: 700 }}>
          {"</>"}
        </span>
        Motivation
      </p>
      <h2
        className="an up d1"
        style={{
          font: "700 40px/1.08 var(--fd)",
          letterSpacing: "-.03em",
          color: "var(--ink)",
          margin: "10px 0 0",
        }}
      >
        JavaScript fails{" "}
        <span
          style={{
            background: "linear-gradient(transparent 62%, var(--js-soft) 62%)",
            padding: "0 .12em",
          }}
        >
          at runtime
        </span>
      </h2>
      <div className="an bar d2" style={{ display: "flex", gap: 6, marginTop: 14 }}>
        <i
          className="idle-sheen"
          style={{
            height: 5,
            borderRadius: 3,
            width: 52,
            background: "linear-gradient(90deg,var(--ts),var(--vs),var(--ts))",
            display: "block",
          }}
        />
        <i
          style={{
            height: 5,
            borderRadius: 3,
            width: 18,
            background: "var(--js)",
            display: "block",
          }}
        />
      </div>
      <p
        className="an up d3"
        style={{
          font: "400 18px/1.5 var(--fb)",
          color: "var(--mut)",
          margin: "13px 0 0",
          maxWidth: 1000,
        }}
      >
        Most bugs aren’t clever — they’re typos, wrong shapes and wrong assumptions that show up in
        front of users.
      </p>

      <div
        className="stag"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 26,
          alignItems: "start",
          marginTop: 20,
        }}
      >
        <Code file="app.js" lang="js" size={15.5}>
          <Kw>{"function "}</Kw>
          <F>total</F>
          {"(cart) {\n  "}
          <Kw>{"return "}</Kw>
          {"cart."}
          <F>reduce</F>
          {"((s, i) => s + i."}
          <span className="squig" style={{ backgroundColor: "rgba(244,71,71,.14)" }}>
            <V>prise</V>
          </span>
          {", "}
          <N>0</N>
          {");\n}\n\n"}
          <F>total</F>
          {"([{ "}
          <V>price</V>
          {": "}
          <N>10</N>
          {" }]);\n"}
          <Cm>{"// → NaN   (no error, no warning)"}</Cm>
        </Code>
        <div className="stag sb" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              position: "relative",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "16px 18px",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: "var(--js)",
              }}
            />
            <h4 style={{ font: "600 17.5px var(--fd)", margin: "0 0 4px", color: "var(--ink)" }}>
              Silent failures
            </h4>
            <p style={{ font: "400 14px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>
              A typo like <code className="i">prise</code> gives{" "}
              <code className="i">undefined</code>, then <code className="i">NaN</code> — discovered
              late.
            </p>
          </div>
          <div
            style={{
              position: "relative",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "16px 18px",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: "var(--ts)",
              }}
            />
            <h4 style={{ font: "600 17.5px var(--fd)", margin: "0 0 4px", color: "var(--ink)" }}>
              Shift left
            </h4>
            <p style={{ font: "400 14px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>
              Linter, types and debugger move the discovery from production to your editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
