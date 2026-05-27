import { memo, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useQuiz } from "../context/QuizProvider";
import {
  fadeUp,
  numberTick,
  springSnap,
  useMotionTransition,
  useMotionVariants,
} from "../lib/motion";

export const QuizProgress = memo(function QuizProgress() {
  const { answeredCount, totalQuestions, isComplete } = useQuiz();
  const transition = useMotionTransition(springSnap);
  const headerVariants = useMotionVariants(fadeUp);
  const tickVariants = useMotionVariants(numberTick);

  if (totalQuestions === 0) return null;

  const pct = Math.round((answeredCount / totalQuestions) * 100);
  const remaining = totalQuestions - answeredCount;

  return (
    <motion.header
      className="quiz-progress"
      aria-label="Fremdrift i quizen"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      transition={transition}
    >
      <div
        className={[
          "quiz-progress__rail",
          isComplete ? "quiz-progress__rail--complete" : "",
        ].join(" ")}
        style={{ "--progress-pct": pct } as CSSProperties}
      >
        <p className="quiz-progress__label quiz-progress__label--mobile">
          {isComplete ? "Ferdig" : "Spørsmål"}
        </p>

        <AnimatePresence mode="popLayout">
          {isComplete && (
            <motion.p
              key="done"
              className="quiz-progress__done quiz-progress__done--desktop"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tickVariants}
            >
              Ferdig
            </motion.p>
          )}
        </AnimatePresence>

        <p className="quiz-progress__count" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={answeredCount}
              className="quiz-progress__answered"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tickVariants}
            >
              {answeredCount}
            </motion.span>
          </AnimatePresence>
          <span className="quiz-progress__sep">/</span>
          <span className="quiz-progress__total">{totalQuestions}</span>
        </p>

        {!isComplete && remaining > 0 && (
          <p className="quiz-progress__remaining">{remaining} igjen</p>
        )}

        <div
          className="quiz-progress__track"
          role="progressbar"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={totalQuestions}
          aria-label={`${answeredCount} av ${totalQuestions} spørsmål besvart`}
        >
          <motion.div
            key={`${answeredCount}-${isComplete}`}
            className={[
              "quiz-progress__fill",
              isComplete ? "quiz-progress__fill--complete" : "",
            ].join(" ")}
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 1 }}
            transition={transition}
          />
        </div>

        <p className="quiz-progress__sr-only">
          {isComplete
            ? `Alle ${totalQuestions} spørsmål er besvart.`
            : `${answeredCount} av ${totalQuestions} spørsmål besvart, ${remaining} gjenstår.`}
        </p>
      </div>
    </motion.header>
  );
});
