import { NextResponse } from 'next/server';

import { getTopics } from '@/services/topics.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { TopicDto } from '@/types/topic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');

    const data = await getTopics(level);

    return NextResponse.json<ApiSuccessResponse<TopicDto[]>>({ data });
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to fetch topics' },
      { status: 500 },
    );
  }
}
