const SCROLL_ROOT = "[data-scroll-root]";
const SNAP_SECTION = "[data-snap-section]";

export function scrollToNextSection(currentEl: HTMLElement | null): void {
  if (!currentEl) return;
  const root = document.querySelector(SCROLL_ROOT);
  if (!root) return;

  const sections = Array.from(root.querySelectorAll<HTMLElement>(SNAP_SECTION));
  const idx = sections.indexOf(currentEl);
  const next = sections[idx + 1];
  if (!next) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  next.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
}
