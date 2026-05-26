import { useEffect, useState } from "react";
import { QuizProvider, useQuiz } from "./context/QuizProvider";
import { loadQuiz, type QuizData } from "./lib/quiz-schema";
import { flattenSteps } from "./lib/flatten-steps";
import { ScrollSnapRoot } from "./components/ScrollSnapRoot";
import { VideoSection } from "./components/VideoSection";
import { KnowledgeCheck } from "./components/KnowledgeCheck";
import { SummaryOverview } from "./components/SummaryOverview";
import { SummaryReview } from "./components/SummaryReview";

function QuizContent() {
  const { steps, setReviewFlatIndex, scrollToReview } = useQuiz();
  const panels = flattenSteps(steps);

  const jumpToReview = (flatIndex: number) => {
    setReviewFlatIndex(flatIndex);
    requestAnimationFrame(() => scrollToReview());
  };

  return (
    <ScrollSnapRoot>
      {panels.map((panel) => {
        const step = steps[panel.stepIndex];
        if (panel.type === "video" && step.video) {
          return (
            <VideoSection
              key={`video-${panel.stepIndex}`}
              src={step.video}
            />
          );
        }
        return (
          <KnowledgeCheck
            key={`knowledge-${panel.stepIndex}`}
            stepIndex={panel.stepIndex}
            step={step}
          />
        );
      })}
      <SummaryOverview onJumpToReview={jumpToReview} />
      <SummaryReview />
    </ScrollSnapRoot>
  );
}

export default function App() {
  const [steps, setSteps] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz()
      .then(setSteps)
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Quiz load error:", err);
        setError(message);
      });
  }, []);

  if (error) {
    return (
      <div className="flex h-[100dvh] items-center justify-center p-8 text-center text-red-600">
        <p>Kunne ikke laste quiz: {error}</p>
      </div>
    );
  }

  if (!steps) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <p style={{ fontFamily: "var(--font-body)" }}>Laster quiz…</p>
      </div>
    );
  }

  return (
    <QuizProvider steps={steps}>
      <QuizContent />
    </QuizProvider>
  );
}
