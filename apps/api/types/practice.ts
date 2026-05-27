export type CreatePracticeSessionBody = {
  level?: unknown;
  topic?: unknown;
};

export type CreatePracticeSessionInput = {
  level: string;
  topic: string;
};

export type PracticeSessionDto = {
  sessionId: string;
  level: string;
  topic: string;
  totalQuestions: number;
  startedAt: string;
};

export type GradePracticeAnswerBody = {
  sessionId?: unknown;
  questionId?: unknown;
  userAnswerZh?: unknown;
};

export type GradePracticeAnswerInput = {
  sessionId: string;
  questionId: string;
  userAnswerZh: string;
};

export type GradePracticeAnswerDto = {
  score: number;
  isRelevant: boolean;
  shortFeedbackVi: string;
  grammarFeedbackVi: string;
  vocabularyFeedbackVi: string;
  improvedAnswerZh: string;
  improvedAnswerPinyin: string;
  improvedAnswerVi: string;
  suggestionVi: string;
};

export type CompletePracticeSessionDto = {
  sessionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  averageScore: number;
};
