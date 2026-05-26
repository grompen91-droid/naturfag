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
    <section className="flex h-[100dvh] w-full shrink-0 snap-start snap-always bg-white">
      <div className="flex h-full min-h-0 w-full gap-[10px] p-[10px] md:flex-row">
        <div className="min-h-0 flex-1 md:w-1/2">
          <ContentPanel title={step.title} body={step.body} />
        </div>
        <div
          className="h-[3px] w-full shrink-0 md:h-auto md:w-[3px]"
          style={{ backgroundColor: "var(--color-blue)" }}
          aria-hidden
        />
        <div className="min-h-0 flex-1 md:w-1/2">
          <QuestionPanel
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
