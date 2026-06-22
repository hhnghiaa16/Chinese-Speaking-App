import { NextRequest, NextResponse } from 'next/server';

import { verifyAuthToken } from '@/lib/auth';
import { HttpError } from '@/lib/http';
import { createPracticeSession } from '@/services/practice.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { CreatePracticeSessionBody, PracticeSessionDto } from '@/types/practice';

export async function POST(request: NextRequest) {
  const userId = await verifyAuthToken(request);
  if (!userId) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let body: CreatePracticeSessionBody;

  try {
    body = (await request.json()) as CreatePracticeSessionBody;
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required fields: level and topic' },
      { status: 400 },
    );
  }

  if (typeof body.level !== 'string' || typeof body.topic !== 'string') {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required fields: level and topic' },
      { status: 400 },
    );
  }

  try {
    const data = await createPracticeSession({
      userId,
      level: body.level,
      topic: body.topic,
    });

    return NextResponse.json<ApiSuccessResponse<PracticeSessionDto>>({ data });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to create practice session' },
      { status: 500 },
    );
  }
}
