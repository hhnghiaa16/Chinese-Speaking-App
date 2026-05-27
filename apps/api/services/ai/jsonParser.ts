import { GradeAnswerResult } from './ai.types';

const DEFAULT_FEEDBACK = 'Chưa có nhận xét chi tiết.';

function stripMarkdownFence(text: string) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

function extractJsonObject(text: string) {
  const cleanText = stripMarkdownFence(text);
  const start = cleanText.indexOf('{');
  const end = cleanText.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI response does not contain a JSON object.');
  }

  return cleanText.slice(start, end + 1);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('AI response JSON must be an object.');
  }

  return value as Record<string, unknown>;
}

function parseScore(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('AI response score must be a number.');
  }

  if (value < 1 || value > 10) {
    throw new Error('AI response score must be between 1 and 10.');
  }

  return value;
}

function parseBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false;
}

function parseString(value: unknown, fallback = DEFAULT_FEEDBACK) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : fallback;
}

export function parseStrictJsonFromAi(text: string): GradeAnswerResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJsonObject(text));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse error.';
    throw new Error(`Failed to parse AI JSON response: ${message}`);
  }

  const json = asRecord(parsed);

  return {
    score: parseScore(json.score),
    isRelevant: parseBoolean(json.isRelevant),
    shortFeedbackVi: parseString(json.shortFeedbackVi),
    grammarFeedbackVi: parseString(json.grammarFeedbackVi),
    vocabularyFeedbackVi: parseString(json.vocabularyFeedbackVi),
    improvedAnswerZh: parseString(json.improvedAnswerZh, ''),
    improvedAnswerPinyin: parseString(json.improvedAnswerPinyin, ''),
    improvedAnswerVi: parseString(json.improvedAnswerVi, ''),
    suggestionVi: parseString(json.suggestionVi),
  };
}
