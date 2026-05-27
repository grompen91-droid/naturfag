import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useQuiz } from "../context/QuizProvider";
import {
  feedbackPop,
  springSnap,
  staggerContainer,
  staggerItem,
  useMotionTransition,
  useMotionVariants,
  usePanelSlideVariants,
  type SlideDirection,
} from "../lib/motion";
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

  const slideDirection = useRef<SlideDirection>(1);
  const current = flatQuestions[reviewFlatIndex];
  const transition = useMotionTransition(springSnap);
  const feedbackVariants = useMotionVariants(feedbackPop);
  const panelVariants = usePanelSlideVariants();
  const listVariants = useMotionVariants(staggerContainer);
  const itemVariants = useMotionVariants(staggerItem);

  const questionsForStep = useMemo(
    () => flatQuestions.filter((q) => q.stepIndex === reviewStepIndex),
    [flatQuestions, reviewStepIndex],
  );

  const stepAnsweredCount = useMemo(
    () => questionsForStep.filter((q) => q.userAnswer !== undefined).length,
    [questionsForStep],
  );

  useEffect(() => {
    if (current) {
      setReviewStepIndex(current.stepIndex);
    }
  }, [current, setReviewStepIndex]);

  const selectFlatIndex = (index: number) => {
    if (index === reviewFlatIndex) return;
    slideDirection.current = index < reviewFlatIndex ? -1 : 1;
    setReviewFlatIndex(index);
  };

  const handleStepSelect = (stepIndex: number) => {
    const first = flatQuestions.find((q) => q.stepIndex === stepIndex);
    setReviewStepIndex(stepIndex);
    if (first) {
      selectFlatIndex(first.flatIndex);
    }
  };

  const goBack = () => {
    if (reviewFlatIndex > 0) {
      slideDirection.current = -1;
      setReviewFlatIndex(reviewFlatIndex - 1);
    }
  };

  const goNext = () => {
    if (reviewFlatIndex < flatQuestions.length - 1) {
      slideDirection.current = 1;
      setReviewFlatIndex(reviewFlatIndex + 1);
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
      data-snap-section="summary-review"
      className="flex min-h-[100dvh] w-full shrink-0 snap-start snap-stop bg-[var(--color-surface)] md:h-[100dvh]"
      aria-labelledby="review-heading"
    >
      <div className="flex min-h-0 w-full flex-col gap-2 p-2 pt-12 md:h-full md:flex-row md:gap-[10px] md:p-[10px] md:pt-[10px]">
        <aside
          className="flex w-full max-h-[min(38dvh,20rem)] min-h-0 shrink-0 flex-col overflow-hidden md:max-h-none md:h-full md:min-h-0 md:w-full md:max-w-[17rem]"
          aria-label="Navigasjon i gjennomgang"
        >
          <div className="shrink-0 pb-2">
            <h2
              id="review-heading"
              className="mb-0.5 text-xl leading-tight md:text-2xl"
              style={{ fontFamily: "var(--font-section)", color: "var(--color-text)" }}
            >
              Gjennomgang
            </h2>
            <p
              className="max-w-prose text-sm leading-snug"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
            >
              Velg steg og spørsmål. Sammenlign svarene dine med fasiten.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-auto">
            <p
              className="mb-1.5 text-xs font-medium"
              style={{ fontFamily: "var(--font-nav)", color: "var(--color-text-muted)" }}
            >
              Steg
            </p>
            <StepPicker
              steps={steps}
              activeStepIndex={reviewStepIndex}
              onSelect={handleStepSelect}
              compact
            />

            <p
              className="mb-1.5 mt-3 flex flex-wrap items-baseline justify-between gap-x-2 text-xs font-medium"
              style={{ fontFamily: "var(--font-nav)", color: "var(--color-text-muted)" }}
            >
              <span className="min-w-0">{stepTitle}</span>
              <span
                className="shrink-0 tabular-nums"
                style={{ color: "var(--color-blue-dark)" }}
              >
                {stepAnsweredCount}/{questionsForStep.length}
              </span>
            </p>
            <QuestionPicker
              questions={questionsForStep}
              activeFlatIndex={reviewFlatIndex}
              isComplete={isComplete}
              onSelect={selectFlatIndex}
            />
          </div>
        </aside>

        <div
          className="h-px w-full shrink-0 md:h-auto md:w-px md:self-stretch"
          style={{ backgroundColor: "var(--color-blue)" }}
          aria-hidden
        />

        <div className="flex w-full min-h-[36dvh] flex-1 flex-col md:min-h-0 md:min-w-0">
          <div className="flex h-full min-h-0 w-full flex-col items-center overflow-y-auto overscroll-y-auto px-3 py-4 md:overflow-hidden md:overscroll-y-auto md:px-[10px] md:py-10">
            <AnimatePresence
              mode="wait"
              initial={false}
              custom={slideDirection.current}
            >
              <motion.article
                key={reviewFlatIndex}
                custom={slideDirection.current}
                className="flex w-full max-w-[400px] flex-col gap-3"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={panelVariants}
                transition={transition}
                aria-labelledby={`review-q-${reviewFlatIndex}`}
              >
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  {stepTitle} · spørsmål {questionIndex + 1} av {questionsForStep.length}
                </p>

                {submitted && (
                  <motion.p
                    className="text-sm font-medium"
                    role="status"
                    initial="hidden"
                    animate="visible"
                    variants={feedbackVariants}
                    style={{
                      fontFamily: "var(--font-body)",
                      color: wasCorrect
                        ? "var(--color-correct)"
                        : "var(--color-incorrect)",
                    }}
                  >
                    {wasCorrect
                      ? "Riktig svar."
                      : "Feil. Riktig alternativ er markert."}
                  </motion.p>
                )}

                <h3
                  id={`review-q-${reviewFlatIndex}`}
                  className="text-lg font-medium leading-snug md:text-[20px]"
                  style={{ fontFamily: "var(--font-question)", color: "var(--color-text)" }}
                >
                  {question.text}
                </h3>

                <motion.div
                  className="flex flex-col gap-2"
                  role="group"
                  aria-label="Svaralternativer med fasit"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {question.options.map((option, index) => (
                    <motion.div
                      key={index}
                      className="answer-choice-row"
                      variants={itemVariants}
                      layout
                    >
                      <span className="answer-choice-row__num" aria-hidden>
                        {index + 1}
                      </span>
                      <AnswerButton
                        optionNumber={index + 1}
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

                <QuestionNav
                  onBack={goBack}
                  onNext={goNext}
                  canBack={reviewFlatIndex > 0}
                  canNext={reviewFlatIndex < flatQuestions.length - 1}
                />
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
