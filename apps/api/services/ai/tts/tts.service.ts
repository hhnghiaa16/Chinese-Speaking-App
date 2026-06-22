import { synthesizeWithOpenAiTts } from './providers/openaiTts.provider';
import { TtsInput, TtsResult } from './tts.types';

const MAX_TTS_TEXT_LENGTH = 300;

export async function synthesizeSpeech(input: TtsInput): Promise<TtsResult> {
  if (typeof input.text !== 'string') {
    throw new Error('Text is required');
  }

  const text = input.text.trim();

  if (!text) {
    throw new Error('Text is required');
  }

  if (text.length > MAX_TTS_TEXT_LENGTH) {
    throw new Error('Text is too long');
  }

  return synthesizeWithOpenAiTts({
    ...input,
    text,
  });
}
