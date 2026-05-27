import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { QuizData, QuizQuestion } from "../lib/quiz-schema";
import { getTotalQuestionCount } from "../lib/flatten-steps";
import { makeQuestionKey, type QuestionKey } from "../lib/question-key";

export type UserAnswer = {
  selectedIndex: number;
  isCorrect: boolean;
};

export type FlatQuestion = {
  flatIndex: number;
  stepIndex: number;
  questionIndex: number;
  stepTitle: string;
  question: QuizQuestion;
  userAnswer?: UserAnswer;
};

type QuizContextValue = {
  steps: QuizData;
  answers: Map<QuestionKey, UserAnswer>;
  recordAnswer: (
    stepIndex: number,
    questionIndex: number,
    selectedIndex: number,
    isCorrect: boolean,
  ) => void;
  getAnswer: (
    stepIndex: number,
    questionIndex: number,
  ) => UserAnswer | undefined;
  flatQuestions: FlatQuestion[];
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  correctStreak: number;
  isComplete: boolean;
  reviewFlatIndex: number;
  setReviewFlatIndex: (index: number) => void;
  reviewStepIndex: number;
  setReviewStepIndex: (index: number) => void;
  summaryOverviewRef: React.RefObject<HTMLElement | null>;
  summaryReviewRef: React.RefObject<HTMLElement | null>;
  scrollToSummary: () => void;
  scrollToReview: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({
  steps,
  children,
}: {
  steps: QuizData;
  children: ReactNode;
}) {
  const [answers, setAnswers] = useState<Map<QuestionKey, UserAnswer>>(
    () => new Map(),
  );
  const [correctStreak, setCorrectStreak] = useState(0);
  const [reviewFlatIndex, setReviewFlatIndex] = useState(0);
  const [reviewStepIndex, setReviewStepIndex] = useState(0);
  const summaryOverviewRef = useRef<HTMLElement | null>(null);
  const summaryReviewRef = useRef<HTMLElement | null>(null);
  const hasScrolledToSummary = useRef(false);

  const totalQuestions = useMemo(() => getTotalQuestionCount(steps), [steps]);

  const flatQuestions = useMemo((): FlatQuestion[] => {
    const list: FlatQuestion[] = [];
    let flatIndex = 0;
    steps.forEach((step, stepIndex) => {
      step.questions.forEach((question, questionIndex) => {
        const key = makeQuestionKey(stepIndex, questionIndex);
        list.push({
          flatIndex,
          stepIndex,
          questionIndex,
          stepTitle: step.title,
          question,
          userAnswer: answers.get(key),
        });
        flatIndex += 1;
      });
    });
    return list;
  }, [steps, answers]);

  const answeredCount = answers.size;
  const correctCount = useMemo(
    () => [...answers.values()].filter((a) => a.isCorrect).length,
    [answers],
  );
  const incorrectCount = answeredCount - correctCount;
  const isComplete = answeredCount === totalQuestions && totalQuestions > 0;

  const recordAnswer = useCallback(
    (
      stepIndex: number,
      questionIndex: number,
      selectedIndex: number,
      isCorrect: boolean,
    ) => {
      const key = makeQuestionKey(stepIndex, questionIndex);
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(key, { selectedIndex, isCorrect });
        return next;
      });
      setCorrectStreak((prev) => (isCorrect ? prev + 1 : 0));
    },
    [],
  );

  const getAnswer = useCallback(
    (stepIndex: number, questionIndex: number) => {
      return answers.get(makeQuestionKey(stepIndex, questionIndex));
    },
    [answers],
  );

  const scrollBehavior = useMemo((): ScrollBehavior => {
    if (typeof window === "undefined") return "smooth";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
  }, []);

  const scrollToSummary = useCallback(() => {
    summaryOverviewRef.current?.scrollIntoView({ behavior: scrollBehavior });
  }, [scrollBehavior]);

  const scrollToReview = useCallback(() => {
    summaryReviewRef.current?.scrollIntoView({ behavior: scrollBehavior });
  }, [scrollBehavior]);

  useEffect(() => {
    if (isComplete && !hasScrolledToSummary.current) {
      hasScrolledToSummary.current = true;
      requestAnimationFrame(() => {
        summaryOverviewRef.current?.scrollIntoView({ behavior: scrollBehavior });
      });
    }
    if (!isComplete) {
      hasScrolledToSummary.current = false;
    }
  }, [isComplete, scrollBehavior]);

  const value: QuizContextValue = {
    steps,
    answers,
    recordAnswer,
    getAnswer,
    flatQuestions,
    totalQuestions,
    answeredCount,
    correctCount,
    incorrectCount,
    correctStreak,
    isComplete,
    reviewFlatIndex,
    setReviewFlatIndex,
    reviewStepIndex,
    setReviewStepIndex,
    summaryOverviewRef,
    summaryReviewRef,
    scrollToSummary,
    scrollToReview,
  };

  return (
    <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return ctx;
}
