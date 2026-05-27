# HanApp Backend Roadmap

## 1. Implementation Plan

### Phase 1: Supabase database

1. Create the PostgreSQL schema in Supabase SQL Editor.
2. Enable `pgcrypto` for `gen_random_uuid()`.
3. Create tables:
   - `profiles`
   - `hsk_levels`
   - `topics`
   - `questions`
   - `practice_sessions`
   - `practice_answers`
   - `user_progress`
4. Add indexes for common lookups:
   - HSK code
   - topic key
   - question lookup by `hsk_level_id` + `topic_id`
   - practice sessions by user/date
   - progress by user/level/topic
5. Insert seed data:
   - HSK1 to HSK5
   - 6 topics
   - 12 HSK1 sample questions, 2 per topic.

### Phase 2: Next.js data API

1. Keep `apps/api/lib/supabase.ts` as the backend-only Supabase admin client.
2. Add read routes under `apps/api/app/api`:
   - `hsk-levels`
   - `topics`
   - `questions`
3. Add service files under `apps/api/services`:
   - `hsk.service.ts`
   - `topics.service.ts`
   - `questions.service.ts`
4. Add future route/service groups:
   - `practice`
   - `ai`
   - `progress`
5. Implement:
   - `GET /api/hsk-levels`
   - `GET /api/topics`
   - `GET /api/questions?level=HSK1&topic=food`

### Phase 3: Frontend API migration

1. Add `EXPO_PUBLIC_API_URL` to `apps/mobile/.env`.
2. Create `apps/mobile/src/services/api`.
3. Add API clients for HSK levels, topics, questions, practice, and progress.
4. Keep all existing mock files.
5. Screen behavior:
   - Try API first.
   - If API fails, fallback to mock data.
   - Show light loading state.
   - Do not change current UI style or navigation.

### Phase 4: AI grading through backend

1. Add backend env:
   - `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
2. Add `POST /api/practice/grade`.
3. Backend loads the question from Supabase.
4. Backend builds the grading prompt.
5. Backend calls AI.
6. Backend parses strict JSON.
7. Backend stores result in `practice_answers`.
8. Backend returns grading result to FE.

### Phase 5: Real practice sessions and result

1. Add `POST /api/practice/sessions`.
2. Add `POST /api/practice/sessions/:sessionId/complete`.
3. Practice screen creates a session when opened.
4. Practice screen calls grade for each submitted answer.
5. Complete endpoint calculates:
   - answered questions
   - average score
   - user progress
6. Result screen receives real score from backend.

### Phase 6: Real progress

1. Add `GET /api/progress`.
2. Aggregate data from sessions, answers, and `user_progress`.
3. Progress screen calls API first.
4. If API fails or data is empty, use `progressMock`.

### Phase 7: Auth last

1. Add Supabase Auth.
2. FE sends Supabase access token to the Next.js API.
3. Next.js API verifies token.
4. Replace guest/null `user_id` with real user id.
5. Enable Row Level Security policies if FE ever talks to Supabase directly.

## 2. Full Supabase SQL Schema

```sql
create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();

create table if not exists hsk_levels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  vocab_count integer not null default 0,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hsk_levels_code_check check (code ~ '^HSK[1-6]$')
);

create trigger hsk_levels_set_updated_at
before update on hsk_levels
for each row execute function set_updated_at();

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title_zh text,
  title_vi text not null,
  description_vi text,
  emoji text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger topics_set_updated_at
before update on topics
for each row execute function set_updated_at();

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  hsk_level_id uuid not null references hsk_levels(id) on delete restrict,
  topic_id uuid not null references topics(id) on delete restrict,
  question_zh text not null,
  question_pinyin text not null,
  question_vi text not null,
  sample_answer_zh text,
  sample_answer_pinyin text,
  sample_answer_vi text,
  hint_vi text,
  difficulty integer not null default 1,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_difficulty_check check (difficulty between 1 and 5)
);

create trigger questions_set_updated_at
before update on questions
for each row execute function set_updated_at();

create table if not exists practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  hsk_level_id uuid references hsk_levels(id) on delete set null,
  topic_id uuid references topics(id) on delete set null,
  total_questions integer not null default 0,
  answered_questions integer not null default 0,
  average_score numeric(4, 2),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger practice_sessions_set_updated_at
before update on practice_sessions
for each row execute function set_updated_at();

create table if not exists practice_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references practice_sessions(id) on delete cascade,
  question_id uuid not null references questions(id) on delete restrict,
  user_answer_zh text,
  score numeric(4, 2),
  is_relevant boolean,
  short_feedback_vi text,
  grammar_feedback_vi text,
  vocabulary_feedback_vi text,
  improved_answer_zh text,
  improved_answer_pinyin text,
  improved_answer_vi text,
  suggestion_vi text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint practice_answers_score_check check (score is null or score between 0 and 10)
);

create trigger practice_answers_set_updated_at
before update on practice_answers
for each row execute function set_updated_at();

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  hsk_level_id uuid not null references hsk_levels(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  total_sessions integer not null default 0,
  total_questions integer not null default 0,
  average_score numeric(4, 2),
  best_score numeric(4, 2),
  last_score numeric(4, 2),
  last_practiced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_progress_average_score_check check (average_score is null or average_score between 0 and 10),
  constraint user_progress_best_score_check check (best_score is null or best_score between 0 and 10),
  constraint user_progress_last_score_check check (last_score is null or last_score between 0 and 10),
  constraint user_progress_unique_scope unique (user_id, hsk_level_id, topic_id)
);

create trigger user_progress_set_updated_at
before update on user_progress
for each row execute function set_updated_at();

create index if not exists idx_hsk_levels_code_active
on hsk_levels (code, is_active);

create index if not exists idx_topics_key_active
on topics (key, is_active);

create index if not exists idx_questions_level_topic_active
on questions (hsk_level_id, topic_id, is_active, order_index);

create index if not exists idx_practice_sessions_user_started
on practice_sessions (user_id, started_at desc);

create index if not exists idx_practice_answers_session
on practice_answers (session_id);

create index if not exists idx_user_progress_user
on user_progress (user_id, hsk_level_id, topic_id);
```

## 3. Seed Data

```sql
insert into hsk_levels (code, name, description, vocab_count, order_index, is_active)
values
  ('HSK1', 'HSK 1', 'Từ vựng và mẫu câu giao tiếp cơ bản nhất.', 150, 1, true),
  ('HSK2', 'HSK 2', 'Mở rộng hội thoại đời sống hằng ngày.', 300, 2, true),
  ('HSK3', 'HSK 3', 'Giao tiếp độc lập trong các tình huống quen thuộc.', 600, 3, true),
  ('HSK4', 'HSK 4', 'Diễn đạt ý kiến và trao đổi chủ đề rộng hơn.', 1200, 4, true),
  ('HSK5', 'HSK 5', 'Đọc hiểu, thảo luận và trình bày ở mức nâng cao.', 2500, 5, true)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  vocab_count = excluded.vocab_count,
  order_index = excluded.order_index,
  is_active = excluded.is_active;

insert into topics (key, title_zh, title_vi, description_vi, emoji, order_index, is_active)
values
  ('intro', '介绍', 'Giới thiệu', 'Luyện giới thiệu bản thân và hỏi thông tin cơ bản.', '👋', 1, true),
  ('family', '家庭', 'Gia đình', 'Nói về người thân, nghề nghiệp và quan hệ gia đình.', '👨‍👩‍👧', 2, true),
  ('food', '吃饭', 'Ăn uống', 'Hỏi đáp về món ăn, đồ uống và sở thích ăn uống.', '🍜', 3, true),
  ('shopping', '买东西', 'Mua sắm', 'Luyện hỏi giá, số lượng và mua đồ đơn giản.', '🛍️', 4, true),
  ('travel', '旅行', 'Du lịch', 'Nói về đi lại, địa điểm và kế hoạch du lịch.', '✈️', 5, true),
  ('study', '学习', 'Học tập', 'Trao đổi về học tiếng Trung, trường lớp và lịch học.', '📚', 6, true)
on conflict (key) do update set
  title_zh = excluded.title_zh,
  title_vi = excluded.title_vi,
  description_vi = excluded.description_vi,
  emoji = excluded.emoji,
  order_index = excluded.order_index,
  is_active = excluded.is_active;

insert into questions (
  hsk_level_id,
  topic_id,
  question_zh,
  question_pinyin,
  question_vi,
  sample_answer_zh,
  sample_answer_pinyin,
  sample_answer_vi,
  hint_vi,
  difficulty,
  order_index,
  is_active
)
select
  l.id,
  t.id,
  q.question_zh,
  q.question_pinyin,
  q.question_vi,
  q.sample_answer_zh,
  q.sample_answer_pinyin,
  q.sample_answer_vi,
  q.hint_vi,
  q.difficulty,
  q.order_index,
  true
from (
  values
    ('intro', '你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'Bạn tên là gì?', '我叫安。', 'Wǒ jiào Ān.', 'Tôi tên là An.', 'Dùng mẫu câu 我叫...', 1, 1),
    ('intro', '你是哪国人？', 'Nǐ shì nǎ guó rén?', 'Bạn là người nước nào?', '我是越南人。', 'Wǒ shì Yuènán rén.', 'Tôi là người Việt Nam.', 'Dùng mẫu câu 我是...人', 1, 2),
    ('family', '你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'Nhà bạn có mấy người?', '我家有四口人。', 'Wǒ jiā yǒu sì kǒu rén.', 'Nhà tôi có bốn người.', 'Dùng mẫu câu 我家有...口人', 1, 1),
    ('family', '你爸爸做什么工作？', 'Nǐ bàba zuò shénme gōngzuò?', 'Bố bạn làm nghề gì?', '我爸爸是老师。', 'Wǒ bàba shì lǎoshī.', 'Bố tôi là giáo viên.', 'Dùng mẫu câu 我爸爸是...', 1, 2),
    ('food', '你喜欢吃什么？', 'Nǐ xǐhuān chī shénme?', 'Bạn thích ăn gì?', '我喜欢吃米饭。', 'Wǒ xǐhuān chī mǐfàn.', 'Tôi thích ăn cơm.', 'Dùng mẫu câu 我喜欢吃...', 1, 1),
    ('food', '你想喝什么？', 'Nǐ xiǎng hē shénme?', 'Bạn muốn uống gì?', '我想喝茶。', 'Wǒ xiǎng hē chá.', 'Tôi muốn uống trà.', 'Dùng mẫu câu 我想喝...', 1, 2),
    ('shopping', '这个多少钱？', 'Zhège duōshao qián?', 'Cái này bao nhiêu tiền?', '这个十块钱。', 'Zhège shí kuài qián.', 'Cái này mười tệ.', 'Có thể trả lời bằng số tiền đơn giản.', 1, 1),
    ('shopping', '你想买什么？', 'Nǐ xiǎng mǎi shénme?', 'Bạn muốn mua gì?', '我想买水果。', 'Wǒ xiǎng mǎi shuǐguǒ.', 'Tôi muốn mua trái cây.', 'Dùng mẫu câu 我想买...', 1, 2),
    ('travel', '你想去哪儿？', 'Nǐ xiǎng qù nǎr?', 'Bạn muốn đi đâu?', '我想去北京。', 'Wǒ xiǎng qù Běijīng.', 'Tôi muốn đi Bắc Kinh.', 'Dùng mẫu câu 我想去...', 1, 1),
    ('travel', '你怎么去学校？', 'Nǐ zěnme qù xuéxiào?', 'Bạn đi đến trường bằng gì?', '我坐车去学校。', 'Wǒ zuò chē qù xuéxiào.', 'Tôi đi xe đến trường.', 'Dùng 坐车, 走路 hoặc 骑车.', 1, 2),
    ('study', '你学习什么？', 'Nǐ xuéxí shénme?', 'Bạn học gì?', '我学习中文。', 'Wǒ xuéxí Zhōngwén.', 'Tôi học tiếng Trung.', 'Dùng mẫu câu 我学习...', 1, 1),
    ('study', '你每天学习吗？', 'Nǐ měitiān xuéxí ma?', 'Bạn có học mỗi ngày không?', '我每天学习。', 'Wǒ měitiān xuéxí.', 'Tôi học mỗi ngày.', 'Có thể trả lời 我每天学习 hoặc 我不每天学习.', 1, 2)
) as q(topic_key, question_zh, question_pinyin, question_vi, sample_answer_zh, sample_answer_pinyin, sample_answer_vi, hint_vi, difficulty, order_index)
join hsk_levels l on l.code = 'HSK1'
join topics t on t.key = q.topic_key
where not exists (
  select 1
  from questions existing
  where existing.hsk_level_id = l.id
    and existing.topic_id = t.id
    and existing.question_zh = q.question_zh
);
```

## 4. Backend Next.js Structure

```txt
apps/api/
  app/
    api/
      health/
        route.ts
      hsk-levels/
        route.ts
      topics/
        route.ts
      questions/
        route.ts
      practice/
        grade/
          route.ts
        sessions/
          route.ts
          [sessionId]/
            complete/
              route.ts
      progress/
        route.ts
    layout.tsx
    page.tsx
  lib/
    database.types.ts
    env.ts
    http.ts
    supabase.ts
  services/
    hsk.service.ts
    topics.service.ts
    questions.service.ts
    practice.service.ts
    ai.service.ts
    ai-prompt.service.ts
    progress.service.ts
```

## 5. Important Backend Code Samples

The current backend uses Next.js Route Handlers. Next.js maps `app/api/**/route.ts` files to API endpoints and each file exports HTTP methods such as `GET`, `POST`, and `OPTIONS`.

### Supabase admin client

```ts
import { createClient } from '@supabase/supabase-js';

import { Database } from './database.types';
import { getRequiredEnv } from './env';

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!client) {
    client = createClient<Database>(
      getRequiredEnv('SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return client;
}
```

### HSK route

```ts
import { handleError, ok, optionsResponse } from '@/lib/http';
import { getHskLevels } from '@/services/hsk.service';

export async function GET() {
  try {
    return ok(await getHskLevels());
  } catch (error) {
    return handleError(error);
  }
}

export function OPTIONS() {
  return optionsResponse();
}
```

### HSK service

```ts
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function getHskLevels() {
  const { data, error } = await getSupabaseAdminClient()
    .from('hsk_levels')
    .select('id, code, name, description, vocab_count, order_index')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data.map((level) => ({
      id: level.id,
      code: level.code,
      name: level.name,
      description: level.description,
      vocabCount: level.vocab_count,
      orderIndex: level.order_index,
    })),
  };
}
```

### Topics service

```ts
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function getTopics() {
  const { data, error } = await getSupabaseAdminClient()
    .from('topics')
    .select('id, key, title_zh, title_vi, description_vi, emoji, order_index')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data.map((topic) => ({
      id: topic.id,
      key: topic.key,
      titleZh: topic.title_zh,
      titleVi: topic.title_vi,
      descriptionVi: topic.description_vi,
      emoji: topic.emoji,
      orderIndex: topic.order_index,
    })),
  };
}
```

### Questions route

```ts
import { NextRequest } from 'next/server';

import { fail, handleError, ok, optionsResponse } from '@/lib/http';
import { getQuestions } from '@/services/questions.service';

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level');
  const topic = request.nextUrl.searchParams.get('topic');

  if (!level || !topic) {
    return fail('Both level and topic query params are required.', 400);
  }

  try {
    return ok(await getQuestions(level, topic));
  } catch (error) {
    return handleError(error);
  }
}

export function OPTIONS() {
  return optionsResponse();
}
```

## 6. API Spec

Base URL in local development:

```txt
http://localhost:3000/api
```

### GET `/hsk-levels`

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "code": "HSK1",
      "name": "HSK 1",
      "description": "Từ vựng và mẫu câu giao tiếp cơ bản nhất.",
      "vocabCount": 150,
      "orderIndex": 1
    }
  ]
}
```

### GET `/topics`

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "key": "food",
      "titleZh": "吃饭",
      "titleVi": "Ăn uống",
      "descriptionVi": "Hỏi đáp về món ăn, đồ uống và sở thích ăn uống.",
      "emoji": "🍜",
      "orderIndex": 3
    }
  ]
}
```

### GET `/questions?level=HSK1&topic=food`

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "level": "HSK1",
      "topic": "food",
      "topicEmoji": "🍜",
      "topicVi": "Ăn uống",
      "questionZh": "你喜欢吃什么？",
      "questionPinyin": "Nǐ xǐhuān chī shénme?",
      "questionVi": "Bạn thích ăn gì?",
      "sampleAnswerZh": "我喜欢吃米饭。",
      "sampleAnswerPinyin": "Wǒ xǐhuān chī mǐfàn.",
      "sampleAnswerVi": "Tôi thích ăn cơm.",
      "hintVi": "Dùng mẫu câu 我喜欢吃..."
    }
  ]
}
```

### POST `/practice/sessions`

Request:

```json
{
  "level": "HSK1",
  "topic": "food"
}
```

Response:

```json
{
  "data": {
    "sessionId": "uuid",
    "level": "HSK1",
    "topic": "food",
    "totalQuestions": 2,
    "startedAt": "2026-05-26T10:00:00.000Z"
  }
}
```

### POST `/practice/grade`

Request:

```json
{
  "sessionId": "uuid",
  "questionId": "uuid",
  "userAnswerZh": "我喜欢吃米饭。"
}
```

Response:

```json
{
  "data": {
    "score": 8,
    "isRelevant": true,
    "shortFeedbackVi": "Câu trả lời đúng ý và tự nhiên.",
    "grammarFeedbackVi": "Ngữ pháp ổn với mẫu 我喜欢吃...",
    "vocabularyFeedbackVi": "Từ vựng phù hợp HSK1.",
    "improvedAnswerZh": "我喜欢吃米饭。",
    "improvedAnswerPinyin": "Wǒ xǐhuān chī mǐfàn.",
    "improvedAnswerVi": "Tôi thích ăn cơm.",
    "suggestionVi": "Bạn có thể thêm một món ăn khác để câu phong phú hơn."
  }
}
```

### POST `/practice/sessions/:sessionId/complete`

Response:

```json
{
  "data": {
    "sessionId": "uuid",
    "totalQuestions": 2,
    "answeredQuestions": 2,
    "averageScore": 8.5
  }
}
```

### GET `/progress`

Response:

```json
{
  "data": {
    "totalSessions": 12,
    "averageScore": 8.1,
    "totalQuestions": 24,
    "streakDays": 3,
    "hskProgress": [
      {
        "level": "HSK 1",
        "percent": 70,
        "practicedQuestions": 14,
        "totalQuestions": 20
      }
    ],
    "recentPractice": {
      "level": "HSK 1",
      "topicEmoji": "🍜",
      "topicVi": "Ăn uống",
      "questions": 2,
      "score": 8
    }
  }
}
```

## 7. Frontend Migration Guide

### Mobile env

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

For Android emulator, `localhost` may point to the emulator itself. Use your machine IP or `http://10.0.2.2:3000/api` depending on the device setup.

### API folder

```txt
apps/mobile/src/services/api/
  apiClient.ts
  hskApi.ts
  topicsApi.ts
  questionsApi.ts
  practiceApi.ts
  progressApi.ts
```

### apiClient.ts

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

### hskApi.ts

```ts
import { apiGet } from './apiClient';

export type HskLevelDto = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  vocabCount: number;
  orderIndex: number;
};

export function getHskLevels() {
  return apiGet<{ data: HskLevelDto[] }>('/hsk-levels');
}
```

### topicsApi.ts

```ts
import { apiGet } from './apiClient';

export type TopicDto = {
  id: string;
  key: string;
  titleZh: string | null;
  titleVi: string;
  descriptionVi: string | null;
  emoji: string | null;
  orderIndex: number;
};

export function getTopics() {
  return apiGet<{ data: TopicDto[] }>('/topics');
}
```

### questionsApi.ts

```ts
import { apiGet } from './apiClient';

export type QuestionDto = {
  id: string;
  level: string;
  topic: string;
  topicEmoji: string | null;
  topicVi: string;
  questionZh: string;
  questionPinyin: string;
  questionVi: string;
  sampleAnswerZh: string | null;
  sampleAnswerPinyin: string | null;
  sampleAnswerVi: string | null;
  hintVi: string | null;
};

export function getQuestions(level: string, topic: string) {
  const params = new URLSearchParams({ level, topic });
  return apiGet<{ data: QuestionDto[] }>(`/questions?${params.toString()}`);
}
```

### Screen migration pattern

Use the same pattern in `LevelScreen`, `TopicScreen`, `PracticeScreen`, and `ProgressScreen`:

```ts
const [isLoading, setIsLoading] = useState(false);
const [apiError, setApiError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;

  async function loadData() {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await getQuestions(levelCode, topicKey);
      if (isMounted) {
        setQuestions(response.data);
      }
    } catch (error) {
      if (isMounted) {
        setApiError('Không thể tải dữ liệu mới. Đang dùng dữ liệu mẫu.');
        setQuestions(mockQuestions);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }

  void loadData();

  return () => {
    isMounted = false;
  };
}, [levelCode, topicKey]);
```

Keep fallback mocks until the backend and Supabase data are stable. This lets the current UI keep working even when API, network, or local backend is unavailable.

## 8. AI Prompt and Backend Rules

Prompt template:

```txt
Bạn là giáo viên tiếng Trung cho người Việt.

Hãy chấm câu trả lời theo thang điểm 1-10.
Kiểm tra:
- Câu trả lời có đúng ý câu hỏi không.
- Ngữ pháp có đúng không.
- Từ vựng có phù hợp trình độ không.
- Câu có tự nhiên không.

Không chấm quá khắt khe với HSK1-HSK2.
Nếu câu trả lời trống hoặc không liên quan, điểm tối đa là 3.

Chỉ trả JSON hợp lệ, không markdown, không giải thích ngoài JSON.

Question:
{questionZh}

Question pinyin:
{questionPinyin}

Question Vietnamese:
{questionVi}

Sample answer:
{sampleAnswerZh}

User answer:
{userAnswerZh}

JSON shape:
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
```

Backend should validate the parsed AI result before saving. If AI returns invalid JSON, return a controlled error and avoid inserting incomplete feedback.

## 9. Security Notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` in Expo env.
- Never put `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in Expo env.
- Only backend should call AI providers.
- Only backend should use Supabase service role key.
- `EXPO_PUBLIC_*` variables are public and bundled into the mobile app.
- Use `SUPABASE_SERVICE_ROLE_KEY` only in trusted server code.
- Add request validation with DTOs before accepting practice answers.
- Add rate limiting before exposing AI grading publicly.
- Add auth before storing real user progress.
- When auth is added, verify Supabase access tokens in the Next.js API before trusting `user_id`.
- Consider Row Level Security once direct client access or Supabase Auth becomes part of the app.
