const OPENAI_CHAT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export type OpenAiTextGenerationOptions = {
  apiKey: string;
  model: string;
  temperature?: number;
  /**
   * Nếu true (mặc định): dùng response_format json_object — đảm bảo output là JSON hợp lệ.
   * Nếu false: tắt json_object mode — model tự do hơn, nhưng vẫn phải tuân theo
   * system prompt yêu cầu trả JSON. Phù hợp khi cần creativity cao (sinh câu hỏi).
   */
  jsonMode?: boolean;
};

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function extractOpenAiText(response: OpenAiChatResponse): string {
  const text = response.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error('OpenAI response did not include text.');
  }

  return text;
}

export async function generateOpenAiText(
  systemPrompt: string,
  userPrompt: string,
  options: OpenAiTextGenerationOptions,
): Promise<string> {
  const useJsonMode = options.jsonMode !== false; // default true

  const response = await fetch(OPENAI_CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      temperature: options.temperature ?? 0.2,
      ...(useJsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `OpenAI API request failed with status ${response.status}: ${errorText}`,
    );
  }

  const json = (await response.json()) as OpenAiChatResponse;

  return extractOpenAiText(json);
}
