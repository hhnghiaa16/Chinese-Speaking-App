import { NextResponse } from 'next/server';

import { getTopics } from '@/services/topics.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { TopicDto } from '@/types/topic';

export async function GET() {
  try {
    const data = await getTopics();

    return NextResponse.json<ApiSuccessResponse<TopicDto[]>>({ data });
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to fetch topics' },
      { status: 500 },
    );
  }
}
