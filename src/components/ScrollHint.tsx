import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeUp, springSnap, useMotionTransition, useMotionVariants } from "../lib/motion";

const STORAGE_KEY = "naturfag-scroll-hint-dismissed";

type ScrollHintProps = {
  label?: string;
};

export function ScrollHint({
  label = "Scroll ned for neste del",
}: ScrollHintProps) {
  const [visible, setVisible] = useState(false);
  const transition = useMotionTransition(springSnap);
  const variants = useMotionVariants(fadeUp);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const root = document.querySelector<HTMLElement>("[data-scroll-root]");
    if (!root) return;

    const onScroll = () => {
      if (root.scrollTop > 48) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setVisible(false);
      }
    };

    setVisible(true);
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="scroll-hint"
      role="status"
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={transition}
      aria-live="polite"
    >
      <motion.span
        className="scroll-hint__chevron"
        aria-hidden
        animate={{ y: [0, 5, 0], opacity: [0.65, 1, 0.65] }}
        transition={
          transition.duration === 0
            ? { duration: 0 }
            : { duration: 2, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }
        }
      >
        ↓
      </motion.span>
      <span className="scroll-hint__label">{label}</span>
    </motion.div>
  );
}
