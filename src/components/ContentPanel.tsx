import { motion } from "motion/react";
import {
  fadeUp,
  springSnappy,
  staggerContainer,
  staggerItem,
  useMotionTransition,
  useMotionVariants,
} from "../lib/motion";

type ContentPanelProps = {
  title: string;
  body: string[];
};

export function ContentPanel({ title, body }: ContentPanelProps) {
  const transition = useMotionTransition(springSnappy);
  const containerVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);
  const rootVariants = useMotionVariants(fadeUp);

  return (
    <motion.div
      className="reading-panel flex h-full min-h-0 flex-col overflow-hidden p-3 md:p-[10px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={rootVariants}
      transition={transition}
    >
      <motion.h2
        className="reading-panel__title mb-2 shrink-0 border-b border-[var(--color-blue-light)] pb-2 text-xl font-semibold leading-tight md:text-2xl"
        style={{ fontFamily: "var(--font-section)", color: "var(--color-text)" }}
        variants={itemVariants}
      >
        {title}
      </motion.h2>
      <motion.div
        className="min-h-0 flex-1 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {body.map((paragraph, i) => (
          <motion.p
            key={i}
            className="mb-3 max-w-prose text-base leading-relaxed last:mb-0"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}
            variants={itemVariants}
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
}
