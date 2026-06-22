import { transcribeWithOpenAi } from './openai.stt.provider';
import { TranscribeAudioInput, TranscribeAudioResult } from './stt.types';

export async function transcribeAudio(
  input: TranscribeAudioInput,
): Promise<TranscribeAudioResult> {
  const text = await transcribeWithOpenAi(input.audio, input.mimeType);

  return { text };
}
