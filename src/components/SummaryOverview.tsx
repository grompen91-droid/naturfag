import { useQuiz } from "../context/QuizProvider";
import { makeQuestionKey } from "../lib/question-key";

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
    summaryOverviewRef,
  } = useQuiz();

  return (
    <section
      ref={summaryOverviewRef}
      className="flex h-[100dvh] w-full shrink-0 snap-start snap-always flex-col overflow-hidden bg-white p-[10px] md:px-16 md:py-10"
    >
      {!isComplete ? (
        <p
          className="mb-8 text-[18px] text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Fullfør alle spørsmål for å se oppsummering
        </p>
      ) : (
        <div className="mb-10 flex flex-wrap items-baseline gap-3">
          <span
            className="text-4xl font-bold md:text-5xl"
            style={{
              fontFamily: "var(--font-question)",
              color: "var(--color-correct)",
            }}
          >
            {correctCount} riktig
          </span>
          <span className="text-3xl text-[var(--color-text)]">·</span>
          <span
            className="text-4xl font-bold md:text-5xl"
            style={{
              fontFamily: "var(--font-question)",
              color: "var(--color-incorrect)",
            }}
          >
            {incorrectCount} feil
          </span>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex}>
            <h3
              className="mb-3 text-[40px] leading-normal text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-title)" }}
            >
              {step.title}
            </h3>
            <div className="flex flex-wrap gap-[10px]">
              {step.questions.map((q, questionIndex) => {
                const key = makeQuestionKey(stepIndex, questionIndex);
                const userAnswer = answers.get(key);
                const answered = userAnswer !== undefined;
                const flatIndex =
                  steps
                    .slice(0, stepIndex)
                    .reduce((s, st) => s + st.questions.length, 0) +
                  questionIndex;

                let borderColor = "var(--color-blue)";
                if (answered) {
                  borderColor = userAnswer.isCorrect
                    ? "var(--color-correct)"
                    : "var(--color-incorrect)";
                }

                const truncated =
                  q.text.length > 40 ? `${q.text.slice(0, 40)}…` : q.text;

                return (
                  <button
                    key={questionIndex}
                    type="button"
                    onClick={() => answered && onJumpToReview(flatIndex)}
                    disabled={!answered}
                    title={q.text}
                    className="max-w-xs border-[3px] border-solid px-[10px] py-[10px] text-left text-[20px] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      fontFamily: "var(--font-question)",
                      borderRadius: 0,
                      borderColor,
                      backgroundColor: "var(--color-blue-light)",
                      color: "var(--color-text)",
                    }}
                  >
                    Q{questionIndex + 1}: {truncated}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
