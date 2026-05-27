import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { MilestoneLevel } from "../lib/answer-reward";

const MILESTONE_LABELS: Record<NonNullable<MilestoneLevel>, string> = {
  3:  "🔥 3 på rad!",
  5:  "⚡ 5 på rad!",
  7:  "🌟 7 på rad!",
  10: "🏆 10 PÅ RAD!",
};

type StreakBurstProps = {
  milestone: MilestoneLevel;
};

export function StreakBurst({ milestone }: StreakBurstProps) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!milestone) return;
    setKey((k) => k + 1);
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1600);
    return () => window.clearTimeout(t);
  }, [milestone]);

  if (typeof document === "undefined" || !milestone) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.2, y: -30 }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          style={{
            position: "fixed",
            top: "38%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            pointerEvents: "none",
            fontFamily: "var(--font-nav)",
            fontWeight: 800,
            fontSize: milestone === 10 ? "2rem" : "1.5rem",
            color: milestone === 10 ? "oklch(72% 0.22 55)" : "oklch(60% 0.22 145)",
            textShadow: "0 2px 16px oklch(0% 0 0 / 0.25)",
            whiteSpace: "nowrap",
            letterSpacing: "-0.01em",
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {MILESTONE_LABELS[milestone]}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
