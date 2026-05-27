import { HttpError } from '@/lib/http';
import { supabaseAdmin } from '@/lib/supabase';
import { gradeAnswerWithAi } from '@/services/ai/ai.service';
import {
  CreatePracticeSessionInput,
  CompletePracticeSessionDto,
  GradePracticeAnswerDto,
  GradePracticeAnswerInput,
  PracticeSessionDto,
} from '@/types/practice';

function roundAverageScore(score: number) {
  return Math.round(score * 10) / 10;
}

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

export async function gradePracticeAnswer(
  input: GradePracticeAnswerInput,
): Promise<GradePracticeAnswerDto> {
  const sessionId = input.sessionId.trim();
  const questionId = input.questionId.trim();
  const userAnswerZh = input.userAnswerZh.trim();

  if (!sessionId || !questionId || !userAnswerZh) {
    throw new HttpError('Missing required fields: sessionId, questionId and userAnswerZh', 400);
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('practice_sessions')
    .select('id')
    .eq('id', sessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    throw new HttpError('Practice session not found', 404);
  }

  const { data: question, error: questionError } = await supabaseAdmin
    .from('questions')
    .select(
      `
      id,
      hsk_level_id,
      topic_id,
      question_zh,
      question_pinyin,
      question_vi,
      sample_answer_zh,
      sample_answer_vi
    `,
    )
    .eq('id', questionId)
    .maybeSingle();

  if (questionError) {
    throw new Error(questionError.message);
  }

  if (!question) {
    throw new HttpError('Question not found', 404);
  }

  const { data: hskLevel, error: hskError } = await supabaseAdmin
    .from('hsk_levels')
    .select('code')
    .eq('id', question.hsk_level_id)
    .maybeSingle();

  if (hskError) {
    throw new Error(hskError.message);
  }

  const { data: topic, error: topicError } = await supabaseAdmin
    .from('topics')
    .select('title_vi')
    .eq('id', question.topic_id)
    .maybeSingle();

  if (topicError) {
    throw new Error(topicError.message);
  }

  if (!hskLevel || !topic) {
    throw new HttpError('Question metadata not found', 404);
  }

  const result = await gradeAnswerWithAi({
    level: hskLevel.code,
    topicVi: topic.title_vi,
    questionZh: question.question_zh,
    questionPinyin: question.question_pinyin,
    questionVi: question.question_vi,
    sampleAnswerZh: question.sample_answer_zh,
    sampleAnswerVi: question.sample_answer_vi,
    userAnswerZh,
  });

  const { error: insertError } = await supabaseAdmin.from('practice_answers').insert({
    session_id: session.id,
    question_id: question.id,
    user_answer_zh: userAnswerZh,
    score: result.score,
    is_relevant: result.isRelevant,
    short_feedback_vi: result.shortFeedbackVi,
    grammar_feedback_vi: result.grammarFeedbackVi,
    vocabulary_feedback_vi: result.vocabularyFeedbackVi,
    improved_answer_zh: result.improvedAnswerZh,
    improved_answer_pinyin: result.improvedAnswerPinyin,
    improved_answer_vi: result.improvedAnswerVi,
    suggestion_vi: result.suggestionVi,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return result;
}

export async function completePracticeSession(
  sessionIdInput: string,
): Promise<CompletePracticeSessionDto> {
  const sessionId = sessionIdInput.trim();

  if (!sessionId) {
    throw new HttpError('Missing required route param: sessionId', 400);
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('practice_sessions')
    .select('id, total_questions')
    .eq('id', sessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    throw new HttpError('Practice session not found', 404);
  }

  const { data: answers, error: answersError } = await supabaseAdmin
    .from('practice_answers')
    .select('score')
    .eq('session_id', session.id);

  if (answersError) {
    throw new Error(answersError.message);
  }

  const answeredQuestions = answers.length;
  const scoreValues = answers
    .map((answer) => answer.score)
    .filter((score): score is number => typeof score === 'number');
  const averageScore =
    scoreValues.length === 0
      ? 0
      : roundAverageScore(
          scoreValues.reduce((total, score) => total + score, 0) / scoreValues.length,
        );
  const completedAt = new Date().toISOString();
  const { data: updatedSession, error: updateError } = await supabaseAdmin
    .from('practice_sessions')
    .update({
      answered_questions: answeredQuestions,
      average_score: averageScore,
      completed_at: completedAt,
    })
    .eq('id', session.id)
    .select('id, total_questions, answered_questions, average_score')
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    sessionId: updatedSession.id,
    totalQuestions: updatedSession.total_questions,
    answeredQuestions: updatedSession.answered_questions,
    averageScore: updatedSession.average_score ?? 0,
  };
}
