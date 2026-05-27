import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getQuestionsByLevelAndTopic } from '@/services/questions.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { QuestionDto } from '@/types/question';

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level')?.trim();
  const topic = request.nextUrl.searchParams.get('topic')?.trim();

  if (!level || !topic) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required query params: level and topic' },
      { status: 400 },
    );
  }

  try {
    const data = await getQuestionsByLevelAndTopic(level, topic);

    return NextResponse.json<ApiSuccessResponse<QuestionDto[]>>({ data });
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to fetch questions' },
      { status: 500 },
    );
  }
}
