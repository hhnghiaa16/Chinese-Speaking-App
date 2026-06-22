import { NextRequest, NextResponse } from 'next/server';

import { synthesizeSpeech } from '@/services/ai/tts/tts.service';
import { TtsResult } from '@/services/ai/tts/tts.types';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

type TtsRequestBody = {
  text?: unknown;
  language?: unknown;
  voice?: unknown;
};

function validateText(text: unknown) {
  if (typeof text !== 'string' || !text.trim()) {
    return 'Text is required';
  }

  if (text.trim().length > 300) {
    return 'Text is too long';
  }

  return null;
}

import { verifyAuthToken } from '@/lib/auth';
import { getProfile } from '@/services/profile.service';

export async function POST(request: NextRequest) {
  const userId = await verifyAuthToken(request);

  let body: TtsRequestBody;

  try {
    body = (await request.json()) as TtsRequestBody;
  } catch {
    return NextResponse.json<ApiErrorResponse>({ error: 'Text is required' }, { status: 400 });
  }

  const validationError = validateText(body.text);

  if (validationError) {
    return NextResponse.json<ApiErrorResponse>({ error: validationError }, { status: 400 });
  }

  let voice = typeof body.voice === 'string' && body.voice !== 'default' ? body.voice : undefined;

  if (!voice && userId) {
    try {
      const profile = await getProfile(userId);
      if (profile.ttsVoice) {
        voice = profile.ttsVoice;
      }
      console.log(`[TTS] Fetched profile voice for user ${userId}: ${voice}`);
    } catch (e) {
      console.warn('[TTS] Could not fetch profile voice', e);
    }
  }

  console.log(`[TTS] Synthesizing speech with voice: ${voice || 'default (alloy)'}`);

  try {
    const result = await synthesizeSpeech({
      text: body.text as string,
      language: typeof body.language === 'string' ? body.language : undefined,
      voice,
    });

    return NextResponse.json<ApiSuccessResponse<TtsResult>>({ data: result });
  } catch (error) {
    console.warn('[TTS] Failed to synthesize speech', error);

    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to synthesize speech' },
      { status: 500 },
    );
  }
}
