import confetti from "canvas-confetti";
import { getConfettiColors } from "./confetti-colors";

export type AnswerConfettiTier = "small" | "small-plus" | "medium" | "large";

const ANSWER_TIER_CONFIG: Record<
  AnswerConfettiTier,
  { particles: number; spread: number; velocity: number }
> = {
  small: { particles: 14, spread: 42, velocity: 22 },
  "small-plus": { particles: 22, spread: 50, velocity: 26 },
  medium: { particles: 38, spread: 62, velocity: 32 },
  large: { particles: 58, spread: 72, velocity: 38 },
};

/** Quick burst when user answers (tier scales with streak / step / quiz done). */
export function fireAnswerConfetti(tier: AnswerConfettiTier): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = getConfettiColors();
  if (colors.length === 0) return;

  const { particles, spread, velocity } = ANSWER_TIER_CONFIG[tier];

  void confetti({
    particleCount: particles,
    spread,
    startVelocity: velocity,
    gravity: 0.95,
    ticks: tier === "large" ? 140 : 100,
    colors,
    origin: { x: 0.52, y: 0.58 },
    disableForReducedMotion: true,
  });

  if (tier === "medium" || tier === "large") {
    window.setTimeout(() => {
      void confetti({
        particleCount: Math.round(particles * 0.45),
        spread: spread - 8,
        startVelocity: velocity - 6,
        gravity: 0.95,
        ticks: 90,
        colors,
        origin: { x: 0.48, y: 0.62 },
        angle: 110,
        disableForReducedMotion: true,
      });
    }, 90);
  }
}

/** scoreRatio 0–1 → confetti intensity (correct / total). */
export function fireScoreConfetti(scoreRatio: number): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const score = Math.max(0, Math.min(1, scoreRatio));
  if (score <= 0) return;

  const colors = getConfettiColors();
  if (colors.length === 0) return;

  const baseParticles = Math.round(30 + score * 170);
  const bursts = Math.max(1, Math.ceil(score * 4));
  const spread = 55 + score * 35;

  const fire = (particleCount: number, originY: number, angle?: number) => {
    void confetti({
      particleCount,
      spread,
      startVelocity: 28 + score * 22,
      gravity: 0.9,
      ticks: 180,
      colors,
      origin: { x: 0.5, y: originY },
      angle,
      disableForReducedMotion: true,
    });
  };

  fire(baseParticles, 0.62);

  for (let i = 1; i < bursts; i++) {
    window.setTimeout(() => {
      fire(Math.round(baseParticles * 0.45), 0.55, 60 + i * 24);
      fire(Math.round(baseParticles * 0.45), 0.55, 120 - i * 24);
    }, i * 120);
  }
}
