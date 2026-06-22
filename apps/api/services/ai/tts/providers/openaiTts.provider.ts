import { TtsInput, TtsResult } from '../tts.types';

const OPENAI_TTS_ENDPOINT = 'https://api.openai.com/v1/audio/speech';
const DEFAULT_OPENAI_TTS_MODEL = 'gpt-4o-mini-tts';
const DEFAULT_OPENAI_TTS_VOICE = 'alloy';

/**
 * System prompt cho TTS tiếng Trung.
 * Hướng dẫn model đọc tiếng Trung phổ thông rõ ràng, tốc độ phù hợp cho người học.
 */
const TTS_INSTRUCTIONS =
  'Đọc văn bản tiếng Trung phổ thông (Mandarin) với phát âm rõ ràng, ' +
  'tốc độ vừa phải phù hợp cho người học HSK. ' +
  'Giọng đọc tự nhiên, thân thiện và dễ nghe.';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOpenAiTtsModel() {
  return process.env.OPENAI_TTS_MODEL || DEFAULT_OPENAI_TTS_MODEL;
}

function getVoiceName(voice?: string) {
  const trimmedVoice = voice?.trim();

  if (!trimmedVoice || trimmedVoice === 'default') {
    return DEFAULT_OPENAI_TTS_VOICE;
  }

  return trimmedVoice;
}

/**
 * Tổng hợp giọng nói bằng OpenAI gpt-4o-mini-tts.
 * Trả về audio dưới dạng base64 WAV.
 */
export async function synthesizeWithOpenAiTts(input: TtsInput): Promise<TtsResult> {
  const apiKey = getRequiredEnv('OPENAI_API_KEY');
  const model = getOpenAiTtsModel();
  const voice = getVoiceName(input.voice);

  const requestBody: Record<string, unknown> = {
    model,
    input: input.text,
    voice,
    response_format: 'mp3',
    instructions: TTS_INSTRUCTIONS,
  };

  const response = await fetch(OPENAI_TTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `OpenAI TTS request failed with status ${response.status}: ${errorText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

  return {
    audioBase64,
    mimeType: 'audio/mpeg',
  };
}
