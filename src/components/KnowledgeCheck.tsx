import { useState } from "react";
import type { QuizStep } from "../lib/quiz-schema";
import { useQuiz } from "../context/QuizProvider";
import { celebrateAnswer, getMilestoneLevel, type MilestoneLevel } from "../lib/answer-reward";
import { useSnapSectionActive } from "../hooks/useSnapSectionActive";
import { ContentPanel } from "./ContentPanel";
import { QuestionPanel } from "./QuestionPanel";
import { StreakBurst } from "./StreakBurst";

type KnowledgeCheckProps = {
  stepIndex: number;
  step: QuizStep;
};

export function KnowledgeCheck({ stepIndex, step }: KnowledgeCheckProps) {
  const {
    recordAnswer,
    getAnswer,
    correctStreak,
    answeredCount,
    totalQuestions,
  } = useQuiz();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [milestone, setMilestone] = useState<MilestoneLevel>(null);
  const sectionId = `knowledge-${stepIndex}`;
  const { ref: sectionRef, isActive } = useSnapSectionActive(sectionId);

  const question = step.questions[questionIndex];
  const stored = getAnswer(stepIndex, questionIndex);
  const selectedIndex = stored?.selectedIndex ?? null;
  const submitted = stored !== undefined;

  const handleSelect = (index: number) => {
    if (submitted) return;
    const isCorrect = index === question.answer;
    const nextStreak = isCorrect ? correctStreak + 1 : 0;

    const stepCompleted = step.questions.every(
      (_, qi) => qi === questionIndex || getAnswer(stepIndex, qi) !== undefined,
    );
    const quizJustCompleted = answeredCount + 1 === totalQuestions;

    recordAnswer(stepIndex, questionIndex, index, isCorrect);

    celebrateAnswer({
      isCorrect,
      correctStreak: nextStreak,
      stepCompleted,
      quizJustCompleted,
    });

    if (isCorrect) setMilestone(getMilestoneLevel(nextStreak));
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
    <>
    <StreakBurst milestone={milestone} />
    <section
      ref={sectionRef}
      data-snap-section={sectionId}
      className="flex min-h-[100dvh] w-full shrink-0 snap-start snap-always bg-[var(--color-surface)] md:h-[100dvh]"
    >
      <div className="flex min-h-0 w-full flex-col gap-2 p-2 pt-12 md:h-full md:flex-row md:gap-[10px] md:p-[10px] md:pt-[10px]">
        <div className="min-h-[40dvh] flex-1 md:min-h-0 md:w-1/2">
          <ContentPanel title={step.title} body={step.body} />
        </div>
        <div
          className="h-px w-full shrink-0 md:h-auto md:w-px"
          style={{ backgroundColor: "var(--color-blue)" }}
          aria-hidden
        />
        <div
          className="min-h-0 flex-1 md:w-1/2"
          style={{ pointerEvents: isActive ? "auto" : "none" }}
          aria-hidden={!isActive}
        >
          <QuestionPanel
            questionKey={`${stepIndex}-${questionIndex}`}
            question={question}
            selectedIndex={selectedIndex}
            submitted={submitted}
            inputActive={isActive}
            correctStreak={correctStreak}
            onSelect={handleSelect}
            onBack={goBack}
            onNext={goNext}
            canBack={questionIndex > 0}
            canNext={questionIndex < step.questions.length - 1}
          />
        </div>
      </div>
    </section>
    </>
  );
}
