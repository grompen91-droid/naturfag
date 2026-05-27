import { useCallback, useEffect, useRef, useState } from "react";

type HintState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error" };

type HintResponseBody =
  | { available: true; text: string }
  | { available: false; reason: string };

type UseAiHintProps = {
  questionKey: string;
  question: string;
  options: readonly string[];
  correctIndex: number;
};

export function useAiHint({ questionKey, question, options, correctIndex }: UseAiHintProps) {
  const [hintState, setHintState] = useState<HintState>({ status: "idle" });
  const [explainState, setExplainState] = useState<HintState>({ status: "idle" });
  const cache = useRef<Map<string, string>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setHintState({ status: "idle" });
    setExplainState({ status: "idle" });
    abortRef.current?.abort();
    abortRef.current = null;
  }, [questionKey]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const fetchHint = useCallback(
    async (mode: "hint" | "explain", selectedIndex?: number) => {
      const cacheKey = `${questionKey}:${mode}:${selectedIndex ?? ""}`;
      const cached = cache.current.get(cacheKey);
      if (cached) {
        if (mode === "hint") setHintState({ status: "ready", text: cached });
        else setExplainState({ status: "ready", text: cached });
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (mode === "hint") setHintState({ status: "loading" });
      else setExplainState({ status: "loading" });

      try {
        const res = await fetch("/api/hint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, options, correctIndex, mode, selectedIndex }),
          signal: controller.signal,
        });
        const data = (await res.json()) as HintResponseBody;
        if (data.available) {
          cache.current.set(cacheKey, data.text);
          if (mode === "hint") setHintState({ status: "ready", text: data.text });
          else setExplainState({ status: "ready", text: data.text });
        } else {
          if (mode === "hint") setHintState({ status: "error" });
          else setExplainState({ status: "error" });
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (mode === "hint") setHintState({ status: "error" });
        else setExplainState({ status: "error" });
      }
    },
    [questionKey, question, options, correctIndex],
  );

  const requestHint = useCallback(() => fetchHint("hint"), [fetchHint]);
  const requestExplain = useCallback(
    (selectedIndex: number) => fetchHint("explain", selectedIndex),
    [fetchHint],
  );

  return { hintState, explainState, requestHint, requestExplain };
}
