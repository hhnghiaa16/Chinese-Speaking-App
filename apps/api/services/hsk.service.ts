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

  return data.map((level) => ({
    id: level.id,
    code: level.code,
    name: level.name,
    description: level.description,
    vocabCount: level.vocab_count,
    orderIndex: level.order_index,
  }));
}
