import { NextRequest, NextResponse } from 'next/server';

import { HttpError } from '@/lib/http';
import { gradePracticeAnswer } from '@/services/practice.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { GradePracticeAnswerBody, GradePracticeAnswerDto } from '@/types/practice';

export async function POST(request: NextRequest) {
  let body: GradePracticeAnswerBody;

  try {
    body = (await request.json()) as GradePracticeAnswerBody;
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required fields: sessionId, questionId and userAnswerZh' },
      { status: 400 },
    );
  }

  if (
    typeof body.sessionId !== 'string' ||
    typeof body.questionId !== 'string' ||
    typeof body.userAnswerZh !== 'string'
  ) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required fields: sessionId, questionId and userAnswerZh' },
      { status: 400 },
    );
  }

  try {
    const data = await gradePracticeAnswer({
      sessionId: body.sessionId,
      questionId: body.questionId,
      userAnswerZh: body.userAnswerZh,
    });

    return NextResponse.json<ApiSuccessResponse<GradePracticeAnswerDto>>({ data });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to grade practice answer' },
      { status: 500 },
    );
  }
}
