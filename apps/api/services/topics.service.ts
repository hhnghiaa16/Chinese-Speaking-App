import { supabaseAdmin } from '@/lib/supabase';
import { TopicDto } from '@/types/topic';

export async function getTopics(levelCode?: string | null): Promise<TopicDto[]> {
  const { data, error } = await supabaseAdmin
    .from('topics')
    .select('id, key, title_zh, title_vi, description_vi, emoji, order_index')
    .eq('is_active', true);

  if (error) {
    throw new Error(error.message);
  }

  let sortedTopics = [...data];

  if (levelCode) {
    // Lấy ID của HSK Level
    const { data: levelData } = await supabaseAdmin
      .from('hsk_levels')
      .select('id')
      .eq('code', levelCode)
      .single();

    if (levelData) {
      // Đếm số câu hỏi của mỗi topic cho level này
      const { data: questions } = await supabaseAdmin
        .from('questions')
        .select('topic_id')
        .eq('hsk_level_id', levelData.id)
        .eq('is_active', true);

      const counts = new Map<string, number>();
      if (questions) {
        for (const q of questions) {
          counts.set(q.topic_id, (counts.get(q.topic_id) || 0) + 1);
        }
      }

      sortedTopics.sort((a, b) => {
        const hasQuestionsA = (counts.get(a.id) || 0) > 0 ? 1 : 0;
        const hasQuestionsB = (counts.get(b.id) || 0) > 0 ? 1 : 0;

        // Những topic có câu hỏi được đưa lên đầu
        if (hasQuestionsA !== hasQuestionsB) {
          return hasQuestionsB - hasQuestionsA;
        }

        // Sau đó sort theo độ ưu tiên (đơn giản lên đầu)
        return (a.order_index ?? 999) - (b.order_index ?? 999);
      });
    } else {
      sortedTopics.sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
    }
  } else {
    sortedTopics.sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
  }

  return sortedTopics.map((topic) => ({
    id: topic.id,
    key: topic.key,
    titleZh: topic.title_zh ?? '',
    titleVi: topic.title_vi,
    descriptionVi: topic.description_vi,
    emoji: topic.emoji,
    orderIndex: topic.order_index,
  }));
}
