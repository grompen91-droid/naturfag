import type { QuizData } from "../lib/quiz-schema";

type StepPickerProps = {
  steps: QuizData;
  activeStepIndex: number;
  onSelect: (stepIndex: number) => void;
};

export function StepPicker({
  steps,
  activeStepIndex,
  onSelect,
}: StepPickerProps) {
  return (
    <nav className="flex flex-col gap-2" aria-label="Velg steg">
      {steps.map((step, index) => {
        const active = index === activeStepIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={[
              "block w-full border-2 border-solid px-3 py-2 text-left text-base leading-snug",
              "transition-[background-color,filter] duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-blue)]/40",
              "hover:brightness-[0.97]",
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
          >
            Steg {index + 1}: {step.title}
          </button>
        );
      })}
    </nav>
  );
}
