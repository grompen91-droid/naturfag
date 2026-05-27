import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  easeOutExpo,
  fadeUp,
  springSnap,
  useMotionTransition,
  useMotionVariants,
} from "./lib/motion";
import { QuizProvider, useQuiz } from "./context/QuizProvider";
import { loadQuiz, type QuizData } from "./lib/quiz-schema";
import { flattenSteps } from "./lib/flatten-steps";
import { ScrollSnapRoot } from "./components/ScrollSnapRoot";
import { VideoSection } from "./components/VideoSection";
import { KnowledgeCheck } from "./components/KnowledgeCheck";
import { QuizProgress } from "./components/QuizProgress";
import { SummaryOverview } from "./components/SummaryOverview";
import { SummaryReview } from "./components/SummaryReview";
import { AudioConsentGate } from "./components/AudioConsentGate";
import { QuizAudioControls } from "./components/QuizAudioControls";
import { QuizAudioProvider } from "./context/QuizAudioProvider";
import { useAudioConsent } from "./hooks/useAudioConsent";

function QuizLoadingScreen() {
  const transition = useMotionTransition(springSnap);
  const variants = useMotionVariants(fadeUp);

  return (
    <motion.div
      className="flex h-[100dvh] flex-col items-center justify-center gap-3"
      style={{ background: "var(--color-surface)" }}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={transition}
    >
      <motion.div
        className="relative h-9 w-9"
        role="status"
        aria-label="Laster quiz"
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-solid"
          style={{
            borderColor: "var(--color-blue-light)",
            borderTopColor: "var(--color-blue)",
          }}
          animate={{ rotate: 360 }}
          transition={
            transition.duration === 0
              ? { duration: 0 }
              : { duration: 1.1, repeat: Infinity, ease: "linear" }
          }
        />
        <motion.span
          className="absolute inset-1 rounded-full"
          style={{ backgroundColor: "var(--color-blue-light)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={
            transition.duration === 0
              ? { duration: 0 }
              : { duration: 1.4, repeat: Infinity, ease: easeOutExpo }
          }
        />
      </motion.div>
      <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}>
        Laster quiz…
      </p>
    </motion.div>
  );
}

function QuizContent() {
  const { steps, setReviewFlatIndex, scrollToReview } = useQuiz();
  const panels = flattenSteps(steps);

  const jumpToReview = (flatIndex: number) => {
    setReviewFlatIndex(flatIndex);
    requestAnimationFrame(() => scrollToReview());
  };

  return (
    <ScrollSnapRoot className="quiz-app__main">
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
  const { hasConsent, acceptWithAudio, acceptWithoutAudio } = useAudioConsent();
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

  if (!hasConsent) {
    return (
      <AudioConsentGate
        loading={!steps && !error}
        onAcceptWithAudio={acceptWithAudio}
        onAcceptWithoutAudio={acceptWithoutAudio}
      />
    );
  }

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
    return <QuizLoadingScreen />;
  }

  return (
    <QuizProvider steps={steps}>
      <QuizAudioProvider>
        <div className="quiz-app">
          <QuizContent />
          <QuizProgress />
          <QuizAudioControls />
        </div>
      </QuizAudioProvider>
    </QuizProvider>
  );
}
