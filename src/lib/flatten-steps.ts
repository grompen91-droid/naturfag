import type { QuizData } from "./quiz-schema";

export type PanelType = "video" | "knowledge";

export type FlatPanel =
  | { type: "video"; stepIndex: number }
  | { type: "knowledge"; stepIndex: number };

export function flattenSteps(steps: QuizData): FlatPanel[] {
  const panels: FlatPanel[] = [];
  steps.forEach((step, stepIndex) => {
    if (step.video) {
      panels.push({ type: "video", stepIndex });
    }
    panels.push({ type: "knowledge", stepIndex });
  });
  return panels;
}

export function getTotalQuestionCount(steps: QuizData): number {
  return steps.reduce((sum, step) => sum + step.questions.length, 0);
}
