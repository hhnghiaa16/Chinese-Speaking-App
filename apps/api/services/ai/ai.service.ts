import { GradeAnswerInput, GradeAnswerResult } from './ai.types';
import { buildGradingUserPrompt, GRADING_SYSTEM_PROMPT } from './gradingPrompt';
import { parseStrictJsonFromAi } from './jsonParser';
import { generateOpenAiText } from './providers/openai.provider';

const DEFAULT_OPENAI_GRADING_MODEL = 'gpt-4o-mini';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOpenAiGradingConfig() {
  return {
    apiKey: getRequiredEnv('OPENAI_API_KEY'),
    model: process.env.OPENAI_GRADING_MODEL || DEFAULT_OPENAI_GRADING_MODEL,
    temperature: 0.2,
  };
}

export async function gradeAnswerWithAi(
  input: GradeAnswerInput,
): Promise<GradeAnswerResult> {
  const systemPrompt = GRADING_SYSTEM_PROMPT;
  const userPrompt = buildGradingUserPrompt(input);
  const config = getOpenAiGradingConfig();

  const rawText = await generateOpenAiText(systemPrompt, userPrompt, config);

  return parseStrictJsonFromAi(rawText);
}
