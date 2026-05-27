export type HskLevelApiDto = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  vocabCount: number | null;
  orderIndex: number;
};

export type TopicApiDto = {
  id: string;
  key: string;
  titleZh: string;
  titleVi: string;
  descriptionVi: string | null;
  emoji: string | null;
  orderIndex: number;
};

export type QuestionApiDto = {
  id: string;
  level: string;
  topic: string;
  topicEmoji: string | null;
  topicVi: string;
  questionZh: string;
  questionPinyin: string | null;
  questionVi: string | null;
  sampleAnswerZh: string | null;
  sampleAnswerPinyin: string | null;
  sampleAnswerVi: string | null;
  hintVi: string | null;
  difficulty: number;
  orderIndex: number;
};

export type ProgressApiDto = {
  totalSessions: number;
  averageScore: number;
  totalQuestions: number;
  streakDays: number;
  hskProgress: Array<{
    level: string;
    percent: number;
    practicedQuestions: number;
    totalQuestions: number;
  }>;
  recentPractice: {
    level: string;
    topicEmoji: string;
    topicVi: string;
    questions: number;
    score: number;
  };
};
