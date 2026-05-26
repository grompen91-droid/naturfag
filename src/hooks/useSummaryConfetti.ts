import { useEffect, useRef, type RefObject } from "react";
import { fireScoreConfetti } from "../lib/confetti";

type UseSummaryConfettiOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  correctCount: number;
  totalQuestions: number;
  answeredCount: number;
};

export function useSummaryConfetti({
  sectionRef,
  correctCount,
  totalQuestions,
  answeredCount,
}: UseSummaryConfettiOptions): void {
  const hasFired = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || totalQuestions === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasFired.current) return;
        if (answeredCount === 0) return;

        hasFired.current = true;
        const scoreRatio = correctCount / totalQuestions;
        fireScoreConfetti(scoreRatio);
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionRef, correctCount, totalQuestions, answeredCount]);
}
