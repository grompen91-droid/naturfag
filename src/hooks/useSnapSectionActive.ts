import { useEffect, useRef, useState, type RefObject } from "react";

const SCROLL_ROOT_SELECTOR = "[data-scroll-root]";

function getVisibleRatio(element: Element, root: Element): number {
  const rect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const visibleTop = Math.max(rect.top, rootRect.top);
  const visibleBottom = Math.min(rect.bottom, rootRect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  return rect.height > 0 ? visibleHeight / rect.height : 0;
}

/** Section id with the largest visible area in the scroll root (min 40%). */
function findDominantSectionId(root: Element): string | null {
  const sections = root.querySelectorAll<HTMLElement>("[data-snap-section]");
  let bestId: string | null = null;
  let bestRatio = 0;

  sections.forEach((section) => {
    const id = section.dataset.snapSection;
    if (!id) return;
    const ratio = getVisibleRatio(section, root);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestId = id;
    }
  });

  return bestRatio >= 0.4 ? bestId : null;
}

/** True when this snap section is the main one on screen. */
export function useSnapSectionActive(
  sectionId: string,
): { ref: RefObject<HTMLElement | null>; isActive: boolean } {
  const ref = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const root = document.querySelector(SCROLL_ROOT_SELECTOR);
    if (!root) return;

    const update = () => {
      setIsActive(findDominantSectionId(root) === sectionId);
    };

    update();
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(root);

    return () => {
      root.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [sectionId]);

  return { ref, isActive };
}
