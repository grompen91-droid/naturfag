import { motion } from "motion/react";
import { scaleIn, springSnap, useMotionTransition, useMotionVariants } from "../lib/motion";

const HERO_SRC = "/naturfag_quiz_hero.png";

export function QuizHero() {
  const transition = useMotionTransition(springSnap);
  const variants = useMotionVariants(scaleIn);

  return (
    <motion.figure
      className="quiz-hero"
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={transition}
      aria-label="Naturfag og bærekraft"
    >
      <img
        src={HERO_SRC}
        alt=""
        className="quiz-hero__img"
        width={96}
        height={96}
        loading="lazy"
        decoding="async"
      />
      <figcaption className="quiz-hero__caption">
        <span
          className="quiz-hero__label"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
        >
          Naturfag &amp; bærekraft
        </span>
      </figcaption>
    </motion.figure>
  );
}
