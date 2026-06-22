import { NextRequest, NextResponse } from 'next/server';

import { verifyAuthToken } from '@/lib/auth';
import { getProgressSummary } from '@/services/progress.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyAuthToken(req);
    if (!userId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await getProgressSummary(userId);

    return NextResponse.json<ApiSuccessResponse<typeof data>>({ data });
  } catch (error) {
    console.error('[Progress API Error]', error);
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to fetch progress summary' },
      { status: 500 },
    );
  }
}
