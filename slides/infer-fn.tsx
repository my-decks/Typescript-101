/* 13 · Inference in Functions — return types, callbacks, generics */

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

function Row({ icon, h, children }: any) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        gap: 15,
        padding: "13px 16px",
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        boxShadow: "var(--shadow)",
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: 11,
          display: "grid",
          placeItems: "center",
          background: "var(--ts-soft)",
          color: "var(--ts)",
        }}
      >
        {icon}
      </span>
      <div>
        <h4 style={{ font: "600 16.5px var(--fd)", color: "var(--ink)", margin: 0 }}>{h}</h4>
        <p style={{ font: "400 13.5px/1.45 var(--fb)", color: "var(--mut)", margin: "3px 0 0" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

const Ic = ({ children }: any) => (
  <svg
    width={22}
    height={22}
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
        Inference
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
        Return types, callbacks, generics
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

      <div
        className="stag"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 26,
          alignItems: "start",
          marginTop: 22,
        }}
      >
        <Code file="infer-fn.ts" size={15}>
          <Kw>{"function "}</Kw>
          <F>double</F>
          {"(n: "}
          <Ty>number</Ty>
          {") {\n  "}
          <Kw>{"return "}</Kw>
          {"n * "}
          <N>2</N>
          {";\n}\n"}
          <Cm>{"// returns number — inferred"}</Cm>
          {"\n\n"}
          {"[1, 2, 3]."}
          <F>map</F>
          {"(x => x."}
          <F>toFixed</F>
          {"(1));\n"}
          <Cm>{"// x: number — contextual typing"}</Cm>
          {"\n\n"}
          <Kw>{"function "}</Kw>
          <F>first</F>
          <Kw>{'<"'}</Kw>
          <Ty>T</Ty>
          <Kw>{">"}</Kw>
          {"(xs: "}
          <Ty>T</Ty>
          {"[]) { "}
          <Kw>{"return "}</Kw>
          {"xs[0]; }\n"}
          <Kw>{"const "}</Kw>
          <V>a</V>
          {" = "}
          <F>first</F>
          {"(["}
          <S>{'"x"'}</S>
          {", "}
          <S>{'"y"'}</S>
          {"]);\n"}
          <Cm>{"// a: string — T inferred"}</Cm>
        </Code>
        <div className="stag sb" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Row
            icon={
              <Ic>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Ic>
            }
            h="Return type"
          >
            Worked out from the return statements.
          </Row>
          <Row
            icon={
              <Ic>
                <path d="m17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3" />
              </Ic>
            }
            h="Contextual typing"
          >
            Callback params get types from where they’re used.
          </Row>
          <Row
            icon={
              <Ic>
                <rect x="3" y="3" width="8" height="8" rx="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" />
                <path d="M13 7h8M17 3v8M3 17h8M7 13v8" />
              </Ic>
            }
            h="Generics"
          >
            <code className="i">T</code> is filled in from the arguments you pass.
          </Row>
        </div>
      </div>
    </div>
  );
}
