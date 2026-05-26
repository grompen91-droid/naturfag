type AnswerState = "neutral" | "correct" | "incorrect" | "selected-wrong";

type AnswerButtonProps = {
  label: string;
  state: AnswerState;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
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
  const borderColor = borderByState[state];

  return (
    <button
      type="button"
      disabled={disabled || readOnly}
      onClick={onClick}
      className="w-full max-w-[400px] border-[3px] border-solid px-[10px] py-[40px] text-center text-[20px] leading-normal text-[var(--color-text)] transition-colors disabled:cursor-default"
      style={{
        fontFamily: "var(--font-question)",
        borderColor,
        backgroundColor: "var(--color-blue-light)",
        borderRadius: 0,
      }}
    >
      {label}
    </button>
  );
}

export function getAnswerState(
  optionIndex: number,
  correctIndex: number,
  selectedIndex: number | null,
  submitted: boolean,
): "neutral" | "correct" | "incorrect" | "selected-wrong" {
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
