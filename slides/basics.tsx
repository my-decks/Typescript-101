/* 11 · What is TypeScript? — JavaScript, with a safety net */

const Kw = (p: any) => <span style={{ color: "var(--tk-k)" }}>{p.children}</span>;
const F = (p: any) => <span style={{ color: "var(--tk-d)" }}>{p.children}</span>;
const V = (p: any) => <span style={{ color: "var(--tk-f)" }}>{p.children}</span>;
const S = (p: any) => <span style={{ color: "var(--tk-str)" }}>{p.children}</span>;
const N = (p: any) => <span style={{ color: "var(--tk-n)" }}>{p.children}</span>;
const Cm = (p: any) => (
  <span style={{ color: "var(--tk-cm)", fontStyle: "italic" }}>{p.children}</span>
);
const Ty = (p: any) => <span style={{ color: "var(--tk-t)" }}>{p.children}</span>;

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

function Tag({ ts }: { ts?: boolean }) {
  return (
    <span
      style={{
        font: "700 12px var(--fm)",
        letterSpacing: ".18em",
        textTransform: "uppercase",
        color: ts ? "var(--ts-deep)" : "#8f7400",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <i
        className="idle-pulse"
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          background: ts ? "var(--ts)" : "var(--js)",
          display: "inline-block",
        }}
      />
      {ts ? "TypeScript" : "JavaScript"}
    </span>
  );
}

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
        TypeScript
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
        JavaScript, <span className="grad idle-text-sheen">with a safety net</span>
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
        A superset of JavaScript: valid JS is valid TS. Types are checked at build time, then
        erased.
      </p>

      <div
        className="stag"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginTop: 22 }}
      >
        <div>
          <Tag />
          <Code file="greet.js" lang="js" size={15} style={{ marginTop: 10 }}>
            <Kw>{"function "}</Kw>
            <F>greet</F>
            {"(name) {\n  "}
            <Kw>{"return "}</Kw>
            <S>{'"Hi "'}</S>
            {" + name."}
            <F>toUpperCase</F>
            {"();\n}\n"}
            <F>greet</F>
            {"("}
            <N>42</N>
            {");\n"}
            <Cm>{"// ������ TypeError at runtime"}</Cm>
          </Code>
        </div>
        <div>
          <Tag ts />
          <Code file="greet.ts" lang="ts" size={15} style={{ marginTop: 10 }}>
            <Kw>{"function "}</Kw>
            <F>greet</F>
            {"(name: "}
            <Ty>string</Ty>
            {") {\n  "}
            <Kw>{"return "}</Kw>
            <S>{'"Hi "'}</S>
            {" + name."}
            <F>toUpperCase</F>
            {"();\n}\n"}
            <F>greet</F>
            {"("}
            <span className="squig" style={{ backgroundColor: "rgba(244,71,71,.18)" }}>
              <N>42</N>
            </span>
            {");"}
          </Code>
          <div className="code" style={{ marginTop: 8, boxShadow: "none" }}>
            <div style={{ padding: "6px 14px 8px" }}>
              <span className="hint">
                ✖ Argument of type 'number' is not assignable to 'string'.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
