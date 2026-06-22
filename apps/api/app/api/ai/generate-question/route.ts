import { NextRequest, NextResponse } from 'next/server';

import { generateOpenAiText } from '@/services/ai/providers/openai.provider';
import {
  buildQuestionGenUserPrompt,
  GenerateQuestionInput,
  parseGeneratedQuestion,
  pickRandomStyle,
  QUESTION_GEN_SYSTEM_PROMPT,
} from '@/services/ai/questionGenPrompt';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

const OPENAI_QUESTION_MODEL = process.env.OPENAI_GRADING_MODEL || 'gpt-4o-mini';

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

type GenerateQuestionBody = {
  level?: unknown;
  topic?: unknown;
  topicVi?: unknown;
  excludeQuestions?: unknown;
  previousFeedback?: unknown;
};

export async function POST(request: NextRequest) {
  let body: GenerateQuestionBody;

  try {
    body = (await request.json()) as GenerateQuestionBody;
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (
    typeof body.level !== 'string' ||
    typeof body.topic !== 'string' ||
    typeof body.topicVi !== 'string'
  ) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Missing required fields: level, topic, topicVi' },
      { status: 400 },
    );
  }

  const excludeQuestions: string[] = Array.isArray(body.excludeQuestions)
    ? body.excludeQuestions.filter((q): q is string => typeof q === 'string')
    : [];

  // Chọn ngẫu nhiên 1 style phù hợp với level
  const questionStyle = pickRandomStyle(body.level);

  const input: GenerateQuestionInput = {
    level: body.level.trim(),
    topic: body.topic.trim(),
    topicVi: body.topicVi.trim(),
    excludeQuestions,
    questionStyle,
    previousFeedback: typeof body.previousFeedback === 'string' ? body.previousFeedback.trim() : undefined,
  };

  try {
    const apiKey = getRequiredEnv('OPENAI_API_KEY');
    const rawText = await generateOpenAiText(
      QUESTION_GEN_SYSTEM_PROMPT,
      buildQuestionGenUserPrompt(input),
      {
        apiKey,
        model: OPENAI_QUESTION_MODEL,
        temperature: 1.0, // max diversity — JSON format vẫn được enforce bằng prompt
        jsonMode: false,  // tắt json_object mode để tăng creativity
      },
    );

    const question = parseGeneratedQuestion(rawText);

    return NextResponse.json<ApiSuccessResponse<typeof question>>({ data: question });
  } catch (error) {
    console.error('[AI Generate Question] Failed', error);

    return NextResponse.json<ApiErrorResponse>(
      { error: 'Failed to generate question' },
      { status: 500 },
    );
  }
}
