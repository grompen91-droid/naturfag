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
    <nav className="flex flex-col gap-[10px]" aria-label="Velg steg">
      {steps.map((step, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className="block w-full border-[3px] border-solid px-[10px] py-[10px] text-left text-[20px] leading-normal transition-colors"
          style={{
            fontFamily: "var(--font-question)",
            borderRadius: 0,
            backgroundColor:
              index === activeStepIndex
                ? "var(--color-blue-light-active)"
                : "var(--color-blue-light)",
            borderColor: "var(--color-blue)",
            color: "var(--color-text)",
            fontWeight: index === activeStepIndex ? 600 : 400,
          }}
        >
          Steg {index + 1}: {step.title}
        </button>
      ))}
    </nav>
  );
}
