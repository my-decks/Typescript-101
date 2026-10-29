/* 05 · VS Code at a Glance — one editor, whole toolchain */

function Ic({ children, size = 24, style }: any) {
  return (
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
}

const CARDS: { y?: boolean; icon: any; h: string; p: any }[] = [
  {
    icon: (
      <Ic>
        <path d="M12 3l2.1 5.6L20 11l-5.9 2.4L12 19l-2.1-5.6L4 11l5.9-2.4z" />
      </Ic>
    ),
    h: "IntelliSense",
    p: (
      <>
        Completions, signatures and hover docs powered by the TypeScript language service — for JS
        too.
      </>
    ),
  },
  {
    y: true,
    icon: (
      <Ic>
        <circle cx="12" cy="13" r="5" />
        <path d="M12 8V6M8.5 9.5 6 7M15.5 9.5 18 7M7 13H4M20 13h-3M8.5 16.5 6 19M15.5 16.5 18 19" />
      </Ic>
    ),
    h: "Built-in debugger",
    p: <>Node.js and browser debugging out of the box with a JavaScript Debug Terminal.</>,
  },
  {
    icon: (
      <Ic>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
        <path d="M13 7h8M17 3v8M3 17h8M7 13v8" />
      </Ic>
    ),
    h: "Extensions",
    p: <>ESLint, Prettier and more live in the Marketplace — one click to install.</>,
  },
  {
    y: true,
    icon: (
      <Ic>
        <path d="m4 17 6-5-6-5M12 19h8" />
      </Ic>
    ),
    h: "Integrated terminal",
    p: (
      <>
        Run scripts, <code className="i">tsc --watch</code> and servers without leaving the window.
      </>
    ),
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
        VS Code
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
        One editor, whole toolchain
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
        Everything in this talk ships built in — no setup marathon.
      </p>

      <div
        className="stag"
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 22 }}
      >
        {CARDS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "16px 16px 14px",
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
            <h4 style={{ font: "600 17px var(--fd)", margin: "10px 0 5px", color: "var(--ink)" }}>
              {c.h}
            </h4>
            <p style={{ font: "400 13.5px/1.45 var(--fb)", color: "var(--mut)", margin: 0 }}>
              {c.p}
            </p>
          </div>
        ))}
      </div>

      <div
        className="an up d8"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}
      >
        <span className="chip">Ctrl + Shift + P · Command Palette</span>
        <span className="chip js">F12 · Go to Definition</span>
        <span className="chip">F2 · Rename Symbol</span>
      </div>
    </div>
  );
}
