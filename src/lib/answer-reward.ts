import { fireAnswerConfetti, type AnswerConfettiTier } from "./confetti";
import { playCorrect, playWrong, playMilestone } from "./sounds";

export type AnswerRewardContext = {
  isCorrect: boolean;
  correctStreak: number;
  stepCompleted: boolean;
  quizJustCompleted: boolean;
};

export type MilestoneLevel = 3 | 5 | 7 | 10 | null;

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
  if (ctx.quizJustCompleted) return "huge";
  if (ctx.correctStreak >= 10) return "large";
  if (ctx.stepCompleted || ctx.correctStreak >= 5) return "medium";
  if (ctx.correctStreak >= 3) return "small-plus";
  return "small";
}

export function getMilestoneLevel(streak: number): MilestoneLevel {
  if (streak === 10) return 10;
  if (streak === 7) return 7;
  if (streak === 5) return 5;
  if (streak === 3) return 3;
  return null;
}

/** Small → bigger rewards for correct; negative cue for wrong. */
export function celebrateAnswer(ctx: AnswerRewardContext): void {
  if (typeof document === "undefined") return;
  const reduced = prefersReducedMotion();

  if (ctx.isCorrect) {
    const tier = pickConfettiTier(ctx);
    if (tier) fireAnswerConfetti(tier);

    playCorrect(ctx.correctStreak);

    const milestone = getMilestoneLevel(ctx.correctStreak);
    if (milestone) {
      playMilestone(ctx.correctStreak);
      if (!reduced) {
        pulseBodyClass(`answer-feedback--streak-${milestone}`, 700);
      }
    }

    if (!reduced) {
      pulseBodyClass("answer-feedback--correct", ctx.correctStreak >= 5 ? 600 : 420);
    }
    return;
  }

  playWrong();
  if (!reduced) {
    pulseBodyClass("answer-feedback--wrong", 480);
  }
}
