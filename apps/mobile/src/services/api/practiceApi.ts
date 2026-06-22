import { apiPost, getApiUrl } from './apiClient';

export type GeneratedQuestionDto = {
  questionZh: string;
  questionPinyin: string;
  questionVi: string;
  hintVi: string;
};

export type AiGradeInput = {
  level: string;
  topicVi: string;
  questionZh: string;
  questionPinyin: string;
  questionVi: string;
  userAnswerZh: string;
};

export type PracticeSessionApiDto = {
  sessionId: string;
  level: string;
  topic: string;
  totalQuestions: number;
  startedAt: string;
};

export type GradeAnswerApiInput = {
  sessionId: string;
  questionId: string;
  userAnswerZh: string;
};

export type GradeAnswerApiDto = {
  score: number;
  isRelevant: boolean;
  shortFeedbackVi: string;
  grammarFeedbackVi: string;
  vocabularyFeedbackVi: string;
  improvedAnswerZh: string;
  improvedAnswerPinyin: string;
  improvedAnswerVi: string;
  suggestionVi: string;
};

export type CompletePracticeSessionApiDto = {
  sessionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  averageScore: number;
};

export type TranscribeAudioApiDto = {
  text: string;
};

export async function createPracticeSession(
  level: string,
  topic: string,
): Promise<PracticeSessionApiDto> {
  return apiPost<PracticeSessionApiDto>('/api/practice/sessions', {
    level,
    topic,
  });
}

export async function gradeAnswerFromApi(
  input: GradeAnswerApiInput,
): Promise<GradeAnswerApiDto> {
  return apiPost<GradeAnswerApiDto>('/api/practice/grade', input);
}

export async function completePracticeSession(
  sessionId: string,
): Promise<CompletePracticeSessionApiDto> {
  return apiPost<CompletePracticeSessionApiDto>(
    `/api/practice/sessions/${encodeURIComponent(sessionId)}/complete`,
  );
}

export async function transcribeAudioFromApi(audioUri: string): Promise<TranscribeAudioApiDto> {
  const formData = new FormData();
  const file = {
    uri: audioUri,
    name: 'answer.m4a',
    type: 'audio/m4a',
  };

  formData.append('file', file as any);

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open('POST', getApiUrl('/api/practice/transcribe'));

    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(
          new Error(
            `API POST /api/practice/transcribe failed with status ${request.status}: ${request.responseText}`,
          ),
        );
        return;
      }

      try {
        const json = JSON.parse(request.responseText) as { data: TranscribeAudioApiDto };

        resolve(json.data);
      } catch {
        reject(new Error('Failed to parse transcribe response.'));
      }
    };

    request.onerror = () => {
      reject(new Error('Failed to upload audio for transcription.'));
    };

    request.send(formData);
  });
}

export async function generateQuestionFromApi(
  level: string,
  topic: string,
  topicVi: string,
  excludeQuestions: string[],
  previousFeedback?: string,
): Promise<GeneratedQuestionDto> {
  return apiPost<GeneratedQuestionDto>('/api/ai/generate-question', {
    level,
    topic,
    topicVi,
    excludeQuestions,
    previousFeedback,
  });
}

export async function gradeWithAiInline(
  input: AiGradeInput,
): Promise<GradeAnswerApiDto> {
  return apiPost<GradeAnswerApiDto>('/api/ai/grade', input);
}
