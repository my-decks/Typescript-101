/* 03 · Agenda */
function Frame({ kick, title, children }: any) {
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
        {kick}
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
        {title}
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
        style={{ flex: 1, minHeight: 0, marginTop: 24, display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>
    </div>
  );
}

const ITEMS: [string, string, string][] = [
  ["01", "Why tooling?", "The cost of “it runs on my machine”"],
  ["02", "VS Code essentials", "Editor, terminal, extensions"],
  ["03", "Native debugging", "Breakpoints, launch.json, source maps"],
  ["04", "Linting", "ESLint + typescript-eslint, format on save"],
  ["05", "TypeScript 101", "Types, compile flow, strict mode"],
  ["06", "Type inference", "What TS figures out so you don’t have to"],
  ["07", "Live demo", "Break it, catch it, fix it"],
  ["08", "Recap & Q&A", "Takeaways and resources"],
];

export default function Slide() {
  return (
    <Frame kick="Today" title="What we’ll cover">
      <div
        className="stag poppy"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 22px", marginTop: 8 }}
      >
        {ITEMS.map(([n, h, p]) => (
          <div
            key={n}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr",
              gap: 14,
              alignItems: "center",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 12,
              padding: "13px 16px",
              boxShadow: "var(--shadow)",
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: Number(n) % 2 === 0 ? "var(--js)" : "var(--ts)",
                color: Number(n) % 2 === 0 ? "#1b1b1b" : "#fff",
                display: "grid",
                placeItems: "center",
                font: "700 15px var(--fm)",
              }}
            >
              {n}
            </span>
            <div>
              <h4 style={{ font: "600 17px var(--fd)", color: "var(--ink)", margin: 0 }}>{h}</h4>
              <p
                style={{ font: "400 13px/1.35 var(--fb)", color: "var(--mut)", margin: "2px 0 0" }}
              >
                {p}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
