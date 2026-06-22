import { NextRequest, NextResponse } from 'next/server';

import { verifyAuthToken } from '@/lib/auth';
import { HttpError } from '@/lib/http';
import { completePracticeSession } from '@/services/practice.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { CompletePracticeSessionDto } from '@/types/practice';

type RouteContext = {
  params: Promise<{
    sessionId?: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const userId = await verifyAuthToken(request);
  if (!userId) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { sessionId } = await context.params;

  if (!sessionId) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required route param: sessionId' },
      { status: 400 },
    );
  }

  try {
    const data = await completePracticeSession(sessionId, userId);

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
