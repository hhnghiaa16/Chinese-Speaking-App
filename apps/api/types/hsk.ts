export type HskLevelDto = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  vocabCount: number | null;
  questionCount: number;
  orderIndex: number;
};
