import { useState } from "react";
import type { QuizStep } from "../lib/quiz-schema";
import { useQuiz } from "../context/QuizProvider";
import { ContentPanel } from "./ContentPanel";
import { QuestionPanel } from "./QuestionPanel";

type KnowledgeCheckProps = {
  stepIndex: number;
  step: QuizStep;
};

export function KnowledgeCheck({ stepIndex, step }: KnowledgeCheckProps) {
  const { recordAnswer, getAnswer } = useQuiz();
  const [questionIndex, setQuestionIndex] = useState(0);

  const question = step.questions[questionIndex];
  const stored = getAnswer(stepIndex, questionIndex);
  const selectedIndex = stored?.selectedIndex ?? null;
  const submitted = stored !== undefined;

  const handleSelect = (index: number) => {
    if (submitted) return;
    const isCorrect = index === question.answer;
    recordAnswer(stepIndex, questionIndex, index, isCorrect);
  };

  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    }
  };

  const goNext = () => {
    if (questionIndex < step.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    }
  };

  return (
    <section className="flex min-h-[100dvh] w-full shrink-0 snap-start snap-always bg-[var(--color-surface)] md:h-[100dvh]">
      <div className="flex min-h-0 w-full flex-col gap-2 p-2 pt-12 md:h-full md:flex-row md:gap-[10px] md:p-[10px] md:pt-[10px]">
        <div className="min-h-[40dvh] flex-1 md:min-h-0 md:w-1/2">
          <ContentPanel title={step.title} body={step.body} />
        </div>
        <div
          className="h-px w-full shrink-0 md:h-auto md:w-px"
          style={{ backgroundColor: "var(--color-blue)" }}
          aria-hidden
        />
        <div className="min-h-0 flex-1 md:w-1/2">
          <QuestionPanel
            questionKey={`${stepIndex}-${questionIndex}`}
            question={question}
            selectedIndex={selectedIndex}
            submitted={submitted}
            onSelect={handleSelect}
            onBack={goBack}
            onNext={goNext}
            canBack={questionIndex > 0}
            canNext={questionIndex < step.questions.length - 1}
          />
        </div>
      </div>
    </section>
  );
}
