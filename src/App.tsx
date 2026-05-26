import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { QuizProvider, useQuiz } from "./context/QuizProvider";
import { loadQuiz, type QuizData } from "./lib/quiz-schema";
import { flattenSteps } from "./lib/flatten-steps";
import { ScrollSnapRoot } from "./components/ScrollSnapRoot";
import { VideoSection } from "./components/VideoSection";
import { KnowledgeCheck } from "./components/KnowledgeCheck";
import { QuizProgress } from "./components/QuizProgress";
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
              title={step.title}
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
      <div
        className="flex h-[100dvh] items-center justify-center p-8 text-center"
        style={{ color: "var(--color-incorrect)", background: "var(--color-surface)" }}
      >
        <p style={{ fontFamily: "var(--font-body)" }}>
          Kunne ikke laste quiz. Prøv å laste siden på nytt.
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!steps) {
    return (
      <div
        className="flex h-[100dvh] flex-col items-center justify-center gap-3"
        style={{ background: "var(--color-surface)" }}
      >
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-solid"
          style={{
            borderColor: "var(--color-blue-light)",
            borderTopColor: "var(--color-blue)",
          }}
          role="status"
          aria-label="Laster quiz"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}>
          Laster quiz…
        </p>
      </div>
    );
  }

  return (
    <QuizProvider steps={steps}>
      <QuizProgress />
      <QuizContent />
    </QuizProvider>
  );
}
