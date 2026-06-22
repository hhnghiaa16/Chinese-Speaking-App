import { supabaseAdmin } from '@/lib/supabase';
import { HskLevelDto } from '@/types/hsk';

export async function getHskLevels(): Promise<HskLevelDto[]> {
  const { data, error } = await supabaseAdmin
    .from('hsk_levels')
    .select('id, code, name, description, vocab_count, order_index')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const { data: allQuestions } = await supabaseAdmin
    .from('questions')
    .select('id, hsk_level_id')
    .eq('is_active', true);

  const questionCounts = new Map<string, number>();
  if (allQuestions) {
    for (const q of allQuestions) {
      const count = questionCounts.get(q.hsk_level_id) || 0;
      questionCounts.set(q.hsk_level_id, count + 1);
    }
  }

  return data.map((level) => ({
    id: level.id,
    code: level.code,
    name: level.name,
    description: level.description,
    vocabCount: level.vocab_count,
    questionCount: questionCounts.get(level.id) || 0,
    orderIndex: level.order_index,
  }));
}
