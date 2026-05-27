let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gain: number,
  delay = 0,
): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, c.currentTime + delay);
  gainNode.gain.setValueAtTime(0, c.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration + 0.05);
}

export function playCorrect(streak: number): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const base = 520 + Math.min(streak, 10) * 40;
  tone(base, 0.12, "sine", 0.18);
  tone(base * 1.26, 0.1, "sine", 0.12, 0.1);
  if (streak >= 3) tone(base * 1.5, 0.14, "sine", 0.1, 0.18);
  if (streak >= 5) tone(base * 2, 0.18, "sine", 0.09, 0.26);
}

export function playWrong(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  tone(180, 0.08, "sawtooth", 0.1);
  tone(140, 0.12, "sawtooth", 0.08, 0.08);
}

export function playMilestone(streak: number): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = 440 + streak * 20;
  [0, 0.1, 0.2, 0.32].forEach((delay, i) => {
    tone(root * [1, 1.25, 1.5, 2][i]!, 0.2, "sine", 0.13, delay);
  });
}
