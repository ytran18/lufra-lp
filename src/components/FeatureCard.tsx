"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

export type FeatureCardProps = {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  mockSide: "left" | "right";
  scrollYProgress: MotionValue<number>;
  totalCards: number;
};

/** Scroll phase width in `t` units (t = scrollYProgress × totalCards). */
const ENTER = 0.5;
const HOLD_END = 0.4;
const PUSH_SPAN = 1.0;
const PUSH_START = HOLD_END;
const PUSH_END = PUSH_START + PUSH_SPAN;

const ENTER_Y = 100;
const SCALE_MIN = 0.95;

function smoothstep01(x: number) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

/** Phase offset so card `i` enters while `t ∈ [i, i+0.5]` (after shifting by −0.5). */
function phaseLocal(t: number, index: number) {
  return t - index - 0.5;
}

/**
 * Depth-related phase: last card stays in “hold” at end of scroll (no fake push).
 */
function depthLocal(t: number, index: number, totalCards: number) {
  const raw = phaseLocal(t, index);
  if (index === totalCards - 1) {
    return Math.min(raw, HOLD_END);
  }
  return raw;
}

export default function FeatureCard({
  index,
  title,
  subtitle,
  description,
  mockSide,
  scrollYProgress,
  totalCards,
}: FeatureCardProps) {
  const t = useTransform(scrollYProgress, (p) => p * totalCards);

  const opacity = useTransform(t, (v) => {
    const local = phaseLocal(v, index);
    if (local < -ENTER) return 0;
    if (local < 0) {
      const u = (local + ENTER) / ENTER;
      return smoothstep01(u);
    }
    return 1;
  });

  const y = useTransform(t, (v) => {
    const local = phaseLocal(v, index);
    const isLast = index === totalCards - 1;

    if (local < -ENTER) return ENTER_Y;
    if (local < 0) {
      const u = (local + ENTER) / ENTER;
      const eased = smoothstep01(Math.max(0, Math.min(1, u)));
      return (1 - eased) * ENTER_Y;
    }
    if (local < HOLD_END) return 0;

    if (isLast) return 0;

    if (local < PUSH_END) {
      const u = (local - PUSH_START) / PUSH_SPAN;
      const eased = smoothstep01(Math.max(0, Math.min(1, u)));
      return -14 * eased;
    }

    const extra = Math.min(local - PUSH_END, 2.5);
    return -14 - 8 * smoothstep01(extra / 2.5);
  });

  const scale = useTransform(t, (v) => {
    const local = depthLocal(v, index, totalCards);
    if (local < PUSH_START) return 1;
    if (local < PUSH_END) {
      const u = (local - PUSH_START) / PUSH_SPAN;
      const eased = smoothstep01(Math.max(0, Math.min(1, u)));
      return 1 - (1 - SCALE_MIN) * eased;
    }
    const extra = Math.min(local - PUSH_END, 2.5);
    return SCALE_MIN - 0.04 * smoothstep01(extra / 2.5);
  });

  const depthShade = useTransform(t, (v) => {
    const local = depthLocal(v, index, totalCards);
    if (local < PUSH_START) return 0;
    if (local < PUSH_END) {
      const u = (local - PUSH_START) / PUSH_SPAN;
      return smoothstep01(Math.max(0, Math.min(1, u))) * 0.16;
    }
    const extra = Math.min(local - PUSH_END, 2.5);
    return 0.16 + 0.07 * smoothstep01(extra / 2.5);
  });

  const translateZ = useTransform(t, (v) => {
    const local = depthLocal(v, index, totalCards);
    if (local < PUSH_START) return 0;
    if (local < PUSH_END) {
      const u = (local - PUSH_START) / PUSH_SPAN;
      return -44 * smoothstep01(Math.max(0, Math.min(1, u)));
    }
    const extra = Math.min(local - PUSH_END, 2.5);
    return -44 - 28 * smoothstep01(extra / 2.5);
  });

  const textBlock = (
    <div
      className={`flex flex-col justify-center gap-6 px-8 py-10 md:p-12 ${
        mockSide === "right" ? "md:pr-8" : "md:pl-8"
      }`}
    >
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[#86868b]">
        {subtitle}
      </p>
      <h3 className="font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-tighter text-[#1d1d1f]">
        {title}
      </h3>
      <p className="max-w-md text-[17px] leading-relaxed text-[#86868b]">
        {description}
      </p>
    </div>
  );

  const mock = (
    <div
      className={`flex min-h-[220px] items-center justify-center px-8 py-10 md:p-12 ${
        mockSide === "left" ? "md:pr-8" : "md:pl-8"
      }`}
    >
      <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] shadow-inner shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-sm font-medium tracking-tight text-[#86868b]/80">
            UI preview
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.article
      style={{
        opacity,
        y,
        scale,
        translateZ,
        transformStyle: "preserve-3d",
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 w-[min(92vw,56rem)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      <div className="pointer-events-auto relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-1.5 shadow-2xl shadow-black/5 ring-1 ring-black/[0.03]">
        <motion.div
          aria-hidden
          style={{ opacity: depthShade }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] bg-[#1d1d1f]"
        />
        <div className="relative z-0 grid min-h-[320px] grid-cols-1 overflow-hidden rounded-[calc(2.5rem-0.375rem)] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] md:min-h-[380px] md:grid-cols-2">
          {mockSide === "left" ? (
            <>
              {mock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {mock}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}
