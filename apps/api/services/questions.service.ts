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

  // Fetch answered questions
  const { data: answeredData } = await supabaseAdmin
    .from('practice_answers')
    .select('question_id');

  const answeredIds = new Set((answeredData || []).map((row) => row.question_id));

  // Phân loại câu hỏi
  const unansweredQuestions = questions.filter((q) => !answeredIds.has(q.id));
  const answeredQuestionsList = questions.filter((q) => answeredIds.has(q.id));

  // Xáo trộn mảng (Fisher-Yates)
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const shuffledUnanswered = shuffle(unansweredQuestions);
  
  let selectedQuestions = [];

  if (shuffledUnanswered.length >= 5) {
    selectedQuestions = shuffledUnanswered.slice(0, 5);
  } else {
    // Nếu không đủ 5 câu chưa làm, lấy tất cả câu chưa làm và bù thêm bằng các câu đã làm
    selectedQuestions = [...shuffledUnanswered];
    const shuffledAnswered = shuffle(answeredQuestionsList);
    const remainingNeeded = 5 - selectedQuestions.length;
    selectedQuestions = [...selectedQuestions, ...shuffledAnswered.slice(0, remainingNeeded)];
  }

  // Trả về theo thứ tự để vẫn có chút logic từ dễ đến khó nếu có order_index
  selectedQuestions.sort((a, b) => a.order_index - b.order_index);

  return selectedQuestions.map((question) => ({
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
