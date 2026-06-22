import { NextRequest, NextResponse } from 'next/server';

import { verifyAuthToken } from '@/lib/auth';
import { HttpError } from '@/lib/http';
import { getProfile, updateProfile } from '@/services/profile.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await getProfile(userId);
    return NextResponse.json<ApiSuccessResponse<typeof data>>({ data });
  } catch (error) {
    console.error('[Profile GET Error]', error);
    if (error instanceof HttpError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = await updateProfile(userId, {
      displayName: body.displayName,
      hskGoal: body.hskGoal,
      ttsVoice: body.ttsVoice,
    });

    return NextResponse.json<ApiSuccessResponse<typeof data>>({ data });
  } catch (error) {
    console.error('[Profile PUT Error]', error);
    if (error instanceof HttpError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
