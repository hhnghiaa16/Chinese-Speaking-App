/**
 * Prompt sinh câu hỏi hội thoại tiếng Trung ngẫu nhiên theo cấp HSK và chủ đề.
 * Dùng cho tính năng AI Conversation mode.
 *
 * Thiết kế để câu hỏi đa dạng, bám sát topic, và KHÁC hẳn mẫu ngân hàng đề
 * (ngân hàng đề chỉ dùng 你喜欢/你想/你有 — AI mode dùng tình huống, kịch bản, trải nghiệm...).
 */

export type GenerateQuestionInput = {
  level: string;
  topic: string;
  topicVi: string;
  excludeQuestions: string[];
  questionStyle: QuestionStyle;
  previousFeedback?: string;
};

export type GeneratedQuestion = {
  questionZh: string;
  questionPinyin: string;
  questionVi: string;
  hintVi: string;
};

// Các kiểu câu hỏi đa dạng — được pick ngẫu nhiên mỗi lần sinh
export type QuestionStyle =
  | 'situation'    // Đặt vào tình huống cụ thể (昨天/上周/旅行时...)
  | 'opinion'      // Hỏi ý kiến, đánh giá (你觉得...怎么样？)
  | 'comparison'   // So sánh hai thứ (A和B哪个更...？)
  | 'experience'   // Hỏi trải nghiệm đã làm (你有没有...过？)
  | 'reason'       // Hỏi lý do / giải thích (为什么...？你怎么看？)
  | 'hypothetical' // Giả định, nếu... thì (如果...，你会怎么办？)
  | 'roleplay'     // Nhập vai tình huống thực tế (你在餐厅..., 你在机场...)
  | 'preference';  // Sở thích nhưng theo angle khác (最...是什么？)

export const QUESTION_STYLES: QuestionStyle[] = [
  'situation',
  'opinion',
  'comparison',
  'experience',
  'reason',
  'hypothetical',
  'roleplay',
  'preference',
];

// Vocabulary gợi ý theo từng topic — giúp AI bám chủ đề chắc hơn
const TOPIC_VOCAB: Record<string, string> = {
  intro:    '名字、国籍、职业、年龄、爱好、性格、家乡、语言',
  family:   '父母、兄弟姐妹、祖父母、配偶、孩子、家庭关系、职业、性格',
  food:     '餐厅、菜单、点菜、口味、辣/甜/酸/咸、早餐/午餐/晚餐、外卖、食材',
  shopping: '商场、价格、品牌、折扣、退换货、网购、信用卡、讨价还价',
  travel:   '订票、酒店、景点、行李、护照、交通方式、旅游攻略、文化差异',
  study:    '课程、老师、考试、成绩、图书馆、学习方法、目标、困难',
};

// Hướng dẫn sinh câu theo từng style
const STYLE_INSTRUCTIONS: Record<QuestionStyle, string> = {
  situation:
    '**Tình huống cụ thể**: Đặt câu hỏi trong một bối cảnh thực tế đã xảy ra hoặc đang xảy ra. Dùng từ chỉ thời gian/địa điểm: 昨天、上周、去年、在...的时候. Ví dụ format: "上周你去餐厅吃饭，点了什么菜？味道怎么样？"',

  opinion:
    '**Ý kiến cá nhân**: Hỏi đánh giá, quan điểm về một chủ đề liên quan. Dùng: 你觉得...怎么样？你认为...有什么优缺点？ Câu phải mở, không có câu trả lời đúng/sai.',

  comparison:
    '**So sánh**: Đưa ra hai lựa chọn cụ thể trong topic và hỏi học viên thích cái nào / cái nào tốt hơn và tại sao. Dùng: ...和...，你更喜欢哪个？为什么？',

  experience:
    '**Trải nghiệm**: Hỏi về một trải nghiệm đã xảy ra hoặc chưa từng thử. Dùng: 你有没有...过？你最难忘的...是什么时候？ Câu phải liên quan đến topic.',

  reason:
    '**Lý do / Giải thích**: Hỏi tại sao hoặc cách thức. Dùng: 你为什么...？你是怎么...的？你觉得...的原因是什么？',

  hypothetical:
    '**Giả định**: Tạo tình huống "nếu ... thì bạn sẽ làm gì". Dùng: 如果...，你会怎么做？假如...，你会选择...吗？ Tình huống phải liên quan đến topic.',

  roleplay:
    '**Nhập vai**: Đặt học viên vào một vai cụ thể trong tình huống thực tế. Bắt đầu bằng "假设你在..." hoặc "想象一下，你..." rồi hỏi họ sẽ nói/làm gì.',

  preference:
    '**Sở thích góc khác**: Hỏi về sở thích nhưng với angle mới lạ, không phải 你喜欢什么. Ví dụ: 你最难忘的...是哪次？你印象最深刻的...是什么？你会向朋友推荐什么...？',
};

export const QUESTION_GEN_SYSTEM_PROMPT = `Bạn là giáo viên tiếng Trung sáng tạo, chuyên tạo câu hỏi hội thoại phong phú và thực tế cho người Việt học tiếng Trung theo chuẩn HSK.

# Nhiệm vụ
Tạo đúng 1 câu hỏi hội thoại theo KIỂU và CHỦ ĐỀ được chỉ định, phù hợp với cấp độ HSK.

# Nguyên tắc QUAN TRỌNG về cấp độ HSK (TUYỆT ĐỐI TUÂN THỦ)
- Bạn PHẢI giới hạn từ vựng và ngữ pháp ĐÚNG với cấp độ HSK được yêu cầu. Không bao giờ dùng từ vựng của HSK cao hơn.
- Nếu được yêu cầu HSK 1 hoặc HSK 2, câu hỏi phải NGẮN GỌN HẾT MỨC CÓ THỂ, không dùng từ láy, không dùng cấu trúc phức tạp.

# Hướng dẫn chi tiết theo cấp độ
- HSK 1 (150 từ cơ bản): 
  + Chỉ dùng câu đơn giản nhất. Độ dài TỐI ĐA 8 chữ.
  + Ví dụ HSK 1 tốt: "你想吃什么？", "你喜欢去哪儿？", "你的老师是谁？"
  + TỪ CHỐI TẠO CÁC CÂU DÀI NHƯ: "你去餐厅吃饭的时候点什么菜？" (quá khó với HSK 1).
- HSK 2 (300 từ): 
  + Thêm trạng từ thời gian/địa điểm đơn giản (昨天, 在医院). Độ dài TỐI ĐA 12 chữ.
  + Ví dụ HSK 2 tốt: "昨天你去哪儿吃饭了？", "你觉得汉语难吗？"
- HSK 3 (600 từ): Dùng câu phức đơn giản (因为...所以..., 虽然...但是...).
- HSK 4 (1200 từ): Hỏi ý kiến cá nhân, đánh giá (我觉得, 认为).
- HSK 5 (2500 từ): Thảo luận sâu, so sánh quan điểm.

# Định dạng JSON bắt buộc — CHỈ trả về JSON, không markdown, không giải thích
{
  "questionZh": "<câu hỏi bằng tiếng Trung phổ thông, chữ Hán giản thể>",
  "questionPinyin": "<phiên âm pinyin đầy đủ, chính xác>",
  "questionVi": "<nghĩa tiếng Việt tự nhiên của câu hỏi>",
  "hintVi": "<gợi ý ngắn 1 câu về cấu trúc hoặc từ vựng nên dùng khi trả lời>"
}`;

export function pickRandomStyle(level: string): QuestionStyle {
  // Với HSK 1 và HSK 2, giới hạn các kiểu câu hỏi đơn giản để tránh AI sinh ra câu quá phức tạp
  let allowedStyles = QUESTION_STYLES;
  const isBeginner = level.includes('1') || level.includes('2');
  
  if (isBeginner) {
    allowedStyles = ['situation', 'preference', 'experience', 'opinion'];
  }
  
  return allowedStyles[Math.floor(Math.random() * allowedStyles.length)];
}

export function buildQuestionGenUserPrompt(input: GenerateQuestionInput): string {
  const styleInstruction = STYLE_INSTRUCTIONS[input.questionStyle];
  const topicVocab = TOPIC_VOCAB[input.topic] ?? '';

  const excludeList =
    input.excludeQuestions.length > 0
      ? `\n\n⛔ Danh sách câu hỏi đã dùng — KHÔNG được lặp lại hoặc tạo câu tương tự:\n${input.excludeQuestions.map((q) => `- ${q}`).join('\n')}`
      : '';

  const vocabHint = topicVocab
    ? `\n\n💡 Ý tưởng từ vựng (chỉ chọn các từ phù hợp với ${input.level}): ${topicVocab}`
    : '';

  const feedbackInstruction = input.previousFeedback
    ? `\n\n📌 LỜI KHUYÊN TỪ CÂU TRẢ LỜI TRƯỚC CỦA HỌC VIÊN: "${input.previousFeedback}"\n⚠️ YÊU CẦU ĐẶC BIỆT: Hãy viết phần "hintVi" sao cho LỒNG GHÉP lời khuyên này vào gợi ý trả lời cho câu hỏi mới. Ví dụ: "Gợi ý: ... Đừng quên thêm từ X như đã nhắc ở câu trước nhé." (Tuyệt đối không nhắc lại phần lời khuyên này vào nội dung câu hỏi tiếng Trung, chỉ đưa vào hintVi).`
    : '';

  return `Tạo 1 câu hỏi hội thoại với các thông số sau:

📌 Cấp độ kiểm soát: ${input.level} (TUYỆT ĐỐI không dùng từ vựng vượt quá cấp độ này)
📌 Chủ đề: ${input.topicVi} (key: ${input.topic})
📌 Kiểu câu hỏi: ${styleInstruction}${vocabHint}${excludeList}${feedbackInstruction}

Yêu cầu BẮT BUỘC:
1. 100% từ vựng và ngữ pháp phải nằm trong chuẩn của ${input.level}. Nếu là HSK1/HSK2, hãy giữ câu cực kỳ ngắn gọn và dễ hiểu.
2. Phải theo đúng "Kiểu câu hỏi" được chỉ định, nhưng vẫn phải tuân thủ nghiêm ngặt giới hạn từ vựng của ${input.level}.
3. Liên quan chặt chẽ đến chủ đề "${input.topicVi}".
4. Khác hoàn toàn về ý và cấu trúc so với các câu đã dùng trong danh sách loại trừ.

Trả về JSON với 4 field: questionZh, questionPinyin, questionVi, hintVi.`;
}

export function parseGeneratedQuestion(raw: string): GeneratedQuestion {
  let parsed: unknown;

  const cleanText = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const start = cleanText.indexOf('{');
  const end = cleanText.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('AI response does not contain a JSON object.');
  }

  try {
    parsed = JSON.parse(cleanText.slice(start, end + 1));
  } catch {
    throw new Error('Failed to parse question generation AI response as JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('AI response JSON must be an object.');
  }

  const json = parsed as Record<string, unknown>;

  const questionZh = typeof json.questionZh === 'string' ? json.questionZh.trim() : '';
  const questionPinyin = typeof json.questionPinyin === 'string' ? json.questionPinyin.trim() : '';
  const questionVi = typeof json.questionVi === 'string' ? json.questionVi.trim() : '';
  const hintVi = typeof json.hintVi === 'string' ? json.hintVi.trim() : '';

  if (!questionZh) {
    throw new Error('AI response missing required field: questionZh');
  }

  return { questionZh, questionPinyin, questionVi, hintVi };
}
