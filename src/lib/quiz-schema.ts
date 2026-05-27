import { z } from "zod";
import { resolveVideoUrl } from "./resolve-video-url";
import { shuffleQuizQuestions } from "./shuffle-questions";

const questionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  answer: z.number().int().nonnegative(),
});

const stepSchema = z
  .object({
    video: z.string().min(1).optional(),
    title: z.string().min(1),
    body: z.array(z.string()).min(1),
    questions: z.array(questionSchema).min(1),
  })
  .superRefine((step, ctx) => {
    step.questions.forEach((q, qi) => {
      if (q.answer >= q.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `answer index ${q.answer} out of range for question ${qi}`,
          path: ["questions", qi, "answer"],
        });
      }
    });
  });

export const quizSchema = z.array(stepSchema).min(1);

export type QuizStep = z.infer<typeof stepSchema>;
export type QuizQuestion = z.infer<typeof questionSchema>;
export type QuizData = z.infer<typeof quizSchema>;

export async function loadQuiz(): Promise<QuizData> {
  const res = await fetch("/quiz.json");
  if (!res.ok) {
    throw new Error(`Failed to load quiz.json: ${res.status}`);
  }
  const json: unknown = await res.json();
  const steps = quizSchema.parse(json);
  const withVideos = steps.map((step) =>
    step.video ? { ...step, video: resolveVideoUrl(step.video) } : step,
  );
  return shuffleQuizQuestions(withVideos);
}
