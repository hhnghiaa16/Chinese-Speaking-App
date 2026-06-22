import { NextRequest, NextResponse } from 'next/server';

import { gradeAnswerWithAi } from '@/services/ai/ai.service';
import { GradeAnswerInput, GradeAnswerResult } from '@/services/ai/ai.types';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

type AiGradeRequestBody = {
  level?: unknown;
  topicVi?: unknown;
  questionZh?: unknown;
  questionPinyin?: unknown;
  questionVi?: unknown;
  userAnswerZh?: unknown;
};

export async function POST(request: NextRequest) {
  let body: AiGradeRequestBody;

  try {
    body = (await request.json()) as AiGradeRequestBody;
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (
    typeof body.level !== 'string' ||
    typeof body.topicVi !== 'string' ||
    typeof body.questionZh !== 'string' ||
    typeof body.userAnswerZh !== 'string'
  ) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required fields: level, topicVi, questionZh, userAnswerZh' },
      { status: 400 },
    );
  }

  const input: GradeAnswerInput = {
    level: body.level.trim(),
    topicVi: body.topicVi.trim(),
    questionZh: body.questionZh.trim(),
    questionPinyin: typeof body.questionPinyin === 'string' ? body.questionPinyin.trim() : null,
    questionVi: typeof body.questionVi === 'string' ? body.questionVi.trim() : null,
    sampleAnswerZh: null,
    sampleAnswerVi: null,
    userAnswerZh: body.userAnswerZh.trim(),
  };

  if (!input.level || !input.topicVi || !input.questionZh || !input.userAnswerZh) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Fields must not be empty: level, topicVi, questionZh, userAnswerZh' },
      { status: 400 },
    );
  }

  try {
    const result = await gradeAnswerWithAi(input);

    return NextResponse.json<ApiSuccessResponse<GradeAnswerResult>>({ data: result });
  } catch (error) {
    console.error('[AI Grade] Failed to grade answer', error);

    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to grade answer' },
      { status: 500 },
    );
  }
}
