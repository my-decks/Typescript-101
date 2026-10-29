/* 10 · Format on Save — settings that do the boring work */

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
        Settings that do the boring work
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
        Linter finds problems, formatter ends style debates.
      </p>

      <div
        className="stag"
        style={{
          display: "grid",
          gridTemplateColumns: "1.12fr 1fr",
          gap: 26,
          alignItems: "start",
          marginTop: 20,
        }}
      >
        <Code file=".vscode/settings.json" lang="json" size={14.5}>
          <Kw>{"{"}</Kw>
          {"\n  "}
          <V>{'"editor.formatOnSave"'}</V>
          {": "}
          <N>{"true"}</N>
          {",\n  "}
          <V>{'"editor.defaultFormatter"'}</V>
          {": "}
          <S>{'"esbenp.prettier-vscode"'}</S>
          {",\n  "}
          <V>{'"editor.codeActionsOnSave"'}</V>
          {": "}
          <Kw>{"{"}</Kw>
          {"\n    "}
          <V>{'"source.fixAll.eslint"'}</V>
          {": "}
          <S>{'"explicit"'}</S>
          {"\n  "}
          <Kw>{"}"}</Kw>
          {",\n  "}
          <V>{'"typescript.preferences.importModuleSpecifier"'}</V>
          {": "}
          <S>{'"relative"'}</S>
          {"\n"}
          <Kw>{"}"}</Kw>
        </Code>
        <div className="stag sb" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Row
            icon={
              <Ic>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </Ic>
            }
            h="ESLint"
          >
            Finds bugs and risky patterns.
          </Row>
          <Row
            icon={
              <Ic>
                <path d="m3 21 10-10M15 4V2m0 12v-2m-5-3H8m12 0h-2m-1.2-4.8-1.4 1.4M18.8 9.8l-1.4-1.4" />
              </Ic>
            }
            h="Prettier"
          >
            Formats code consistently — no debates.
          </Row>
          <Row
            icon={
              <Ic>
                <path d="M6 3v12" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M18 9a9 9 0 0 1-9 9" />
              </Ic>
            }
            h="Commit settings"
          >
            Share <code className="i">.vscode/</code> so the whole team matches.
          </Row>
        </div>
      </div>
    </div>
  );
}
