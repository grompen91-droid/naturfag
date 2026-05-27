import { fireAnswerConfetti, type AnswerConfettiTier } from "./confetti";

export type AnswerRewardContext = {
  isCorrect: boolean;
  correctStreak: number;
  stepCompleted: boolean;
  quizJustCompleted: boolean;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function pulseBodyClass(className: string, durationMs: number): void {
  document.body.classList.add(className);
  window.setTimeout(() => document.body.classList.remove(className), durationMs);
}

function pickConfettiTier(ctx: AnswerRewardContext): AnswerConfettiTier | null {
  if (!ctx.isCorrect) return null;
  if (ctx.quizJustCompleted) return "medium";
  if (ctx.stepCompleted) return "medium";
  if (ctx.correctStreak >= 5) return "medium";
  if (ctx.correctStreak >= 3) return "small-plus";
  return "small";
}

/** Small → bigger rewards for correct; tiny negative cue for wrong. */
export function celebrateAnswer(ctx: AnswerRewardContext): void {
  if (typeof document === "undefined") return;

  if (ctx.isCorrect) {
    const tier = pickConfettiTier(ctx);
    if (tier) fireAnswerConfetti(tier);
    if (!prefersReducedMotion()) {
      pulseBodyClass("answer-feedback--correct", 420);
    }
    return;
  }

  if (!prefersReducedMotion()) {
    pulseBodyClass("answer-feedback--wrong", 380);
  }
}
