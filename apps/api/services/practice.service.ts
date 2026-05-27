import { HttpError } from '@/lib/http';
import { supabaseAdmin } from '@/lib/supabase';
import { CreatePracticeSessionInput, PracticeSessionDto } from '@/types/practice';

export async function createPracticeSession(
  input: CreatePracticeSessionInput,
): Promise<PracticeSessionDto> {
  const level = input.level.trim();
  const topic = input.topic.trim();

  if (!level || !topic) {
    throw new HttpError('Missing required fields: level and topic', 400);
  }

  const { data: hskLevel, error: hskError } = await supabaseAdmin
    .from('hsk_levels')
    .select('id, code')
    .eq('code', level)
    .maybeSingle();

  if (hskError) {
    throw new Error(hskError.message);
  }

  const { data: topicRow, error: topicError } = await supabaseAdmin
    .from('topics')
    .select('id, key')
    .eq('key', topic)
    .maybeSingle();

  if (topicError) {
    throw new Error(topicError.message);
  }

  if (!hskLevel || !topicRow) {
    throw new HttpError('Level or topic not found', 404);
  }

  const { count: totalQuestions, error: countError } = await supabaseAdmin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('hsk_level_id', hskLevel.id)
    .eq('topic_id', topicRow.id)
    .eq('is_active', true);

  if (countError) {
    throw new Error(countError.message);
  }

  const startedAt = new Date().toISOString();
  const { data: session, error: insertError } = await supabaseAdmin
    .from('practice_sessions')
    .insert({
      user_id: null,
      hsk_level_id: hskLevel.id,
      topic_id: topicRow.id,
      total_questions: totalQuestions ?? 0,
      answered_questions: 0,
      average_score: null,
      started_at: startedAt,
    })
    .select('id, total_questions, started_at')
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return {
    sessionId: session.id,
    level: hskLevel.code,
    topic: topicRow.key,
    totalQuestions: session.total_questions,
    startedAt: session.started_at,
  };
}
