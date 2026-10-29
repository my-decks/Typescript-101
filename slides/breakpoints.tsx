/* 07 · Breakpoint Toolkit — breakpoints that think */

const ROWS: [string, any, string][] = [
  [
    "Breakpoint",
    <>
      Click the gutter · <code className="i">F9</code>
    </>,
    "You want to stop on a line",
  ],
  [
    "Conditional",
    <>
      Right-click → <code className="i">Expression</code>
    </>,
    <>
      Only stop when e.g. <code className="i">item.qty &lt; 0</code>
    </>,
  ],
  [
    "Logpoint",
    <>
      Right-click → <code className="i">Log Message</code>
    </>,
    "Print values without editing code",
  ],
  [
    "Hit count",
    <>
      Right-click → <code className="i">Hit Count</code>
    </>,
    "Stop on the 100th loop iteration",
  ],
  [
    "Exception",
    <>
      Breakpoints panel → <code className="i">Uncaught</code>
    </>,
    "Find where an error is thrown",
  ],
];

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
        Debugging
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
        Breakpoints that think
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

      <div className="an up d3" style={{ marginTop: 24 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>Type</th>
              <th style={{ width: "42%" }}>How</th>
              <th>Use it when…</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([a, b, c], i) => (
              <tr key={i}>
                <td>
                  <span className="bp idle-pulse" style={{ width: 9, height: 9 }} />
                  {a}
                </td>
                <td>{b}</td>
                <td style={{ color: "var(--mut)" }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="an up d8"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}
      >
        <span className="chip">F10 Step over</span>
        <span className="chip">F11 Step into</span>
        <span className="chip js">Shift+F11 Step out</span>
        <span className="chip">F5 Continue</span>
      </div>
    </div>
  );
}
