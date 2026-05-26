import { useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

/** Snappy product UI spring (no bounce). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.8,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
};

export const easeOut: Transition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const fadeSlide: Variants = {
  hidden: { opacity: 0, x: 14 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springSnappy },
};

export function useMotionTransition(fallback: Transition = easeOut): Transition {
  const reduce = useReducedMotion();
  return reduce ? { duration: 0 } : fallback;
}

export function useMotionVariants<T extends Variants>(variants: T): T {
  const reduce = useReducedMotion();
  if (!reduce) return variants;
  return {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
    exit: { opacity: 1 },
  } as unknown as T;
}
