import confetti from "canvas-confetti";

/** scoreRatio 0–1 → confetti intensity (correct / total). */
export function fireScoreConfetti(scoreRatio: number): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const score = Math.max(0, Math.min(1, scoreRatio));
  if (score <= 0) return;

  const colors = [
    "#32a5ec",
    "#2eff04",
    "#123a53",
    "#bfe3f9",
    "#ff6b6b",
  ];

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
