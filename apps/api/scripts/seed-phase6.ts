import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Tải biến môi trường từ .env
dotenv.config({ path: resolve(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';

const OPENAI_CHAT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// ====== Cấu hình Supabase ======
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Service Role Key in .env');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// ====== OpenAI Helper ======
async function generateFromOpenAI(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const response = await fetch(OPENAI_CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API failed: ${err}`);
  }

  const json = await response.json();
  const text = json.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('OpenAI returned empty text');
  }

  return JSON.parse(text);
}

// ====== Generate Script ======
async function seedPhase6() {
  console.log('🚀 Bắt đầu seed dữ liệu Phase 6...');

  // 1. Lấy tất cả HSK Levels từ 1 đến 5
  const { data: hskLevels, error: hskError } = await supabaseAdmin
    .from('hsk_levels')
    .select('id, code, name')
    .eq('is_active', true)
    .in('code', ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5'])
    .order('order_index', { ascending: true });

  if (hskError) throw new Error(`Lỗi lấy HSK Levels: ${hskError.message}`);

  if (!hskLevels || hskLevels.length === 0) {
    console.log('⚠️ Không tìm thấy HSK Levels nào (1-5).');
    return;
  }

  for (const level of hskLevels) {
    console.log(`\n\n=========================================`);
    console.log(`📚 Đang xử lý: ${level.name} (${level.code})`);

    // 2. Fetch all existing topics to avoid duplicates
    const { data: existingTopics } = await supabaseAdmin.from('topics').select('key, title_zh, title_vi, id');
    const existingTopicNames = existingTopics?.map(t => t.title_vi).join(', ') || '';

    // Gợi ý sinh 2 Topic mới cho mỗi cấp độ
    const topicPrompt = `
Hãy tạo 2 chủ đề (topics) giao tiếp tiếng Trung phù hợp với người học trình độ ${level.code}.
LƯU Ý QUAN TRỌNG: KHÔNG ĐƯỢC sinh các chủ đề đã tồn tại sau đây: ${existingTopicNames}

Mỗi chủ đề cần có:
1. key: viết thường, không dấu, ngăn cách bằng gạch ngang (VD: cong-viec)
2. title_zh: Tên chủ đề bằng tiếng Trung
3. title_vi: Tên chủ đề bằng tiếng Việt
4. emoji: 1 emoji đại diện

Trả về định dạng JSON:
{
  "topics": [
    { "key": "...", "title_zh": "...", "title_vi": "...", "emoji": "..." }
  ]
}
`;

    console.log(`⏳ Sinh 2 topics mới cho ${level.code}...`);
    try {
      const topicResult = await generateFromOpenAI(
        'Bạn là giáo viên tiếng Trung chuyên nghiệp.',
        topicPrompt
      );

      const topicsToCreate = topicResult.topics || [];
      
      for (const t of topicsToCreate) {
        // Chèn topic vào Database
        const { error: insertTopicErr } = await supabaseAdmin
          .from('topics')
          .insert({
            key: t.key,
            title_zh: t.title_zh,
            title_vi: t.title_vi,
            emoji: t.emoji,
            is_active: true
          });

        if (insertTopicErr) {
          if (insertTopicErr.code !== '23505') {
            console.error(`   ❌ Lỗi insert topic ${t.key}: ${insertTopicErr.message}`);
          }
        } else {
          console.log(`   ✅ Đã thêm chủ đề mới: ${t.title_zh} (${t.title_vi})`);
        }
      }
    } catch (err) {
      console.log(`   ⚠️ Lỗi khi sinh topic: ${err}`);
    }

    // 3. Fetch LẠI toàn bộ topics (bao gồm cả cũ và mới)
    const { data: allTopics } = await supabaseAdmin.from('topics').select('id, key, title_zh, title_vi');
    if (!allTopics) continue;

    console.log(`\n📋 Đang kiểm tra và bổ sung câu hỏi cho ${allTopics.length} chủ đề của ${level.code}...`);

    for (const t of allTopics) {
      // Đếm số câu hỏi hiện tại
      const { count } = await supabaseAdmin
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('hsk_level_id', level.id)
        .eq('topic_id', t.id);

      const currentCount = count || 0;
      const targetCount = 15;
      const missingCount = targetCount - currentCount;

      if (missingCount <= 0) {
        console.log(`   ⏭️  Chủ đề [${t.title_vi}] đã đủ ${currentCount}/${targetCount} câu.`);
        continue;
      }

      console.log(`   ⏳ Chủ đề [${t.title_vi}] đang thiếu ${missingCount} câu. Bắt đầu sinh...`);
      const questionPrompt = `
Hãy tạo ${missingCount} câu hỏi hội thoại (open_ended) tiếng Trung thuộc chủ đề "${t.title_zh} (${t.title_vi})".
Yêu cầu:
- TẤT CẢ từ vựng và ngữ pháp TUYỆT ĐỐI KHÔNG ĐƯỢC VƯỢT QUÁ trình độ ${level.code}.
- Câu hỏi mang tính chất giao tiếp thực tế.
- Mỗi câu hỏi đi kèm phiên âm pinyin chuẩn.
- Có giải nghĩa tiếng Việt cho câu hỏi.
- Gợi ý câu trả lời tiếng Việt ngắn gọn.
- Có câu trả lời mẫu bằng tiếng Trung kèm pinyin và tiếng Việt.

Định dạng JSON:
{
  "questions": [
    {
      "question_zh": "...",
      "question_pinyin": "...",
      "question_vi": "...",
      "hint_vi": "...",
      "sample_answer_zh": "...",
      "sample_answer_pinyin": "...",
      "sample_answer_vi": "..."
    }
  ]
}
`;
      try {
        const questionsResult = await generateFromOpenAI(
          'Bạn là chuyên gia biên soạn đề thi HSK.',
          questionPrompt
        );

        const questionsList = questionsResult.questions || [];
        if (questionsList.length === 0) continue;

        const questionsToInsert = questionsList.map((q: any) => ({
          hsk_level_id: level.id,
          topic_id: t.id,
          question_zh: q.question_zh,
          question_pinyin: q.question_pinyin,
          question_vi: q.question_vi,
          hint_vi: q.hint_vi,
          sample_answer_zh: q.sample_answer_zh,
          sample_answer_pinyin: q.sample_answer_pinyin,
          sample_answer_vi: q.sample_answer_vi,
          is_active: true,
          question_type: 'open_ended'
        }));

        const { error: insertQuestionsErr } = await supabaseAdmin
          .from('questions')
          .insert(questionsToInsert);

        if (insertQuestionsErr) {
          console.error(`      ❌ Lỗi insert questions: ${insertQuestionsErr.message}`);
        } else {
          console.log(`      ✅ Đã insert thành công ${questionsToInsert.length} câu hỏi!`);
        }
      } catch (err) {
        console.log(`      ⚠️ Lỗi sinh câu hỏi: ${err}`);
      }
    }
  }

  console.log('\n🎉 Đã hoàn thành seed dữ liệu Phase 6!');
}

seedPhase6().catch(console.error);
