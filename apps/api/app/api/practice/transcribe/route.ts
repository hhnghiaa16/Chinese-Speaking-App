import { NextRequest, NextResponse } from 'next/server';

import { transcribeAudio } from '@/services/ai/stt/transcribe.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

type TranscribeResponse = {
  text: string;
};

export async function POST(request: NextRequest) {
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
