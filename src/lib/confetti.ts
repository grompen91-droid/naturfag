import confetti from "canvas-confetti";
import { getConfettiColors } from "./confetti-colors";

export type AnswerConfettiTier = "small" | "small-plus" | "medium" | "large" | "huge";

const ANSWER_TIER_CONFIG: Record<
  AnswerConfettiTier,
  { particles: number; spread: number; velocity: number; ticks: number }
> = {
  small:      { particles: 18,  spread: 48,  velocity: 24, ticks: 100 },
  "small-plus": { particles: 30, spread: 56, velocity: 30, ticks: 110 },
  medium:     { particles: 55,  spread: 68,  velocity: 36, ticks: 130 },
  large:      { particles: 85,  spread: 80,  velocity: 44, ticks: 160 },
  huge:       { particles: 130, spread: 100, velocity: 54, ticks: 220 },
};

function reduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Quick burst when user answers (tier scales with streak / step / quiz done). */
export function fireAnswerConfetti(tier: AnswerConfettiTier): void {
  if (typeof window === "undefined" || reduced()) return;

  const colors = getConfettiColors();
  if (colors.length === 0) return;

  const { particles, spread, velocity, ticks } = ANSWER_TIER_CONFIG[tier];

  void confetti({
    particleCount: particles,
    spread,
    startVelocity: velocity,
    gravity: 0.9,
    ticks,
    colors,
    origin: { x: 0.52, y: 0.56 },
    disableForReducedMotion: true,
  });

  if (tier === "medium" || tier === "large" || tier === "huge") {
    window.setTimeout(() => {
      void confetti({
        particleCount: Math.round(particles * 0.5),
        spread: spread - 10,
        startVelocity: velocity - 8,
        gravity: 0.9,
        ticks: ticks - 30,
        colors,
        origin: { x: 0.46, y: 0.6 },
        angle: 112,
        disableForReducedMotion: true,
      });
    }, 80);
  }

  if (tier === "large" || tier === "huge") {
    window.setTimeout(() => {
      void confetti({
        particleCount: Math.round(particles * 0.4),
        spread: spread + 10,
        startVelocity: velocity - 4,
        gravity: 0.85,
        ticks: ticks - 20,
        colors,
        origin: { x: 0.58, y: 0.6 },
        angle: 68,
        disableForReducedMotion: true,
      });
    }, 150);
  }

  if (tier === "huge") {
    // Side cannons
    window.setTimeout(() => {
      void confetti({ particleCount: 50, angle: 60, spread: 55, startVelocity: 60, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true });
      void confetti({ particleCount: 50, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true });
    }, 200);
    window.setTimeout(() => {
      void confetti({ particleCount: 40, angle: 75, spread: 45, startVelocity: 50, origin: { x: 0, y: 0.5 }, colors, disableForReducedMotion: true });
      void confetti({ particleCount: 40, angle: 105, spread: 45, startVelocity: 50, origin: { x: 1, y: 0.5 }, colors, disableForReducedMotion: true });
    }, 380);
  }
}

/** scoreRatio 0–1 → confetti intensity (correct / total). */
export function fireScoreConfetti(scoreRatio: number): void {
  if (typeof window === "undefined" || reduced()) return;

  const score = Math.max(0, Math.min(1, scoreRatio));
  if (score <= 0) return;

  const colors = getConfettiColors();
  if (colors.length === 0) return;

  const baseParticles = Math.round(50 + score * 220);
  const bursts = Math.max(1, Math.ceil(score * 5));
  const spread = 60 + score * 40;

  const fire = (particleCount: number, originY: number, angle?: number) => {
    void confetti({ particleCount, spread, startVelocity: 30 + score * 26, gravity: 0.88, ticks: 200, colors, origin: { x: 0.5, y: originY }, angle, disableForReducedMotion: true });
  };

  fire(baseParticles, 0.6);

  for (let i = 1; i < bursts; i++) {
    window.setTimeout(() => {
      fire(Math.round(baseParticles * 0.5), 0.55, 55 + i * 22);
      fire(Math.round(baseParticles * 0.5), 0.55, 125 - i * 22);
    }, i * 110);
  }

  if (score >= 0.8) {
    window.setTimeout(() => {
      void confetti({ particleCount: 70, angle: 60, spread: 60, startVelocity: 65, origin: { x: 0, y: 0.7 }, colors, disableForReducedMotion: true });
      void confetti({ particleCount: 70, angle: 120, spread: 60, startVelocity: 65, origin: { x: 1, y: 0.7 }, colors, disableForReducedMotion: true });
    }, 400);
  }
}
