import { supabaseAdmin } from '@/lib/supabase';
import { QuestionDto } from '@/types/question';

export async function getQuestionsByLevelAndTopic(
  level: string,
  topic: string,
): Promise<QuestionDto[]> {
  const normalizedLevel = level.trim();
  const normalizedTopic = topic.trim();

  if (!normalizedLevel || !normalizedTopic) {
    throw new Error('Level and topic are required.');
  }

  const { data: hskLevel, error: hskError } = await supabaseAdmin
    .from('hsk_levels')
    .select('id, code')
    .eq('code', normalizedLevel)
    .eq('is_active', true)
    .maybeSingle();

  if (hskError) {
    throw new Error(hskError.message);
  }

  const { data: topicRow, error: topicError } = await supabaseAdmin
    .from('topics')
    .select('id, key, emoji, title_vi')
    .eq('key', normalizedTopic)
    .eq('is_active', true)
    .maybeSingle();

  if (topicError) {
    throw new Error(topicError.message);
  }

  if (!hskLevel || !topicRow) {
    return [];
  }

  const { data: questions, error: questionsError } = await supabaseAdmin
    .from('questions')
    .select(
      `
      id,
      question_zh,
      question_pinyin,
      question_vi,
      sample_answer_zh,
      sample_answer_pinyin,
      sample_answer_vi,
      hint_vi,
      difficulty,
      order_index
    `,
    )
    .eq('hsk_level_id', hskLevel.id)
    .eq('topic_id', topicRow.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (questionsError) {
    throw new Error(questionsError.message);
  }

  return questions.map((question) => ({
    id: question.id,
    level: hskLevel.code,
    topic: topicRow.key,
    topicEmoji: topicRow.emoji,
    topicVi: topicRow.title_vi,
    questionZh: question.question_zh,
    questionPinyin: question.question_pinyin,
    questionVi: question.question_vi,
    sampleAnswerZh: question.sample_answer_zh,
    sampleAnswerPinyin: question.sample_answer_pinyin,
    sampleAnswerVi: question.sample_answer_vi,
    hintVi: question.hint_vi,
    difficulty: question.difficulty,
    orderIndex: question.order_index,
  }));
}
