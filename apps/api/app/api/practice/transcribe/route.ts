import { NextRequest, NextResponse } from 'next/server';

import { verifyAuthToken } from '@/lib/auth';

import { transcribeAudio } from '@/services/ai/stt/transcribe.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

type TranscribeResponse = {
  text: string;
};

export async function POST(request: NextRequest) {
  const userId = await verifyAuthToken(request);
  if (!userId) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required form field: file' },
      { status: 400 },
    );
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required form field: file' },
      { status: 400 },
    );
  }

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'File size exceeds the 15MB limit' },
      { status: 413 }, // Payload Too Large
    );
  }

  try {
    const data = await transcribeAudio({
      audio: await file.arrayBuffer(),
      mimeType: file.type || 'application/octet-stream',
    });

    return NextResponse.json<ApiSuccessResponse<TranscribeResponse>>({ data });
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to transcribe audio' },
      { status: 500 },
    );
  }
}
