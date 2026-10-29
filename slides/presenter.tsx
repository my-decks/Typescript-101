/* 02 · Presenter */
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

export default function Slide() {
  return (
    <Frame kick="Your Host" title="Hello, I’m…">
      <div
        className="stag"
        style={{ display: "flex", alignItems: "center", gap: 34, marginTop: 26 }}
      >
        <div
          className="idle-ring"
          style={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            flex: "none",
            background: "linear-gradient(135deg, var(--ts), var(--vs))",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            font: "700 34px var(--fd)",
            letterSpacing: "-.02em",
          }}
        >
          YN
        </div>
        <div>
          <h3
            style={{
              font: "700 30px var(--fd)",
              letterSpacing: "-.02em",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Your Name
          </h3>
          <p style={{ font: "400 17px/1.5 var(--fb)", color: "var(--mut)", margin: "6px 0 0" }}>
            <b style={{ color: "var(--ts-deep)" }}>Microsoft Learn Student Ambassador</b> · Faculty
            of Technology
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            <span className="chip">Web Development</span>
            <span className="chip js">Debugging</span>
            <span className="chip">Type Safety</span>
          </div>
        </div>
      </div>
      <p
        className="an up d8"
        style={{
          font: "400 15px/1.6 var(--fb)",
          color: "var(--mut)",
          margin: "26px 0 0",
          maxWidth: 760,
        }}
      >
        Swap this slide for your photo and bio — keep the three chips: they are exactly what the
        audience is about to learn.
      </p>
    </Frame>
  );
}
