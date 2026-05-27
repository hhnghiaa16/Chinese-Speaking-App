export type QuestionDto = {
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
