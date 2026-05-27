import { useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

/** Expo-out: confident deceleration (no bounce). */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/** Primary UI spring — snappy, zero overshoot. */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.72,
};

/** Softer spring for score bars, hero, summaries. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 30,
  mass: 0.88,
};

/** Gentle spring for large panels and overlays. */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 28,
  mass: 0.95,
};

/** Shared layout reorder spring. */
export const springLayout: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 36,
  mass: 0.85,
};

export const tweenFast: Transition = {
  duration: 0.18,
  ease: easeOutExpo,
};

export const tweenMedium: Transition = {
  duration: 0.28,
  ease: easeOutExpo,
};

/** @deprecated Use springSnap */
export const springSnappy = springSnap;

export const easeOut: Transition = tweenMedium;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springSnap,
  },
};

/** Forward: enter from right, exit to left. */
export const fadeSlideForward: Variants = {
  hidden: { opacity: 0, x: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: springSnap,
  },
  exit: {
    opacity: 0,
    x: -14,
    filter: "blur(4px)",
    transition: tweenFast,
  },
};

/** Back: enter from left, exit to right. */
export const fadeSlideBack: Variants = {
  hidden: { opacity: 0, x: -22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: springSnap,
  },
  exit: {
    opacity: 0,
    x: 14,
    filter: "blur(4px)",
    transition: tweenFast,
  },
};

/** @deprecated Use fadeSlideForward or panelSlide with custom direction */
export const fadeSlide = fadeSlideForward;

export type SlideDirection = 1 | -1;

/** Use with AnimatePresence `custom` — 1 = next, -1 = back */
export const panelSlide: Variants = {
  hidden: (direction: SlideDirection) => ({
    opacity: 0,
    x: direction < 0 ? -22 : 22,
    filter: "blur(6px)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: springSnap,
  },
  exit: (direction: SlideDirection) => ({
    opacity: 0,
    x: direction < 0 ? 14 : -14,
    filter: "blur(4px)",
    transition: tweenFast,
  }),
};

const panelSlideReduced: Variants = {
  hidden: { opacity: 1, x: 0, filter: "blur(0px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export function usePanelSlideVariants(): Variants {
  const reduce = useReducedMotion();
  return reduce ? panelSlideReduced : panelSlide;
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: springSnap,
  },
};

export const overlayBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: tweenMedium },
  exit: { opacity: 0, transition: tweenFast },
};

export const overlayPanel: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.965, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: springGentle,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    filter: "blur(4px)",
    transition: tweenFast,
  },
};

/** Anchored popover (toolbar menus) — short travel, no blur. */
export const popoverPanel: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnap,
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.98,
    transition: tweenFast,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnap,
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.03,
    },
  },
};

export const feedbackPop: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnap,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: tweenFast,
  },
};

export const numberTick: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.82 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnap,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.88,
    transition: tweenFast,
  },
};

export function answerRevealMotion(
  state: "neutral" | "correct" | "wrong",
): Record<string, string | number | number[] | string[]> {
  if (state === "correct") {
    return {
      scale: [1, 1.028, 1],
      boxShadow: [
        "0 0 0 0 oklch(52% 0.16 145 / 0)",
        "0 0 0 5px oklch(52% 0.16 145 / 0.2)",
        "0 0 0 0 oklch(52% 0.16 145 / 0)",
      ],
    };
  }
  if (state === "wrong") {
    return {
      scale: [1, 0.992, 1],
      boxShadow: "0 0 0 2px oklch(52% 0.18 25 / 0.28)",
    };
  }
  return { scale: 1, boxShadow: "0 0 0 0 transparent" };
}

export function useMotionTransition(fallback: Transition = tweenMedium): Transition {
  const reduce = useReducedMotion();
  return reduce ? { duration: 0 } : fallback;
}

function neutralVariantState(v: Variants[string]): Variants[string] {
  if (typeof v !== "object" || v === null) return { opacity: 1 };
  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  };
}

export function useMotionVariants<T extends Variants>(variants: T): T {
  const reduce = useReducedMotion();
  if (!reduce) return variants;
  const out: Variants = {};
  for (const key of Object.keys(variants)) {
    out[key] = neutralVariantState(variants[key]);
  }
  return out as T;
}
