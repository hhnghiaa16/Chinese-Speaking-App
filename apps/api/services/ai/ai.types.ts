export type GradeAnswerInput = {
  level: string;
  topicVi: string;
  questionZh: string;
  questionPinyin: string | null;
  questionVi: string | null;
  sampleAnswerZh: string | null;
  sampleAnswerVi: string | null;
  userAnswerZh: string;
};

export type GradeAnswerResult = {
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

export type AiProvider = 'gemini';
