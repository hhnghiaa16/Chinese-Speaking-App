export type TtsInput = {
  text: string;
  language?: string;
  voice?: string;
};

export type TtsResult = {
  audioBase64: string;
  mimeType: string;
};
