import { useCallback, useEffect, useRef, useState } from "react";

type UseQuizKeyboardOptions = {
  enabled: boolean;
  questionKey: string;
  optionCount: number;
  submitted: boolean;
  canBack: boolean;
  canNext: boolean;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
};

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function isBackKey(key: string, includeVertical: boolean): boolean {
  if (key === "ArrowLeft" || key === "Backspace" || key === "h" || key === "H") {
    return true;
  }
  return includeVertical && (key === "ArrowUp" || key === "k" || key === "K");
}

function isNextKey(key: string, includeVertical: boolean): boolean {
  if (key === "ArrowRight" || key === "l" || key === "L") {
    return true;
  }
  return includeVertical && (key === "ArrowDown" || key === "j" || key === "J");
}

function isHighlightDown(key: string): boolean {
  return key === "ArrowDown" || key === "j" || key === "J";
}

function isHighlightUp(key: string): boolean {
  return key === "ArrowUp" || key === "k" || key === "K";
}

export function useQuizKeyboard({
  enabled,
  questionKey,
  optionCount,
  submitted,
  canBack,
  canNext,
  onSelect,
  onBack,
  onNext,
}: UseQuizKeyboardOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);

  const highlightRef = useRef(highlightedIndex);
  highlightRef.current = highlightedIndex;

  const submittedRef = useRef(submitted);
  submittedRef.current = submitted;

  const canBackRef = useRef(canBack);
  canBackRef.current = canBack;

  const canNextRef = useRef(canNext);
  canNextRef.current = canNext;

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  const helpOpenRef = useRef(helpOpen);
  helpOpenRef.current = helpOpen;

  useEffect(() => {
    setHighlightedIndex(0);
    setHelpOpen(false);
  }, [questionKey]);

  useEffect(() => {
    if (optionCount === 0) return;
    setHighlightedIndex((i) => Math.min(i, optionCount - 1));
  }, [optionCount]);

  const closeHelp = useCallback(() => setHelpOpen(false), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);
  const toggleHelp = useCallback(() => setHelpOpen((open) => !open), []);

  const moveHighlight = useCallback(
    (delta: number) => {
      if (optionCount === 0) return;
      setHighlightedIndex((current) => (current + delta + optionCount) % optionCount);
    },
    [optionCount],
  );

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) return;

      const key = event.key;

      if (key === "?" || (key === "/" && event.shiftKey)) {
        event.preventDefault();
        setHelpOpen((open) => !open);
        return;
      }

      if (key === "Escape" && helpOpenRef.current) {
        event.preventDefault();
        closeHelp();
        return;
      }

      if (helpOpenRef.current) return;

      if (isBackKey(key, submittedRef.current) && canBackRef.current) {
        event.preventDefault();
        onBackRef.current();
        return;
      }

      if (isNextKey(key, submittedRef.current) && canNextRef.current) {
        event.preventDefault();
        onNextRef.current();
        return;
      }

      if (!submittedRef.current && optionCount > 0) {
        const digit = key.length === 1 ? Number.parseInt(key, 10) : NaN;
        if (Number.isFinite(digit) && digit >= 1 && digit <= optionCount) {
          event.preventDefault();
          const index = digit - 1;
          setHighlightedIndex(index);
          onSelectRef.current(index);
          return;
        }

        if (isHighlightDown(key)) {
          event.preventDefault();
          moveHighlight(1);
          return;
        }
        if (isHighlightUp(key)) {
          event.preventDefault();
          moveHighlight(-1);
          return;
        }
        if (key === "Enter") {
          event.preventDefault();
          onSelectRef.current(highlightRef.current);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, optionCount, moveHighlight, closeHelp]);

  return {
    highlightedIndex,
    setHighlightedIndex,
    helpOpen,
    closeHelp,
    openHelp,
    toggleHelp,
  };
}
