"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    id: "pip",
    tag: "Picture in Picture",
    title: "Pin any window.\nStay in flow.",
    description:
      "Float any app above everything else. Resize freely, reposition effortlessly — your focus stays unbroken no matter what else is on screen.",
    reverse: false,
    mockup: <PipMockup />,
  },
  {
    id: "ghost",
    tag: "Ghost Mode",
    title: "See it.\nNever feel it.",
    description:
      "Clicks pass right through. The window stays visible as a reference while you work — perfectly transparent, perfectly out of the way.",
    reverse: true,
    mockup: <GhostMockup />,
  },
  {
    id: "crop",
    tag: "Crop Frame",
    title: "Trim the noise.\nKeep what counts.",
    description:
      "Isolate exactly the region you need — a dashboard widget, a lecture slide, a live score — and hide everything else from view.",
    reverse: false,
    mockup: <CropMockup />,
  },
  {
    id: "multi",
    tag: "Multi PiP",
    title: "Command center.\nUp to three.",
    description:
      "Run multiple floating windows simultaneously, arranged exactly how your workflow demands. Reference, monitor, and create — all at once.",
    reverse: true,
    mockup: <MultiMockup />,
  },
] as const;

// ─── Animation variants ───────────────────────────────────────────────────────

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const visualVariants = {
  enter: { opacity: 0, y: 40, scale: 0.97 },
  active: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease },
  },
  exit: {
    opacity: 0,
    y: -28,
    scale: 1.01,
    transition: { duration: 0.6, ease },
  },
};

const textVariants = {
  enter: { opacity: 0, y: 30 },
  active: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.6, ease, delay: 0.05 },
  },
};

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Usage: Place <Features /> on your page.
 *
 * The section is (n+1) × 100vh tall — it scrolls the user through each
 * feature while the viewport is "locked" via a sticky container.
 * Progress dots and a counter are shown on the right edge.
 *
 * Dependencies: framer-motion, lucide-react
 */
export default function Features() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapRef.current) return;
      const { top, height } = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = height - vh;
      const scrolled = -top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      const idx = Math.min(features.length - 1, Math.floor(progress * features.length));
      setActive(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const feature = features[active];

  return (
    <div
      ref={wrapRef}
      style={{ height: `${(features.length + 1) * 100}vh`, position: "relative" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#fbfbfd] flex items-center">

        {/* Counter */}

        {/* Animated slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id}
            initial="enter"
            animate="active"
            exit="exit"
            className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-6 sm:px-10 md:px-20 gap-8 md:gap-0"
          >
            {/* Visual */}
            <motion.div
              variants={visualVariants}
              className={`p-0 md:p-5 w-full max-w-[450px] md:max-w-none mx-auto order-1 ${
                feature.reverse ? "md:order-2" : "md:order-1"
              }`}
            >
              <MockupShell>{feature.mockup}</MockupShell>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={textVariants}
              className={`flex flex-col justify-center order-2 ${
                feature.reverse
                  ? "md:order-1 md:pr-16 md:pl-5"
                  : "md:order-2 md:pl-16 md:pr-5"
              }`}
            >
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#6e6e73] block mb-3 md:mb-[14px]">
                {feature.tag}
              </span>

              <h2 className="text-[clamp(32px,8vw,52px)] md:text-[clamp(32px,4.5vw,52px)] leading-[1.08] font-semibold tracking-[-0.025em] text-[#1d1d1f] mb-4 md:mb-5 whitespace-pre-line">
                {feature.title}
              </h2>

              <p className="text-[15px] md:text-[17px] leading-[1.65] text-[#6e6e73] max-w-full md:max-w-[360px]">
                {feature.description}
              </p>

              <a
                href="#"
                className="inline-flex items-center gap-[5px] mt-6 md:mt-7 text-[15px] font-medium text-[#0066cc] no-underline"
              >
                Learn more <ArrowRight size={13} />
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mockup shell ─────────────────────────────────────────────────────────────

function MockupShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 9,
        boxShadow:
          "0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.07), 0 24px 52px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          borderRadius: 17,
          aspectRatio: "16/10",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Bar({ w }: { w: string }) {
  return (
    <div
      style={{
        height: 7,
        width: w,
        borderRadius: 4,
        background: "rgba(0,0,0,0.09)",
        marginBottom: 7,
      }}
    />
  );
}

function Window({
  style,
  children,
  dots = true,
}: {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  dots?: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.88)",
        borderRadius: 13,
        padding: 13,
        boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
        border: "0.5px solid rgba(0,0,0,0.07)",
        ...style,
      }}
    >
      {dots && (
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{ width: 8, height: 8, borderRadius: "50%", background: c }}
            />
          ))}
        </div>
      )}
      {children ?? (
        <>
          <Bar w="80%" />
          <Bar w="60%" />
          <Bar w="40%" />
        </>
      )}
    </div>
  );
}

// ─── Mockups ──────────────────────────────────────────────────────────────────

function PipMockup() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg,#e8e8ed,#f2f2f5)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Window style={{ width: "66%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          right: "9%",
          bottom: "10%",
          width: "33%",
          background: "rgba(255,255,255,0.9)",
          borderRadius: 10,
          padding: 8,
          boxShadow: "0 4px 18px rgba(0,0,0,0.13)",
          border: "0.5px solid rgba(0,0,0,0.07)",
        }}
      >
        <div
          style={{
            height: 42,
            background: "rgba(100,100,200,0.1)",
            borderRadius: 6,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(100,100,200,0.55)"
            strokeWidth="1.5"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <rect
              x="12"
              y="10"
              width="9"
              height="6"
              rx="1"
              fill="rgba(100,100,200,0.12)"
            />
          </svg>
        </div>
        <Bar w="70%" />
        <Bar w="50%" />
      </div>
    </div>
  );
}

function GhostMockup() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg,#eaecf2,#f2f4f8)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Window style={{ width: "66%", opacity: 0.45 }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: "12%",
          background: "rgba(255,255,255,0.28)",
          borderRadius: 13,
          border: "1.5px dashed rgba(0,102,204,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(0,102,204,0.45)",
          }}
        >
          Click-through
        </span>
      </div>
    </div>
  );
}

function CropMockup() {
  const corners = [
    { top: -1, left: -1, borderWidth: "2px 0 0 2px" },
    { top: -1, right: -1, borderWidth: "2px 2px 0 0" },
    { bottom: -1, left: -1, borderWidth: "0 0 2px 2px" },
    { bottom: -1, right: -1, borderWidth: "0 2px 2px 0" },
  ] as const;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg,#eeece8,#f5f3f0)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Window dots={false} style={{ width: "68%", opacity: 0.25 }}>
          <Bar w="80%" />
          <Bar w="60%" />
          <Bar w="40%" />
          <Bar w="75%" />
        </Window>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "52%",
            height: "52%",
            border: "1.5px solid rgba(0,102,204,0.7)",
            borderRadius: 4,
            position: "relative",
          }}
        >
          {corners.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                borderColor: "#0066cc",
                borderStyle: "solid",
                ...s,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MultiMockup() {
  const panes = [
    ["70%", "50%", "35%"],
    ["55%", "70%", "40%"],
    ["65%", "30%", "70%"],
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg,#e6eeea,#f0f6f3)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "12%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 6,
        }}
      >
        {panes.map((bars, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.78)",
              borderRadius: 8,
              border: "0.5px solid rgba(0,0,0,0.07)",
              padding: 8,
            }}
          >
            {bars.map((w, j) => (
              <Bar key={j} w={w} />
            ))}
          </div>
        ))}
        <div
          style={{
            background: "rgba(255,255,255,0.4)",
            borderRadius: 8,
            border: "1px dashed rgba(0,102,204,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="rgba(0,102,204,0.38)"
            strokeWidth="1.5"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
        </div>
      </div>
    </div>
  );
}