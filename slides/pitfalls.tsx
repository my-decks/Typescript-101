/* 18 · Common Pitfalls — when it doesn't work */

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
        Troubleshooting
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
        When it doesn’t work
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

      <div className="an up d3" style={{ marginTop: 26 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Symptom</th>
              <th style={{ width: "30%" }}>Likely cause</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Breakpoint is grey / unbound</td>
              <td style={{ color: "var(--mut)" }}>No source maps</td>
              <td>
                Set <code className="i">sourceMap</code> + <code className="i">outFiles</code>
              </td>
            </tr>
            <tr>
              <td>ESLint does nothing</td>
              <td style={{ color: "var(--mut)" }}>Wrong config or server</td>
              <td>
                Run <b>ESLint: Restart Server</b>
              </td>
            </tr>
            <tr>
              <td>Types look stale</td>
              <td style={{ color: "var(--mut)" }}>Old TS version</td>
              <td>
                <b>TypeScript: Select Version → Workspace</b>
              </td>
            </tr>
            <tr>
              <td>
                Everything is <code className="i">any</code>
              </td>
              <td style={{ color: "var(--mut)" }}>Strict off or implicit any</td>
              <td>
                Enable <code className="i">strict</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className="an up d7"
        style={{
          marginTop: 22,
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
            background: "var(--js)",
            display: "inline-block",
          }}
        />
        screenshot these four — they fix 90% of live-demo accidents
      </div>
    </div>
  );
}
