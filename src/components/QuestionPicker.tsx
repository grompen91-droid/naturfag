import type { FlatQuestion } from "../context/QuizProvider";

type QuestionPickerProps = {
  questions: FlatQuestion[];
  activeFlatIndex: number;
  isComplete: boolean;
  onSelect: (flatIndex: number) => void;
};

export function QuestionPicker({
  questions,
  activeFlatIndex,
  isComplete,
  onSelect,
}: QuestionPickerProps) {
  return (
    <div
      className="mt-2 flex flex-wrap gap-2"
      role="list"
      aria-label="Spørsmål i steget"
    >
      {questions.map((q) => {
        const answered = q.userAnswer !== undefined;
        const isCorrect = q.userAnswer?.isCorrect;
        const isActive = q.flatIndex === activeFlatIndex;

        let borderColor = "var(--color-blue)";
        let bg = "var(--color-blue-light)";
        if (answered) {
          borderColor = isCorrect
            ? "var(--color-correct)"
            : "var(--color-incorrect)";
          bg = isCorrect
            ? "var(--color-correct-surface)"
            : "var(--color-incorrect-surface)";
        }

        return (
          <button
            key={q.flatIndex}
            type="button"
            role="listitem"
            onClick={() => onSelect(q.flatIndex)}
            disabled={!answered && !isComplete}
            title={q.question.text}
            className={[
              "min-h-[44px] min-w-[44px] border-2 border-solid px-3 py-2 text-sm font-medium",
              "transition-[opacity,filter] duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
              !answered && !isComplete ? "cursor-not-allowed opacity-45" : "hover:brightness-[0.97]",
            ].join(" ")}
            style={{
              fontFamily: "var(--font-question)",
              borderRadius: "var(--radius-sm)",
              borderColor,
              backgroundColor: isActive
                ? "var(--color-blue-light-active)"
                : bg,
              color: "var(--color-text)",
              outline: isActive ? "2px solid var(--color-blue-dark)" : undefined,
              outlineOffset: 2,
            }}
            aria-current={isActive ? "true" : undefined}
          >
            {q.questionIndex + 1}
          </button>
        );
      })}
    </div>
  );
}
