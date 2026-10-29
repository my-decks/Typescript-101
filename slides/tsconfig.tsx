/* 15 · tsconfig & Strict Mode — turn on strict from day one */

const Kw = (p: any) => <span style={{ color: "var(--tk-p)" }}>{p.children}</span>;
const V = (p: any) => <span style={{ color: "var(--tk-f)" }}>{p.children}</span>;
const S = (p: any) => <span style={{ color: "var(--tk-str)" }}>{p.children}</span>;
const N = (p: any) => <span style={{ color: "var(--tk-n)" }}>{p.children}</span>;

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
      <pre style={{ fontSize: size, padding: "12px 16px" }}>
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
        Setup
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
        Turn on <code className="i">strict</code> from day one
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
        One flag enables the checks that make inference trustworthy.
      </p>

      <div
        className="stag"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 26,
          alignItems: "start",
          marginTop: 18,
        }}
      >
        <Code file="tsconfig.json" lang="json" size={14}>
          <Kw>{"{"}</Kw>
          {"\n  "}
          <V>{'"compilerOptions"'}</V>
          {": "}
          <Kw>{"{"}</Kw>
          {"\n    "}
          <V>{'"target"'}</V>
          {": "}
          <S>{'"ES2022"'}</S>
          {",\n    "}
          <V>{'"module"'}</V>
          {": "}
          <S>{'"ESNext"'}</S>
          {",\n    "}
          <V>{'"moduleResolution"'}</V>
          {": "}
          <S>{'"Bundler"'}</S>
          {",\n    "}
          <V>{'"strict"'}</V>
          {": "}
          <N>{"true"}</N>
          {",\n    "}
          <V>{'"sourceMap"'}</V>
          {": "}
          <N>{"true"}</N>
          {",\n    "}
          <V>{'"outDir"'}</V>
          {": "}
          <S>{'"dist"'}</S>
          {",\n    "}
          <V>{'"skipLibCheck"'}</V>
          {": "}
          <N>{"true"}</N>
          {"\n  "}
          <Kw>{"}"}</Kw>
          {",\n  "}
          <V>{'"include"'}</V>
          {": ["}
          <S>{'"src"'}</S>
          {"]\n"}
          <Kw>{"}"}</Kw>
        </Code>
        <div className="an up d5">
          <table className="tbl">
            <thead>
              <tr>
                <th>Under strict</th>
                <th>Catches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code className="i">strictNullChecks</code>
                </td>
                <td style={{ color: "var(--mut)" }}>undefined / null misuse</td>
              </tr>
              <tr>
                <td>
                  <code className="i">noImplicitAny</code>
                </td>
                <td style={{ color: "var(--mut)" }}>Untyped parameters</td>
              </tr>
              <tr>
                <td>
                  <code className="i">strictFunctionTypes</code>
                </td>
                <td style={{ color: "var(--mut)" }}>Unsafe callback types</td>
              </tr>
              <tr>
                <td>
                  <code className="i">alwaysStrict</code>
                </td>
                <td style={{ color: "var(--mut)" }}>Emits “use strict”</td>
              </tr>
            </tbody>
          </table>
          <div
            className="an up d9"
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 9,
              font: "500 13.5px var(--fm)",
              color: "var(--mut)",
            }}
          >
            <span
              className="idle-pulse"
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "var(--ok)",
                display: "inline-block",
              }}
            />
            strict ships on by default in create-* scaffolds today
          </div>
        </div>
      </div>
    </div>
  );
}
