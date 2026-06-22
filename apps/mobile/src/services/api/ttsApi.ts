import { apiPost } from './apiClient';

export type TtsApiInput = {
  text: string;
  language?: string;
  voice?: string;
};

export type TtsApiDto = {
  audioBase64: string;
  mimeType: string;
};

export async function synthesizeSpeechFromApi(input: TtsApiInput): Promise<TtsApiDto> {
  return apiPost<TtsApiDto>('/api/practice/tts', {
    text: input.text,
    language: input.language ?? 'zh-CN',
    voice: input.voice,
  });
}
