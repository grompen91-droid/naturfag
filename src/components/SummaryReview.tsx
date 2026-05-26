import { useEffect, useMemo } from "react";
import { useQuiz } from "../context/QuizProvider";
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

  const questionsForStep = useMemo(
    () => flatQuestions.filter((q) => q.stepIndex === reviewStepIndex),
    [flatQuestions, reviewStepIndex],
  );

  useEffect(() => {
    if (current) {
      setReviewStepIndex(current.stepIndex);
    }
  }, [current, setReviewStepIndex]);

  const handleStepSelect = (stepIndex: number) => {
    setReviewStepIndex(stepIndex);
    const first = flatQuestions.find((q) => q.stepIndex === stepIndex);
    if (first) {
      setReviewFlatIndex(first.flatIndex);
    }
  };

  const goBack = () => {
    if (reviewFlatIndex > 0) {
      setReviewFlatIndex(reviewFlatIndex - 1);
    }
  };

  const goNext = () => {
    if (reviewFlatIndex < flatQuestions.length - 1) {
      setReviewFlatIndex(reviewFlatIndex + 1);
    }
  };

  if (!current) {
    return null;
  }

  const { question, userAnswer, stepIndex, questionIndex } = current;
  const selectedIndex = userAnswer?.selectedIndex ?? null;
  const submitted = userAnswer !== undefined;

  return (
    <section
      ref={summaryReviewRef}
      className="flex h-[100dvh] w-full shrink-0 snap-start snap-always bg-white"
    >
      <div className="flex h-full min-h-0 w-full gap-[10px] p-[10px] md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white md:w-1/2">
          <h2
            className="mb-[10px] text-[40px] leading-normal text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Gjennomgang
          </h2>
          <StepPicker
            steps={steps}
            activeStepIndex={reviewStepIndex}
            onSelect={handleStepSelect}
          />
          <QuestionPicker
            questions={questionsForStep}
            activeFlatIndex={reviewFlatIndex}
            isComplete={isComplete}
            onSelect={setReviewFlatIndex}
          />
        </div>
        <div
          className="h-[3px] w-full shrink-0 md:h-auto md:w-[3px]"
          style={{ backgroundColor: "var(--color-blue)" }}
          aria-hidden
        />
        <div className="flex min-h-0 flex-1 flex-col items-center md:w-1/2">
          <div className="flex h-full min-h-0 w-full max-w-[400px] flex-col px-[10px] py-[80px]">
            <p
              className="mb-[10px] text-[20px] leading-normal text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-question)" }}
            >
              Steg {stepIndex + 1} · Spørsmål {questionIndex + 1}
            </p>
            <p
              className="mb-[10px] text-[20px] leading-normal text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-question)" }}
            >
              {question.text}
            </p>
            <div className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-auto">
              {question.options.map((option, index) => (
                <AnswerButton
                  key={index}
                  label={option}
                  state={getAnswerState(
                    index,
                    question.answer,
                    selectedIndex,
                    submitted,
                  )}
                  readOnly
                />
              ))}
            </div>
            <div className="mt-[10px]">
              <QuestionNav
                onBack={goBack}
                onNext={goNext}
                canBack={reviewFlatIndex > 0}
                canNext={reviewFlatIndex < flatQuestions.length - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
