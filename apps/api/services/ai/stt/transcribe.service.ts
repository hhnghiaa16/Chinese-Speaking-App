import { transcribeWithDeepgram } from './deepgram.provider';
import { TranscribeAudioInput, TranscribeAudioResult } from './stt.types';

export async function transcribeAudio(
  input: TranscribeAudioInput,
): Promise<TranscribeAudioResult> {
  const text = await transcribeWithDeepgram(input.audio, input.mimeType);

  return { text };
}
