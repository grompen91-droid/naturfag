export type QuestionKey = `${number}-${number}`;

export function makeQuestionKey(
  stepIndex: number,
  questionIndex: number,
): QuestionKey {
  return `${stepIndex}-${questionIndex}`;
}

export function parseQuestionKey(key: QuestionKey): {
  stepIndex: number;
  questionIndex: number;
} {
  const [step, question] = key.split("-").map(Number);
  return { stepIndex: step, questionIndex: question };
}
