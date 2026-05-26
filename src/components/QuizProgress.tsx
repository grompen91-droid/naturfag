import { memo } from "react";
import { motion } from "motion/react";
import { useQuiz } from "../context/QuizProvider";
import { fadeUp, springSnappy, useMotionTransition, useMotionVariants } from "../lib/motion";

export const QuizProgress = memo(function QuizProgress() {
  const { answeredCount, totalQuestions, isComplete } = useQuiz();
  const transition = useMotionTransition(springSnappy);
  const headerVariants = useMotionVariants(fadeUp);

  if (totalQuestions === 0) return null;

  const pct = Math.round((answeredCount / totalQuestions) * 100);
  const remaining = totalQuestions - answeredCount;

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-2"
      aria-label="Fremdrift i quizen"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      transition={transition}
    >
      <motion.div
        className="w-full max-w-md rounded-[var(--radius-md)] px-3 py-2 shadow-sm"
        animate={{
          borderColor: isComplete
            ? "var(--color-correct)"
            : "oklch(88% 0.03 230)",
          scale: isComplete ? [1, 1.02, 1] : 1,
        }}
        transition={transition}
        style={{
          backgroundColor: "oklch(99% 0.01 220 / 0.94)",
          borderWidth: 1,
          borderStyle: "solid",
        }}
      >
        <div
          className="mb-1.5 flex justify-between gap-2 text-xs leading-tight"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <motion.span
            key={isComplete ? "done" : "progress"}
            className="font-medium"
            style={{ color: "var(--color-text)" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            {isComplete ? "Alle spørsmål besvart" : "Besvarte spørsmål"}
          </motion.span>
          <span className="tabular-nums" style={{ color: "var(--color-text-muted)" }}>
            {answeredCount} av {totalQuestions}
            {!isComplete && remaining > 0 ? ` · ${remaining} igjen` : ""}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--color-blue-light)" }}
          role="progressbar"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={totalQuestions}
          aria-label={`${answeredCount} av ${totalQuestions} spørsmål besvart`}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${pct}%`,
              background: isComplete
                ? "linear-gradient(90deg, var(--color-correct), oklch(58% 0.14 160))"
                : "linear-gradient(90deg, var(--color-blue-dark), var(--color-blue))",
            }}
            transition={transition}
          />
        </div>
      </motion.div>
    </motion.header>
  );
});
