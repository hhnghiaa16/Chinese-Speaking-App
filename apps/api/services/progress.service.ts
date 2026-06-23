import { supabaseAdmin } from '@/lib/supabase';

export type ProgressSummaryDto = {
  totalSessions: number;
  averageScore: number;
  totalQuestions: number;
  streakDays: number;
  hskProgress: {
    level: string;
    percent: number;
    practicedQuestions: number;
    totalQuestions: number;
  }[];
  recentPractice: {
    level: string;
    topicKey: string;
    topicEmoji: string;
    topicVi: string;
    questions: number;
    score: number;
    suggestionVi: string | null;
  } | null;
};

export async function getProgressSummary(userId: string): Promise<ProgressSummaryDto> {
  // 1. Total Sessions & Average Score & Total Questions
  const { data: sessions } = await supabaseAdmin
    .from('practice_sessions')
    .select('id, average_score, answered_questions, started_at')
    .eq('user_id', userId)
    .not('completed_at', 'is', null);

  const totalSessions = sessions?.length || 0;
  
  let averageScore = 0;
  let totalQuestions = 0;
  
  if (sessions && sessions.length > 0) {
    const scores = sessions.map(s => s.average_score).filter((s): s is number => s !== null);
    if (scores.length > 0) {
      averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    }
    totalQuestions = sessions.reduce((sum, s) => sum + (s.answered_questions || 0), 0);
  }

  // 2. Streak Days
  const { data: allSessions } = await supabaseAdmin
    .from('practice_sessions')
    .select('started_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });

  let streakDays = 0;
  if (allSessions && allSessions.length > 0) {
    const dates = [...new Set(allSessions.map(s => new Date(s.started_at).toISOString().split('T')[0]))];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let currentDate = new Date(todayStr);
    let streakCount = 0;

    let startIndex = 0;
    if (dates[0] === todayStr) {
      streakCount = 1;
      startIndex = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (dates[0] === yesterdayStr) {
        streakCount = 1;
        startIndex = 1;
        currentDate.setDate(currentDate.getDate() - 2);
      } else {
        streakCount = 0;
      }
    }

    if (streakCount > 0) {
      for (let i = startIndex; i < dates.length; i++) {
        if (dates[i] === currentDate.toISOString().split('T')[0]) {
          streakCount++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    streakDays = streakCount;
  }

  // 3. HSK Progress
  const { data: hskLevels } = await supabaseAdmin
    .from('hsk_levels')
    .select('id, code')
    .eq('is_active', true)
    .order('code', { ascending: true });

  const { data: allQuestions } = await supabaseAdmin
    .from('questions')
    .select('id, hsk_level_id')
    .eq('is_active', true);

  // Lấy các câu trả lời của user này
  const { data: answeredData } = await supabaseAdmin
    .from('practice_answers')
    .select('question_id, practice_sessions!inner(user_id)')
    .eq('practice_sessions.user_id', userId);

  const answeredQuestionIds = new Set((answeredData || []).map(a => a.question_id));

  const hskProgress = (hskLevels || []).map(level => {
    const levelQuestions = (allQuestions || []).filter(q => q.hsk_level_id === level.id);
    const totalQ = levelQuestions.length;
    
    let practicedQ = 0;
    for (const q of levelQuestions) {
      if (answeredQuestionIds.has(q.id)) {
        practicedQ++;
      }
    }

    const percent = totalQ > 0 ? Math.round((practicedQ / totalQ) * 100) : 0;

    return {
      level: level.code,
      percent,
      practicedQuestions: practicedQ,
      totalQuestions: totalQ,
    };
  });

  // 4. Recent Practice
  const { data: recentSession } = await supabaseAdmin
    .from('practice_sessions')
    .select(`
      id,
      answered_questions,
      average_score,
      hsk_levels ( code ),
      topics ( key, title_vi, emoji )
    `)
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let recentPractice = null;
  if (recentSession) {
    // @ts-ignore - Supabase join types can be tricky
    const hskLevel = recentSession.hsk_levels as any;
    // @ts-ignore
    const topic = recentSession.topics as any;
    
    // Fetch the last answer's suggestion for this session
    const { data: lastAnswer } = await supabaseAdmin
      .from('practice_answers')
      .select('suggestion_vi')
      .eq('session_id', recentSession.id)
      .limit(1)
      .maybeSingle();

    recentPractice = {
      level: hskLevel?.code || 'N/A',
      topicKey: topic?.key || '',
      topicEmoji: topic?.emoji || '📚',
      topicVi: topic?.title_vi || 'Chủ đề',
      questions: recentSession.answered_questions || 0,
      score: recentSession.average_score ? Math.round(recentSession.average_score * 10) / 10 : 0,
      suggestionVi: lastAnswer?.suggestion_vi || null,
    };
  } else {
    recentPractice = {
      level: 'Chưa có',
      topicKey: '',
      topicEmoji: '🚀',
      topicVi: 'Bắt đầu bài học đầu tiên',
      questions: 0,
      score: 0,
      suggestionVi: null,
    };
  }

  return {
    totalSessions,
    averageScore,
    totalQuestions,
    streakDays,
    hskProgress,
    recentPractice,
  };
}
