import { motion } from "motion/react";
import { springSnappy, useMotionTransition } from "../lib/motion";

type AnswerState = "neutral" | "correct" | "incorrect" | "selected-wrong";

type AnswerButtonProps = {
  label: string;
  state: AnswerState;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
};

const surfaceByState: Record<AnswerState, string> = {
  neutral: "var(--color-blue-light)",
  correct: "var(--color-correct-surface)",
  incorrect: "var(--color-incorrect-surface)",
  "selected-wrong": "var(--color-incorrect-surface)",
};

const borderByState: Record<AnswerState, string> = {
  neutral: "var(--color-blue)",
  correct: "var(--color-correct)",
  incorrect: "var(--color-incorrect)",
  "selected-wrong": "var(--color-incorrect)",
};

export function AnswerButton({
  label,
  state,
  disabled = false,
  readOnly = false,
  onClick,
}: AnswerButtonProps) {
  const isInteractive = !disabled && !readOnly && onClick;
  const transition = useMotionTransition(springSnappy);
  const revealed = state !== "neutral";

  return (
    <motion.button
      type="button"
      disabled={disabled || readOnly}
      onClick={onClick}
      className={[
        "w-full max-w-[400px] border-2 border-solid px-4 py-4 text-left text-base leading-snug",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
        isInteractive ? "cursor-pointer" : "cursor-default",
        disabled || readOnly ? "disabled:opacity-100" : "",
      ].join(" ")}
      style={{
        fontFamily: "var(--font-question)",
        color: "var(--color-text)",
        borderRadius: "var(--radius-md)",
      }}
      initial={false}
      animate={{
        borderColor: borderByState[state],
        backgroundColor: surfaceByState[state],
        scale: revealed ? 1 : isInteractive ? 1 : 1,
      }}
      whileHover={
        isInteractive && !revealed ? { scale: 1.01, filter: "brightness(0.98)" } : undefined
      }
      whileTap={isInteractive && !revealed ? { scale: 0.99 } : undefined}
      transition={transition}
      layout
      aria-pressed={revealed ? true : undefined}
    >
      <motion.span
        layout="position"
        animate={
          state === "correct"
            ? { x: [0, 2, 0] }
            : state === "selected-wrong"
              ? { x: [0, -3, 3, -2, 0] }
              : { x: 0 }
        }
        transition={
          state === "selected-wrong"
            ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0.2 }
        }
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

export function getAnswerState(
  optionIndex: number,
  correctIndex: number,
  selectedIndex: number | null,
  submitted: boolean,
): AnswerState {
  if (!submitted || selectedIndex === null) {
    return "neutral";
  }
  if (optionIndex === correctIndex) {
    return "correct";
  }
  if (optionIndex === selectedIndex) {
    return "selected-wrong";
  }
  return "neutral";
}
