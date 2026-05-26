import { useEffect, useRef, useState } from "react";
import { buildSummaryPayload } from "../lib/build-summary-payload";
import type { QuizData } from "../lib/quiz-schema";
import type { UserAnswer } from "../context/QuizProvider";
import type { QuestionKey } from "../lib/question-key";
import type { SummaryResponseBody } from "../lib/summary-types";

export type AiSummaryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; summary: string }
  | { status: "unavailable"; reason: string }
  | { status: "error"; message: string };

export function useAiSummary({
  enabled,
  steps,
  answers,
  correctCount,
  incorrectCount,
  totalQuestions,
}: {
  enabled: boolean;
  steps: QuizData;
  answers: Map<QuestionKey, UserAnswer>;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
}): AiSummaryState {
  const [state, setState] = useState<AiSummaryState>({ status: "idle" });
  const fetchedForKey = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setState({ status: "idle" });
      fetchedForKey.current = null;
      return;
    }

    const requestKey = `${correctCount}-${incorrectCount}-${answers.size}`;
    if (fetchedForKey.current === requestKey) return;
    fetchedForKey.current = requestKey;

    const controller = new AbortController();
    setState({ status: "loading" });

    const payload = buildSummaryPayload(
      steps,
      answers,
      correctCount,
      incorrectCount,
      totalQuestions,
    );

    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json()) as SummaryResponseBody;
        if (data.available) {
          setState({ status: "ready", summary: data.summary });
          return;
        }
        setState({ status: "unavailable", reason: data.reason });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({
          status: "error",
          message: "Kunne ikke hente AI-oppsummering.",
        });
      });

    return () => controller.abort();
  }, [
    enabled,
    steps,
    answers,
    correctCount,
    incorrectCount,
    totalQuestions,
  ]);

  return state;
}
