import { GradeAnswerInput } from './ai.types';

function valueOrEmpty(value: string | null) {
  return value ?? '';
}

export function buildGradingPrompt(input: GradeAnswerInput) {
  return `
Bạn là giáo viên tiếng Trung cho người Việt.

Hãy chấm câu trả lời tiếng Trung của người học theo thang điểm 1-10.

Ngữ cảnh:
- Level HSK: ${input.level}
- Chủ đề: ${input.topicVi}
- Câu hỏi tiếng Trung: ${input.questionZh}
- Pinyin câu hỏi: ${valueOrEmpty(input.questionPinyin)}
- Nghĩa tiếng Việt câu hỏi: ${valueOrEmpty(input.questionVi)}
- Câu trả lời mẫu tiếng Trung: ${valueOrEmpty(input.sampleAnswerZh)}
- Nghĩa tiếng Việt câu trả lời mẫu: ${valueOrEmpty(input.sampleAnswerVi)}
- Câu trả lời của người học: ${input.userAnswerZh}

Tiêu chí chấm:
1. Đúng ý câu hỏi.
2. Ngữ pháp tiếng Trung.
3. Từ vựng phù hợp trình độ HSK.
4. Độ tự nhiên.
5. Không chấm quá khắt khe với HSK1-HSK2.
6. Nếu câu trả lời trống hoặc không liên quan, điểm tối đa là 3.
7. Nếu đúng ý nhưng hơi ngắn, vẫn có thể 7-8 điểm.

Chỉ trả JSON hợp lệ, không markdown, không giải thích ngoài JSON.
JSON phải có đúng các field sau:
{
  "score": number,
  "isRelevant": boolean,
  "shortFeedbackVi": string,
  "grammarFeedbackVi": string,
  "vocabularyFeedbackVi": string,
  "improvedAnswerZh": string,
  "improvedAnswerPinyin": string,
  "improvedAnswerVi": string,
  "suggestionVi": string
}
`.trim();
}
