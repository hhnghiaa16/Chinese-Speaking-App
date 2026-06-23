import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Tải biến môi trường từ .env
dotenv.config({ path: resolve(process.cwd(), '.env') });

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
async function generateDescriptionFromOpenAI(titleVi: string, titleZh: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const systemPrompt = 'Bạn là chuyên gia biên soạn nội dung học tiếng Trung. Trả về định dạng JSON chứa mô tả tiếng Việt.';
  const userPrompt = `Hãy viết 1 câu mô tả tiếng Việt thật ngắn gọn, tự nhiên, và hấp dẫn (khoảng 8-15 chữ) giới thiệu về chủ đề giao tiếp tiếng Trung sau đây để hiển thị trên thẻ Topic trong ứng dụng học tập.
  
Chủ đề: ${titleZh} (${titleVi})

Trả về định dạng JSON:
{
  "description_vi": "..."
}`;

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

  return JSON.parse(text).description_vi;
}

async function seedTopicDescriptions() {
  console.log('🚀 Bắt đầu bổ sung description_vi cho các topic...');

  const { data: topics, error } = await supabaseAdmin
    .from('topics')
    .select('id, title_zh, title_vi')
    .is('description_vi', null);

  if (error) {
    throw new Error(`Lỗi lấy topics: ${error.message}`);
  }

  if (!topics || topics.length === 0) {
    console.log('✅ Tất cả topics đều đã có description_vi.');
    return;
  }

  console.log(`📋 Tìm thấy ${topics.length} topic đang thiếu description. Bắt đầu sinh...`);

  for (const t of topics) {
    console.log(`⏳ Đang sinh description cho: ${t.title_vi} (${t.title_zh})...`);
    try {
      const description = await generateDescriptionFromOpenAI(t.title_vi, t.title_zh);
      
      const { error: updateErr } = await supabaseAdmin
        .from('topics')
        .update({ description_vi: description })
        .eq('id', t.id);

      if (updateErr) {
        console.error(`   ❌ Lỗi cập nhật ${t.title_vi}: ${updateErr.message}`);
      } else {
        console.log(`   ✅ Đã cập nhật: "${description}"`);
      }
    } catch (err) {
      console.error(`   ⚠️ Lỗi khi gọi OpenAI: ${err}`);
    }
  }

  console.log('🎉 Đã hoàn thành bổ sung description!');
}

seedTopicDescriptions().catch(console.error);
