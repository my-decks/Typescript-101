/* 08 · Debugging TypeScript — source maps flow */

const Ic = ({ children, size = 24, style }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden
  >
    {children}
  </svg>
);

function Step({ no, icon, h, p, y }: any) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid var(--line)",
        borderTop: `4px solid ${y ? "var(--js)" : "var(--ts)"}`,
        borderRadius: 12,
        padding: "15px 16px",
        background: "var(--card)",
        boxShadow: "var(--shadow)",
        position: "relative",
        minWidth: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 13,
          font: "600 11px var(--fm)",
          color: "var(--faint)",
        }}
      >
        {no}
      </span>
      <span className="idle-float" style={{ color: y ? "#B58F00" : "var(--ts)", display: "block" }}>
        {icon}
      </span>
      <h4 style={{ font: "600 16.5px var(--fd)", color: "var(--ink)", margin: "9px 0 4px" }}>
        {h}
      </h4>
      <p style={{ font: "400 13px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>{p}</p>
    </div>
  );
}

const Sep = () => (
  <div
    style={{
      flex: "none",
      width: 30,
      display: "grid",
      placeItems: "center",
      color: "var(--faint)",
    }}
  >
    <Ic size={19}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Ic>
  </div>
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
        Source maps: debug the{" "}
        <span
          style={{
            background: "linear-gradient(transparent 62%, var(--js-soft) 62%)",
            padding: "0 .12em",
          }}
        >
          .ts
        </span>
        , not the .js
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
        The browser and Node run JavaScript — maps connect it back to what you wrote.
      </p>

      <div className="stag" style={{ display: "flex", alignItems: "stretch", marginTop: 24 }}>
        <Step
          no="01"
          y={false}
          icon={
            <Ic>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </Ic>
          }
          h="index.ts"
          p="The code you write and set breakpoints in."
        />
        <Sep />
        <Step
          no="02"
          y
          icon={
            <Ic>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
            </Ic>
          }
          h="tsc"
          p={
            <>
              Compiles to JS and emits <code className="i">.js.map</code>.
            </>
          }
        />
        <Sep />
        <Step
          no="03"
          icon={
            <Ic>
              <path d="M6 4l14 8-14 8z" />
            </Ic>
          }
          h="Node / Browser"
          p="Runs the plain JavaScript output."
        />
        <Sep />
        <Step
          no="04"
          icon={
            <Ic>
              <circle cx="12" cy="13" r="5" />
              <path d="M12 8V6M8.5 9.5 6 7M15.5 9.5 18 7M7 13H4M20 13h-3M8.5 16.5 6 19M15.5 16.5 18 19" />
            </Ic>
          }
          h="VS Code"
          p="Maps the paused line back to your .ts."
        />
      </div>

      <div
        className="an up d9"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 22,
          font: "500 15px var(--fm)",
          color: "var(--mut)",
        }}
      >
        <span className="idle-pulse" style={{ color: "var(--ok)", display: "inline-flex" }}>
          <Ic size={19}>
            <path d="m4 12.5 5 5L20 6.5" />
          </Ic>
        </span>
        <span>
          Needs <code className="i">"sourceMap": true</code> in tsconfig.json
        </span>
      </div>
    </div>
  );
}
