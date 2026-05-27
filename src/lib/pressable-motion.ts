import { springSnap } from "./motion";

/** Shared press feedback — slight lift, no bounce. */
export const pressableHover = {
  y: -1,
  scale: 1.012,
  transition: springSnap,
} as const;

export const pressableTap = {
  y: 0,
  scale: 0.988,
  transition: { type: "spring", stiffness: 520, damping: 38, mass: 0.65 },
} as const;
