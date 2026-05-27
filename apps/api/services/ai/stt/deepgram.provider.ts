import { DeepgramTranscriptionResponse } from './stt.types';

const DEFAULT_DEEPGRAM_MODEL = 'nova-2';
const DEFAULT_DEEPGRAM_LANGUAGE = 'zh-CN';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function buildDeepgramUrl() {
  const url = new URL('https://api.deepgram.com/v1/listen');

  url.searchParams.set('model', process.env.DEEPGRAM_STT_MODEL || DEFAULT_DEEPGRAM_MODEL);
  url.searchParams.set(
    'language',
    process.env.DEEPGRAM_STT_LANGUAGE || DEFAULT_DEEPGRAM_LANGUAGE,
  );
  url.searchParams.set('smart_format', 'true');
  url.searchParams.set('punctuate', 'true');

  return url;
}

function extractTranscript(response: DeepgramTranscriptionResponse) {
  return (
    response.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() ?? ''
  );
}

export async function transcribeWithDeepgram(
  audio: ArrayBuffer,
  mimeType: string,
): Promise<string> {
  const response = await fetch(buildDeepgramUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Token ${getRequiredEnv('DEEPGRAM_API_KEY')}`,
      'Content-Type': mimeType,
    },
    body: audio,
  });

  if (!response.ok) {
    throw new Error(`Deepgram transcription failed with status ${response.status}.`);
  }

  const json = (await response.json()) as DeepgramTranscriptionResponse;

  return extractTranscript(json);
}
