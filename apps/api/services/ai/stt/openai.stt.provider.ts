const OPENAI_AUDIO_TRANSCRIPTIONS_ENDPOINT =
  'https://api.openai.com/v1/audio/transcriptions';

const DEFAULT_OPENAI_STT_MODEL = 'gpt-4o-mini-transcribe';

/**
 * System prompt cho STT tiếng Trung.
 * Hướng dẫn model tập trung vào phiên âm chính xác tiếng Trung phổ thông (Mandarin).
 */
const STT_SYSTEM_PROMPT =
  'Bạn đang phiên âm tiếng Trung phổ thông (Mandarin). ' +
  'Hãy ghi lại chính xác những gì nghe được bằng chữ Hán giản thể (Simplified Chinese). ' +
  'Không thêm dấu câu không cần thiết. Không dịch. Không giải thích.';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOpenAiSttModel() {
  return process.env.OPENAI_STT_MODEL || DEFAULT_OPENAI_STT_MODEL;
}

/**
 * Transcribe audio using OpenAI gpt-4o-mini-transcribe.
 * Nhận audio dưới dạng ArrayBuffer và trả về chuỗi văn bản tiếng Trung.
 */
export async function transcribeWithOpenAi(
  audio: ArrayBuffer,
  mimeType: string,
): Promise<string> {
  const apiKey = getRequiredEnv('OPENAI_API_KEY');
  const model = getOpenAiSttModel();

  // Xác định extension từ mimeType
  const ext = mimeType.includes('webm')
    ? 'webm'
    : mimeType.includes('mp4') || mimeType.includes('m4a')
      ? 'm4a'
      : mimeType.includes('ogg')
        ? 'ogg'
        : mimeType.includes('wav')
          ? 'wav'
          : mimeType.includes('flac')
            ? 'flac'
            : 'mp3';

  const formData = new FormData();
  const blob = new Blob([audio], { type: mimeType });
  formData.append('file', blob, `audio.${ext}`);
  formData.append('model', model);
  formData.append('language', 'zh');
  formData.append('prompt', STT_SYSTEM_PROMPT);
  formData.append('response_format', 'text');

  const response = await fetch(OPENAI_AUDIO_TRANSCRIPTIONS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `OpenAI STT request failed with status ${response.status}: ${errorText}`,
    );
  }

  // response_format=text → plain text response
  const text = await response.text();

  return text.trim();
}
