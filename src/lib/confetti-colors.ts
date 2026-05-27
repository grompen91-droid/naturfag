/** Read brand colors from CSS variables for canvas-confetti. */
export function getConfettiColors(): string[] {
  if (typeof document === "undefined") {
    return [];
  }
  const root = document.documentElement;
  const names = [
    "--color-blue",
    "--color-correct",
    "--color-blue-dark",
    "--color-blue-light",
    "--color-incorrect",
  ] as const;
  return names
    .map((name) => getComputedStyle(root).getPropertyValue(name).trim())
    .filter(Boolean);
}
