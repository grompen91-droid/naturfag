import { motion } from "motion/react";
import { answerRevealMotion, springSnap, tweenFast, useMotionTransition } from "../lib/motion";
import { pressableHover, pressableTap } from "../lib/pressable-motion";

type AnswerState = "neutral" | "correct" | "incorrect" | "selected-wrong";

type AnswerButtonProps = {
  optionNumber: number;
  label: string;
  state: AnswerState;
  isHighlighted?: boolean;
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

function motionState(state: AnswerState): "neutral" | "correct" | "wrong" {
  if (state === "correct") return "correct";
  if (state === "selected-wrong") return "wrong";
  return "neutral";
}

export function AnswerButton({
  optionNumber,
  label,
  state,
  isHighlighted = false,
  disabled = false,
  readOnly = false,
  onClick,
}: AnswerButtonProps) {
  const isInteractive = !disabled && !readOnly && onClick;
  const transition = useMotionTransition(springSnap);
  const revealed = state !== "neutral";
  const showHighlight = isHighlighted && state === "neutral";
  const surfaceKey = motionState(state);

  return (
    <motion.button
      type="button"
      disabled={disabled || readOnly}
      onClick={onClick}
      className={[
        "answer-option min-w-0 flex-1 border-2 border-solid px-4 py-4 text-left text-base leading-snug",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
        showHighlight ? "answer-option--highlighted" : "",
        isInteractive ? "cursor-pointer" : "cursor-default",
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
        ...answerRevealMotion(surfaceKey),
      }}
      transition={
        revealed && surfaceKey === "correct"
          ? { type: "spring", stiffness: 320, damping: 24, mass: 0.9 }
          : revealed
            ? tweenFast
            : transition
      }
      whileHover={
        isInteractive && !revealed && !showHighlight ? pressableHover : undefined
      }
      whileTap={isInteractive && !revealed ? pressableTap : undefined}
      aria-pressed={revealed ? true : undefined}
      aria-keyshortcuts={`${optionNumber}`}
    >
      {label}
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
