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
