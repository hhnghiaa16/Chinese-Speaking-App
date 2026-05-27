import { NextResponse } from 'next/server';

import { getHskLevels } from '@/services/hsk.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';
import { HskLevelDto } from '@/types/hsk';

export async function GET() {
  try {
    const data = await getHskLevels();

    return NextResponse.json<ApiSuccessResponse<HskLevelDto[]>>({ data });
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to fetch HSK levels' },
      { status: 500 },
    );
  }
}
