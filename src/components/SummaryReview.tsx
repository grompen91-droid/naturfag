import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useQuiz } from "../context/QuizProvider";
import { fadeSlide, springSnappy, staggerContainer, staggerItem, useMotionTransition, useMotionVariants } from "../lib/motion";
import { AnswerButton, getAnswerState } from "./AnswerButton";
import { QuestionNav } from "./QuestionNav";
import { StepPicker } from "./StepPicker";
import { QuestionPicker } from "./QuestionPicker";

export function SummaryReview() {
  const {
    steps,
    flatQuestions,
    reviewFlatIndex,
    setReviewFlatIndex,
    reviewStepIndex,
    setReviewStepIndex,
    isComplete,
    summaryReviewRef,
  } = useQuiz();

  const current = flatQuestions[reviewFlatIndex];
  const transition = useMotionTransition(springSnappy);
  const panelVariants = useMotionVariants(fadeSlide);
  const listVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);

  const questionsForStep = useMemo(
    () => flatQuestions.filter((q) => q.stepIndex === reviewStepIndex),
    [flatQuestions, reviewStepIndex],
  );

  useEffect(() => {
    if (current) {
      setReviewStepIndex(current.stepIndex);
    }
  }, [current, setReviewStepIndex]);

  const selectFlatIndex = (index: number) => {
    setReviewFlatIndex(index);
  };

  const handleStepSelect = (stepIndex: number) => {
    const first = flatQuestions.find((q) => q.stepIndex === stepIndex);
    setReviewStepIndex(stepIndex);
    if (first) {
      setReviewFlatIndex(first.flatIndex);
    }
  };

  const goBack = () => {
    if (reviewFlatIndex > 0) {
      selectFlatIndex(reviewFlatIndex - 1);
    }
  };

  const goNext = () => {
    if (reviewFlatIndex < flatQuestions.length - 1) {
      selectFlatIndex(reviewFlatIndex + 1);
    }
  };

  if (!current) {
    return null;
  }

  const { question, userAnswer, questionIndex, stepTitle } = current;
  const selectedIndex = userAnswer?.selectedIndex ?? null;
  const submitted = userAnswer !== undefined;
  const wasCorrect = userAnswer?.isCorrect;

  return (
    <section
      ref={summaryReviewRef}
      className="flex min-h-[100dvh] w-full shrink-0 snap-start snap-always bg-[var(--color-surface)] md:h-[100dvh]"
      aria-labelledby="review-heading"
    >
      <div className="flex min-h-0 w-full flex-col gap-2 p-2 pt-12 md:h-full md:flex-row md:gap-[10px] md:p-[10px] md:pt-[10px]">
        <aside className="flex min-h-0 flex-1 flex-col overflow-hidden md:w-1/2">
          <h2
            id="review-heading"
            className="mb-0.5 text-xl leading-tight md:text-2xl"
            style={{ fontFamily: "var(--font-title)", color: "var(--color-text)" }}
          >
            Gjennomgang
          </h2>
          <p
            className="mb-3 text-sm"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
          >
            Se hva du svarte, og hvilket alternativ som var riktig.
          </p>
          <StepPicker
            steps={steps}
            activeStepIndex={reviewStepIndex}
            onSelect={handleStepSelect}
          />
          <QuestionPicker
            questions={questionsForStep}
            activeFlatIndex={reviewFlatIndex}
            isComplete={isComplete}
            onSelect={selectFlatIndex}
          />
        </aside>
        <div
          className="h-px w-full shrink-0 md:h-auto md:w-px"
          style={{ backgroundColor: "var(--color-blue)" }}
          aria-hidden
        />
        <div className="flex min-h-0 flex-1 flex-col items-center md:w-1/2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={reviewFlatIndex}
              className="flex h-full min-h-0 w-full max-w-[400px] flex-col px-3 py-6 md:px-[10px] md:py-10"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
              transition={transition}
            >
              <motion.p
                className="mb-1 text-sm"
                style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                variants={itemVariants}
              >
                {stepTitle} · spørsmål {questionIndex + 1} av {questionsForStep.length}
              </motion.p>
              {submitted && (
                <motion.p
                  className="mb-2 text-sm font-medium"
                  role="status"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transition}
                  style={{
                    fontFamily: "var(--font-body)",
                    color: wasCorrect ? "var(--color-correct)" : "var(--color-incorrect)",
                  }}
                >
                  {wasCorrect
                    ? "Du svarte riktig på dette spørsmålet."
                    : "Du svarte feil. Riktig svar er markert under."}
                </motion.p>
              )}
              <motion.p
                className="mb-3 text-lg font-medium leading-snug"
                style={{ fontFamily: "var(--font-question)", color: "var(--color-text)" }}
                variants={itemVariants}
              >
                {question.text}
              </motion.p>
              <motion.div
                className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
                role="group"
                aria-label="Dine svar"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {question.options.map((option, index) => (
                  <motion.div key={index} variants={itemVariants} layout>
                    <AnswerButton
                      label={option}
                      state={getAnswerState(
                        index,
                        question.answer,
                        selectedIndex,
                        submitted,
                      )}
                      readOnly
                    />
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-3">
                <QuestionNav
                  onBack={goBack}
                  onNext={goNext}
                  canBack={reviewFlatIndex > 0}
                  canNext={reviewFlatIndex < flatQuestions.length - 1}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
