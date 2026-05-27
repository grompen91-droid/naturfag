import type { QuizData } from "./quiz-schema";

/** Fisher–Yates shuffle; mutates and returns the same array. */
function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Randomize question order within each step (sections unchanged). */
export function shuffleQuizQuestions(steps: QuizData): QuizData {
  return steps.map((step) => ({
    ...step,
    questions: shuffleInPlace([...step.questions]),
  }));
}
