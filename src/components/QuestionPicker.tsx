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
      className="mt-[10px] flex flex-wrap gap-[10px]"
      role="list"
      aria-label="Spørsmål"
    >
      {questions.map((q) => {
        const answered = q.userAnswer !== undefined;
        const isCorrect = q.userAnswer?.isCorrect;
        const isActive = q.flatIndex === activeFlatIndex;

        let borderColor = "var(--color-blue)";
        let opacity = 1;
        if (answered) {
          borderColor = isCorrect
            ? "var(--color-correct)"
            : "var(--color-incorrect)";
        } else if (!isComplete) {
          opacity = 0.45;
        }

        return (
          <button
            key={q.flatIndex}
            type="button"
            role="listitem"
            onClick={() => onSelect(q.flatIndex)}
            disabled={!answered && !isComplete}
            title={q.question.text}
            className="border-[3px] border-solid px-[10px] py-[10px] text-[20px] transition-opacity disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-question)",
              borderRadius: 0,
              borderColor,
              backgroundColor: isActive
                ? "var(--color-blue-light-active)"
                : "var(--color-blue-light)",
              color: "var(--color-text)",
              opacity,
            }}
          >
            Q{q.questionIndex + 1}
          </button>
        );
      })}
    </div>
  );
}
