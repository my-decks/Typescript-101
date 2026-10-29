/* 21 · End — Questions? */

export default function Slide() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <span className="glyph idle-drift" style={{ top: 100, left: 110, fontSize: 40 }}>
        {"?. "}
      </span>
      <span
        className="glyph t idle-drift"
        style={{ top: 160, right: 130, fontSize: 36, animationDelay: "-2.5s" }}
      >
        {"=> "}
      </span>
      <span
        className="glyph w idle-drift"
        style={{ bottom: 140, left: 160, fontSize: 34, animationDelay: "-4s" }}
      >
        {"<T> "}
      </span>
      <span
        className="glyph idle-drift"
        style={{ bottom: 180, right: 110, fontSize: 42, animationDelay: "-1.5s" }}
      >
        {"{ }"}
      </span>

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
        Closing
      </p>
      <h1
        className="an pop d1"
        style={{
          font: "800 92px/1.05 var(--fd)",
          letterSpacing: "-.045em",
          margin: "20px 0 0",
          color: "var(--ink)",
        }}
      >
        <span className="grad idle-text-sheen">Questions?</span>
      </h1>
      <p
        className="an up d4"
        style={{
          font: "400 20px/1.5 var(--fb)",
          color: "var(--mut)",
          margin: "18px 0 0",
          maxWidth: 560,
        }}
      >
        Thank you — now go enable <code className="i">strict</code> and press <kbd>F5</kbd>.
      </p>
      <div className="an up d6" style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <span className="chip js">JavaScript / TS</span>
        <span className="chip">VS Code &amp; TS</span>
      </div>
    </div>
  );
}
