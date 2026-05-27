export type TranscribeAudioInput = {
  audio: ArrayBuffer;
  mimeType: string;
};

export type TranscribeAudioResult = {
  text: string;
};

export type DeepgramTranscriptionResponse = {
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        transcript?: string;
      }>;
    }>;
  };
};
