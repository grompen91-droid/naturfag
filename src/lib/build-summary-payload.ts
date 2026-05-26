import type { QuizData } from "./quiz-schema";
import type { UserAnswer } from "../context/QuizProvider";
import { makeQuestionKey, type QuestionKey } from "./question-key";
import type { SummaryRequestBody } from "./summary-types";

export function buildSummaryPayload(
  steps: QuizData,
  answers: Map<QuestionKey, UserAnswer>,
  correctCount: number,
  incorrectCount: number,
  totalQuestions: number,
): SummaryRequestBody {
  const sections = steps.map((step, stepIndex) => {
    let sectionCorrect = 0;
    let sectionIncorrect = 0;
    const wrongAnswers: SummaryRequestBody["sections"][number]["wrongAnswers"] = [];

    step.questions.forEach((question, questionIndex) => {
      const answer = answers.get(makeQuestionKey(stepIndex, questionIndex));
      if (!answer) return;

      if (answer.isCorrect) {
        sectionCorrect += 1;
      } else {
        sectionIncorrect += 1;
        const picked = question.options[answer.selectedIndex] ?? "Ukjent svar";
        const correct = question.options[question.answer] ?? "Ukjent svar";
        wrongAnswers.push({
          question: question.text,
          picked,
          correct,
        });
      }
    });

    return {
      title: step.title,
      correct: sectionCorrect,
      incorrect: sectionIncorrect,
      wrongAnswers,
    };
  });

  return {
    score: {
      correct: correctCount,
      incorrect: incorrectCount,
      total: totalQuestions,
    },
    sections,
  };
}
