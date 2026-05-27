import { HSKLevel, PracticeQuestion, TopicKey } from '../../data/questions';
import { apiGet } from './apiClient';
import { QuestionApiDto } from './types';

export type MobilePracticeQuestion = PracticeQuestion & {
  difficulty: number;
};

function toHskLevel(level: string): HSKLevel {
  return level as HSKLevel;
}

function toTopicKey(topic: string): TopicKey {
  return topic as TopicKey;
}

export async function getQuestionsFromApi(
  level: string,
  topic: string,
): Promise<MobilePracticeQuestion[]> {
  const encodedLevel = encodeURIComponent(level);
  const encodedTopic = encodeURIComponent(topic);
  const questions = await apiGet<QuestionApiDto[]>(
    `/api/questions?level=${encodedLevel}&topic=${encodedTopic}`,
  );

  return questions.map((question) => ({
    id: question.id,
    hsk_level: toHskLevel(question.level),
    topic: toTopicKey(question.topic),
    topicEmoji: question.topicEmoji ?? '',
    topicVi: question.topicVi,
    question_zh: question.questionZh,
    pinyin: question.questionPinyin ?? '',
    meaning_vi: question.questionVi ?? '',
    sample_answer_zh: question.sampleAnswerZh ?? '',
    sample_answer_pinyin: question.sampleAnswerPinyin ?? '',
    sample_answer_vi: question.sampleAnswerVi ?? '',
    hint_vi: question.hintVi ?? '',
    difficulty: question.difficulty,
  }));
}
