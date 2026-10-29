/* 16 · The Daily Loop — putting it together */

const Ic = ({ children, size = 24 }: any) => (
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
    <span className="idle-nudge" style={{ display: "inline-flex" }}>
      <Ic size={19}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </Ic>
    </span>
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
        Workflow
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
        Putting it together
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

      <div className="stag" style={{ display: "flex", alignItems: "stretch", marginTop: 40 }}>
        <Step
          no="01"
          icon={
            <Ic>
              <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
            </Ic>
          }
          h="Write"
          p="IntelliSense + inference guide you."
        />
        <Sep />
        <Step
          no="02"
          y
          icon={
            <Ic>
              <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z" />
            </Ic>
          }
          h="Lint"
          p="ESLint + Prettier run on save."
        />
        <Sep />
        <Step
          no="03"
          icon={
            <Ic>
              <path d="m4 12.5 5 5L20 6.5" />
            </Ic>
          }
          h="Type-check"
          p={
            <>
              <code className="i">tsc --noEmit</code> in CI and locally.
            </>
          }
        />
        <Sep />
        <Step
          no="04"
          y
          icon={
            <Ic>
              <circle cx="12" cy="13" r="5" />
              <path d="M12 8V6M8.5 9.5 6 7M15.5 9.5 18 7M7 13H4M20 13h-3M8.5 16.5 6 19M15.5 16.5 18 19" />
            </Ic>
          }
          h="Debug"
          p="F5 with source maps for the hard ones."
        />
      </div>

      <div
        className="an up d8"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 26,
          font: "500 15px var(--fm)",
          color: "var(--mut)",
          justifyContent: "center",
        }}
      >
        <span className="idle-spin" style={{ color: "var(--ts)", display: "inline-flex" }}>
          <Ic size={19}>
            <path d="m17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3" />
          </Ic>
        </span>
        Fast feedback beats late discovery.
      </div>
    </div>
  );
}
