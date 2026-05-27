import { motion } from "motion/react";
import type { QuizData } from "../lib/quiz-schema";
import { pressableHover, pressableTap } from "../lib/pressable-motion";
import { springSnappy, useMotionTransition } from "../lib/motion";

type StepPickerProps = {
  steps: QuizData;
  activeStepIndex: number;
  onSelect: (stepIndex: number) => void;
  compact?: boolean;
};

export function StepPicker({
  steps,
  activeStepIndex,
  onSelect,
  compact = false,
}: StepPickerProps) {
  const transition = useMotionTransition(springSnappy);

  return (
    <nav className="flex flex-col gap-2" aria-label="Velg steg">
      {steps.map((step, index) => {
        const active = index === activeStepIndex;
        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={[
              "block w-full border-2 border-solid text-left leading-snug",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
              compact
                ? "min-h-[40px] px-2.5 py-1.5 text-sm"
                : "min-h-[44px] px-3 py-2 text-base",
            ].join(" ")}
            style={{
              fontFamily: "var(--font-question)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: active
                ? "var(--color-blue-light-active)"
                : "var(--color-blue-light)",
              borderColor: active ? "var(--color-blue-dark)" : "var(--color-blue)",
              color: "var(--color-text)",
              fontWeight: active ? 600 : 400,
            }}
            aria-current={active ? "step" : undefined}
            whileHover={pressableHover}
            whileTap={pressableTap}
            transition={transition}
          >
            Steg {index + 1}: {step.title}
          </motion.button>
        );
      })}
    </nav>
  );
}
