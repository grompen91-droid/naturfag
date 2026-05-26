export type SummaryWrongAnswer = {
  question: string;
  picked: string;
  correct: string;
};

export type SummarySection = {
  title: string;
  correct: number;
  incorrect: number;
  wrongAnswers: SummaryWrongAnswer[];
};

export type SummaryRequestBody = {
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  sections: SummarySection[];
};

export type SummaryResponseBody =
  | { available: true; summary: string }
  | { available: false; reason: string };
