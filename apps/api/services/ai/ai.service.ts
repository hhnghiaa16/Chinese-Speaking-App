import { GradeAnswerInput, GradeAnswerResult } from './ai.types';
import { buildGradingPrompt } from './gradingPrompt';
import { parseStrictJsonFromAi } from './jsonParser';
import { generateGeminiText } from './providers/gemini.provider';

const DEFAULT_GRADING_GEMINI_MODEL = 'gemini-2.0-flash';

function getAiProvider() {
  return process.env.AI_PROVIDER || 'gemini';
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getGeminiGradingConfig() {
  return {
    apiKey: getRequiredEnv('GEMINI_GRADING_API_KEY'),
    model: process.env.GEMINI_GRADING_MODEL || DEFAULT_GRADING_GEMINI_MODEL,
    temperature: 0.2,
  };
}

export async function gradeAnswerWithAi(
  input: GradeAnswerInput,
): Promise<GradeAnswerResult> {
  const prompt = buildGradingPrompt(input);
  const provider = getAiProvider();

  if (provider === 'gemini') {
    const rawText = await generateGeminiText(prompt, getGeminiGradingConfig());

    return parseStrictJsonFromAi(rawText);
  }

  throw new Error('Unsupported AI provider');
}
