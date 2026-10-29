/* 19 · Recap — key takeaways */

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

const CARDS: { y?: boolean; icon: any; h: string; p: string }[] = [
  {
    icon: (
      <Ic>
        <circle cx="12" cy="13" r="5" />
        <path d="M12 8V6M8.5 9.5 6 7M15.5 9.5 18 7M7 13H4M20 13h-3M8.5 16.5 6 19M15.5 16.5 18 19" />
      </Ic>
    ),
    h: "Debug natively",
    p: "F5, breakpoints, logpoints, source maps.",
  },
  {
    y: true,
    icon: (
      <Ic>
        <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z" />
      </Ic>
    ),
    h: "Lint continuously",
    p: "ESLint + Prettier on save.",
  },
  {
    icon: (
      <Ic>
        <path d="M12 3l2.1 5.6L20 11l-5.9 2.4L12 19l-2.1-5.6L4 11l5.9-2.4z" />
      </Ic>
    ),
    h: "Trust inference",
    p: "Annotate boundaries, infer the rest.",
  },
  {
    y: true,
    icon: (
      <Ic>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </Ic>
    ),
    h: "Enable strict",
    p: "Reliable types start with one flag.",
  },
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
        Recap
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
        Key takeaways
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
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 26 }}
      >
        {CARDS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "16px 16px",
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
                background: c.y ? "var(--js)" : "var(--ts)",
              }}
            />
            <span
              className="idle-float"
              style={{
                color: c.y ? "#B58F00" : "var(--ts)",
                display: "block",
                animationDelay: `${i * -0.9}s`,
              }}
            >
              <Ic size={25}>{c.icon.props.children}</Ic>
            </span>
            <h4 style={{ font: "600 17px var(--fd)", color: "var(--ink)", margin: "10px 0 5px" }}>
              {c.h}
            </h4>
            <p style={{ font: "400 13.5px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>
              {c.p}
            </p>
          </div>
        ))}
      </div>

      <p
        className="an up d8"
        style={{
          font: "600 23px/1.4 var(--fd)",
          color: "var(--ts-deep)",
          textAlign: "center",
          margin: "30px auto 0",
          maxWidth: 760,
        }}
      >
        “Let the tools find the bug before your users do.”
      </p>
    </div>
  );
}
