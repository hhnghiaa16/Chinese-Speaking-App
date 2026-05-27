import { NextRequest, NextResponse } from 'next/server';

import { HttpError } from '@/lib/http';
import { completePracticeSession } from '@/services/practice.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { CompletePracticeSessionDto } from '@/types/practice';

type RouteContext = {
  params: Promise<{
    sessionId?: string;
  }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  const { sessionId } = await context.params;

  if (!sessionId) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required route param: sessionId' },
      { status: 400 },
    );
  }

  try {
    const data = await completePracticeSession(sessionId);

    return NextResponse.json<ApiSuccessResponse<CompletePracticeSessionDto>>({ data });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to complete practice session' },
      { status: 500 },
    );
  }
}
