import { AnimatePresence, motion } from "motion/react";
import { useQuiz } from "../context/QuizProvider";
import { useAiSummary } from "../hooks/useAiSummary";
import { useSummaryConfetti } from "../hooks/useSummaryConfetti";
import { makeQuestionKey } from "../lib/question-key";
import { fadeUp, scaleIn, springSnappy, useMotionTransition } from "../lib/motion";
import { ScoreSummary } from "./ScoreSummary";

type SummaryOverviewProps = {
  onJumpToReview: (flatIndex: number) => void;
};

export function SummaryOverview({ onJumpToReview }: SummaryOverviewProps) {
  const {
    steps,
    answers,
    isComplete,
    correctCount,
    incorrectCount,
    totalQuestions,
    answeredCount,
    summaryOverviewRef,
  } = useQuiz();

  const aiSummary = useAiSummary({
    enabled: isComplete,
    steps,
    answers,
    correctCount,
    incorrectCount,
    totalQuestions,
  });

  const remaining = totalQuestions - answeredCount;
  const transition = useMotionTransition(springSnappy);

  useSummaryConfetti({
    sectionRef: summaryOverviewRef,
    correctCount,
    totalQuestions,
    answeredCount,
  });

  return (
    <section
      ref={summaryOverviewRef}
      className="flex min-h-[100dvh] w-full shrink-0 snap-start snap-always flex-col overflow-hidden bg-[var(--color-surface)] p-3 pt-14 md:px-16 md:py-10 md:pt-10"
      aria-labelledby="summary-heading"
    >
      <h2
        id="summary-heading"
        className="mb-1 text-2xl leading-tight md:text-[32px]"
        style={{ fontFamily: "var(--font-title)", color: "var(--color-text)" }}
      >
        Oppsummering
      </h2>
      <p
        className="mb-4 text-sm"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
      >
        Oversikt over alle spørsmål i quizen.
      </p>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="incomplete"
            className="mb-6 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-3"
            style={{
              borderColor: "var(--color-blue)",
              backgroundColor: "var(--color-blue-light)",
              fontFamily: "var(--font-body)",
            }}
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={transition}
          >
            <p className="text-base font-medium" style={{ color: "var(--color-text)" }}>
              {remaining === 1
                ? "1 spørsmål gjenstår"
                : `${remaining} spørsmål gjenstår`}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Scroll opp i quizen og svar på resten. Resultatene vises her når du er
              ferdig.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <ScoreSummary
              correctCount={correctCount}
              incorrectCount={incorrectCount}
              totalQuestions={totalQuestions}
            />
            {aiSummary.status === "loading" && (
              <motion.div
                className="mb-4 rounded-[var(--radius-md)] border-2 border-solid px-4 py-3"
                style={{
                  borderColor: "var(--color-blue)",
                  backgroundColor: "var(--color-blue-light)",
                  fontFamily: "var(--font-body)",
                }}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
              >
                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  Lager personlig oppsummering…
                </p>
              </motion.div>
            )}
            {aiSummary.status === "ready" && (
              <motion.aside
                className="mb-4 rounded-[var(--radius-md)] border-2 border-solid px-4 py-3"
                style={{
                  borderColor: "var(--color-correct)",
                  backgroundColor: "var(--color-correct-surface)",
                  fontFamily: "var(--font-body)",
                }}
                aria-label="AI-oppsummering"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
              >
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-correct)" }}
                >
                  Tilbakemelding
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {aiSummary.summary}
                </p>
              </motion.aside>
            )}
            {aiSummary.status === "error" && (
              <p
                className="mb-4 text-sm"
                role="alert"
                style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
              >
                {aiSummary.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="min-h-0 flex-1 space-y-6 overflow-y-auto"
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
      >
        {steps.map((step, stepIndex) => (
          <motion.div
            key={stepIndex}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            transition={transition}
          >
            <h3
              className="mb-2 text-xl leading-snug md:text-2xl"
              style={{ fontFamily: "var(--font-title), cursive", color: "var(--color-text)" }}
            >
              {step.title}
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label={`Spørsmål i ${step.title}`}>
              {step.questions.map((q, questionIndex) => {
                const key = makeQuestionKey(stepIndex, questionIndex);
                const userAnswer = answers.get(key);
                const answered = userAnswer !== undefined;
                const flatIndex =
                  steps
                    .slice(0, stepIndex)
                    .reduce((s, st) => s + st.questions.length, 0) + questionIndex;

                const borderColor = answered
                  ? userAnswer.isCorrect
                    ? "var(--color-correct)"
                    : "var(--color-incorrect)"
                  : "var(--color-blue)";
                const bg = answered
                  ? userAnswer.isCorrect
                    ? "var(--color-correct-surface)"
                    : "var(--color-incorrect-surface)"
                  : "var(--color-blue-light)";

                const truncated =
                  q.text.length > 48 ? `${q.text.slice(0, 48)}…` : q.text;

                return (
                  <motion.li
                    key={questionIndex}
                    layout
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                    transition={{ ...transition, delay: questionIndex * 0.03 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => answered && onJumpToReview(flatIndex)}
                      disabled={!answered}
                      title={
                        answered
                          ? `${q.text} — trykk for gjennomgang`
                          : "Besvar spørsmålet først"
                      }
                      className={[
                        "max-w-xs border-2 border-solid px-3 py-2 text-left text-sm leading-snug",
                        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
                        answered ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                      ].join(" ")}
                      style={{
                        fontFamily: "var(--font-question)",
                        borderRadius: "var(--radius-sm)",
                        borderColor,
                        backgroundColor: bg,
                        color: "var(--color-text)",
                      }}
                      whileHover={answered ? { scale: 1.02 } : undefined}
                      whileTap={answered ? { scale: 0.98 } : undefined}
                      transition={transition}
                    >
                      <span className="font-medium">Spørsmål {questionIndex + 1}</span>
                      {answered && (
                        <span
                          className="ml-1.5 text-xs font-normal"
                          style={{
                            color: userAnswer.isCorrect
                              ? "var(--color-correct)"
                              : "var(--color-incorrect)",
                          }}
                        >
                          {userAnswer.isCorrect ? "Riktig" : "Feil"}
                        </span>
                      )}
                      <span
                        className="mt-0.5 block text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {truncated}
                      </span>
                    </motion.button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
