import { motion } from "motion/react";
import type { FlatQuestion } from "../context/QuizProvider";
import { pressableHover, pressableTap } from "../lib/pressable-motion";
import { springSnappy, useMotionTransition } from "../lib/motion";

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
  const transition = useMotionTransition(springSnappy);

  return (
    <div
      className="flex flex-wrap gap-2"
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

        const label = `Spørsmål ${q.questionIndex + 1}: ${q.question.text}`;

        return (
          <motion.button
            key={q.flatIndex}
            type="button"
            role="listitem"
            onClick={() => onSelect(q.flatIndex)}
            disabled={!answered && !isComplete}
            title={label}
            aria-label={label}
            className={[
              "min-h-[44px] min-w-[44px] border-2 border-solid px-3 py-2 text-sm font-medium",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
              !answered && !isComplete ? "cursor-not-allowed opacity-45" : "",
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
            whileHover={answered || isComplete ? pressableHover : undefined}
            whileTap={answered || isComplete ? pressableTap : undefined}
            transition={transition}
          >
            {q.questionIndex + 1}
          </motion.button>
        );
      })}
    </div>
  );
}
