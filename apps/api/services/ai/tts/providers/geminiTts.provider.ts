import { TtsInput, TtsResult } from '../tts.types';

const DEFAULT_GEMINI_TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const DEFAULT_GEMINI_TTS_VOICE = 'Kore';
const GEMINI_TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

type GeminiTtsResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
        inline_data?: {
          data?: string;
          mime_type?: string;
        };
      }>;
    };
  }>;
};

function getRequiredGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing required environment variable: GEMINI_API_KEY');
  }

  return apiKey;
}

function getGeminiTtsModel() {
  return process.env.GEMINI_TTS_MODEL || DEFAULT_GEMINI_TTS_MODEL;
}

function getVoiceName(voice?: string) {
  const trimmedVoice = voice?.trim();

  if (!trimmedVoice || trimmedVoice === 'default') {
    return DEFAULT_GEMINI_TTS_VOICE;
  }

  return trimmedVoice;
}

function getPcmSampleRate(mimeType: string) {
  const rateMatch = mimeType.match(/rate=(\d+)/i);

  if (!rateMatch) {
    return 24000;
  }

  return Number(rateMatch[1]);
}

function isPcmAudio(mimeType: string) {
  const normalizedMimeType = mimeType.toLowerCase();

  return normalizedMimeType.includes('audio/l16') || normalizedMimeType.includes('codec=pcm');
}

function pcmBase64ToWavBase64(audioBase64: string, mimeType: string) {
  const pcmBuffer = Buffer.from(audioBase64, 'base64');
  const header = Buffer.alloc(44);
  const sampleRate = getPcmSampleRate(mimeType);
  const channels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]).toString('base64');
}

function normalizeAudioResult(audioBase64: string, mimeType: string): TtsResult {
  if (isPcmAudio(mimeType)) {
    return {
      audioBase64: pcmBase64ToWavBase64(audioBase64, mimeType),
      mimeType: 'audio/wav',
    };
  }

  return {
    audioBase64,
    mimeType,
  };
}

function extractAudio(response: GeminiTtsResponse): TtsResult {
  const parts = response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    const inlineData = part.inlineData;
    const inlineDataSnakeCase = part.inline_data;
    const audioBase64 = inlineData?.data ?? inlineDataSnakeCase?.data;

    if (audioBase64) {
      return normalizeAudioResult(
        audioBase64,
        inlineData?.mimeType ?? inlineDataSnakeCase?.mime_type ?? 'audio/wav',
      );
    }
  }

  throw new Error('Gemini TTS response did not include audio.');
}

export async function synthesizeWithGeminiTts(input: TtsInput): Promise<TtsResult> {
  const apiKey = getRequiredGeminiApiKey();
  const model = getGeminiTtsModel();
  const response = await fetch(`${GEMINI_TTS_ENDPOINT}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: input.text }],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: getVoiceName(input.voice),
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini TTS request failed with status ${response.status}.`);
  }

  const json = (await response.json()) as GeminiTtsResponse;

  return extractAudio(json);
}
