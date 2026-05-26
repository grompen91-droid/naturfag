import { AnswerButton, getAnswerState } from "./AnswerButton";
import { QuestionNav } from "./QuestionNav";

type Question = {
  text: string;
  options: string[];
  answer: number;
};

type QuestionPanelProps = {
  question: Question;
  selectedIndex: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  canBack: boolean;
  canNext: boolean;
};

export function QuestionPanel({
  question,
  selectedIndex,
  submitted,
  onSelect,
  onBack,
  onNext,
  canBack,
  canNext,
}: QuestionPanelProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center bg-white px-[10px] py-[80px]">
      <div className="flex w-full max-w-[400px] flex-col gap-[10px]">
        <p
          className="text-[20px] leading-normal text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-question)" }}
        >
          {question.text}
        </p>
        <div className="flex flex-col gap-[10px]">
          {question.options.map((option, index) => (
            <AnswerButton
              key={index}
              label={option}
              state={getAnswerState(
                index,
                question.answer,
                selectedIndex,
                submitted,
              )}
              disabled={submitted}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
        <QuestionNav
          onBack={onBack}
          onNext={onNext}
          canBack={canBack}
          canNext={canNext}
        />
      </div>
    </div>
  );
}
