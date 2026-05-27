type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

export type GeminiTextGenerationOptions = {
  apiKey: string;
  model: string;
  temperature?: number;
};

function extractGeminiText(response: GeminiGenerateContentResponse) {
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter((partText): partText is string => Boolean(partText))
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini response did not include text.');
  }

  return text;
}

export async function generateGeminiText(
  prompt: string,
  options: GeminiTextGenerationOptions,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': options.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.2,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API request failed with status ${response.status}.`);
  }

  const json = (await response.json()) as GeminiGenerateContentResponse;

  return extractGeminiText(json);
}
