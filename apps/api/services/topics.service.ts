import { supabaseAdmin } from '@/lib/supabase';
import { TopicDto } from '@/types/topic';

export async function getTopics(): Promise<TopicDto[]> {
  const { data, error } = await supabaseAdmin
    .from('topics')
    .select('id, key, title_zh, title_vi, description_vi, emoji, order_index')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((topic) => ({
    id: topic.id,
    key: topic.key,
    titleZh: topic.title_zh ?? '',
    titleVi: topic.title_vi,
    descriptionVi: topic.description_vi,
    emoji: topic.emoji,
    orderIndex: topic.order_index,
  }));
}
