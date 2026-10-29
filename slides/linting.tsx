/* 09 · Linting with ESLint — catch mistakes while you type */

const Kw = (p: any) => <span style={{ color: "var(--tk-p)" }}>{p.children}</span>;
const V = (p: any) => <span style={{ color: "var(--tk-f)" }}>{p.children}</span>;
const S = (p: any) => <span style={{ color: "var(--tk-str)" }}>{p.children}</span>;
const Ty = (p: any) => <span style={{ color: "var(--tk-t)" }}>{p.children}</span>;
const F = (p: any) => <span style={{ color: "var(--tk-d)" }}>{p.children}</span>;

function Code({ file, lang, size = 15, style, children, extra }: any) {
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
        {extra}
      </pre>
    </div>
  );
}

const Ic = ({ children, size = 22 }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

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
        Linting
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
        Catch mistakes{" "}
        <span
          style={{
            background: "linear-gradient(transparent 62%, var(--js-soft) 62%)",
            padding: "0 .12em",
          }}
        >
          while you type
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
        ESLint finds suspicious patterns; typescript-eslint adds type-aware rules.
      </p>

      <div
        className="stag"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
          marginTop: 18,
        }}
      >
        <Code file="eslint.config.js" lang="js" size={13.5}>
          <Kw>{"import "}</Kw>
          <V>js</V>
          <Kw>{" from "}</Kw>
          <S>{'"@eslint/js"'}</S>
          <Kw>{";\nimport "}</Kw>
          <V>tseslint</V>
          <Kw>{" from "}</Kw>
          <S>{'"typescript-eslint"'}</S>
          <Kw>{";\n\nexport default "}</Kw>
          <V>tseslint</V>
          <Kw>{"."}</Kw>
          <F>config</F>
          <Kw>{"(\n  "}</Kw>
          <V>js</V>
          <Kw>{"."}</Kw>
          <V>configs</V>
          <Kw>{"."}</Kw>
          <V>recommended</V>
          <Kw>{",\n  ..."}</Kw>
          <V>tseslint</V>
          <Kw>{"."}</Kw>
          <V>configs</V>
          <Kw>{"."}</Kw>
          <V>recommended</V>
          <Kw>{",\n  {\n    "}</Kw>
          <V>rules</V>
          <Kw>{": {\n      "}</Kw>
          <S>{'"no-console"'}</S>
          <Kw>{": "}</Kw>
          <S>{'"warn"'}</S>
          <Kw>{",\n      "}</Kw>
          <S>{'"@typescript-eslint/no-explicit-any"'}</S>
          <Kw>{": "}</Kw>
          <S>{'"error"'}</S>
          <Kw>{",\n    },\n  }\n);"}</Kw>
        </Code>

        <div className="stag sb" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Code file="src/cart.ts" lang="ts" size={14}>
            <Kw>{"const "}</Kw>
            <V>data</V>
            {": "}
            <span className="squig w" style={{ backgroundColor: "rgba(204,167,0,.18)" }}>
              <Ty>any</Ty>
            </span>
            {" = "}
            <F>load</F>
            {"();\n"}
            <span style={{ color: "#CCA700" }}>
              <V>console</V>.<F>log</F>
            </span>
            {"(data);"}
          </Code>
          <div className="code" style={{ boxShadow: "none" }}>
            <div style={{ padding: "8px 14px 10px" }}>
              <span className="hint">⚠ Unexpected any. Specify a different type.</span>
              <span className="hint">⚠ Unexpected console statement.</span>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "14px 16px",
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
            <h4 style={{ font: "600 16px var(--fd)", margin: "0 0 3px", color: "var(--ink)" }}>
              Quick Fix
            </h4>
            <p style={{ font: "400 13px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>
              <code className="i">Ctrl + .</code> applies the fix. Set{" "}
              <code className="i">editor.codeActionsOnSave</code> to fix on save.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
