-- HanApp detailed seed data
-- Coverage: HSK1-HSK5 x 6 topics.
-- Each level/topic pair has 3 sample speaking questions.
-- Total questions: 5 levels x 6 topics x 3 questions = 90 questions.
--
-- Run this after creating the schema from HANAPP_BACKEND_ROADMAP.md.
-- Safe to run multiple times: levels/topics are upserted, questions are inserted only if missing.

insert into hsk_levels (code, name, description, vocab_count, order_index, is_active)
values
  ('HSK1', 'HSK 1', 'Nền tảng giao tiếp cơ bản: chào hỏi, giới thiệu, gia đình, ăn uống, mua sắm, đi lại và học tập.', 150, 1, true),
  ('HSK2', 'HSK 2', 'Mở rộng câu đơn, diễn đạt nhu cầu cá nhân, thói quen và các tình huống đời sống thường gặp.', 300, 2, true),
  ('HSK3', 'HSK 3', 'Giao tiếp độc lập hơn, mô tả trải nghiệm, kế hoạch, sở thích và đưa ra lý do đơn giản.', 600, 3, true),
  ('HSK4', 'HSK 4', 'Trao đổi ý kiến, so sánh, giải thích và xử lý các chủ đề học tập/công việc quen thuộc.', 1200, 4, true),
  ('HSK5', 'HSK 5', 'Diễn đạt quan điểm rõ ràng, hiểu nội dung dài hơn và thảo luận các chủ đề trừu tượng hơn.', 2500, 5, true)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  vocab_count = excluded.vocab_count,
  order_index = excluded.order_index,
  is_active = excluded.is_active;

insert into topics (key, title_zh, title_vi, description_vi, emoji, order_index, is_active)
values
  ('intro', '介绍', 'Giới thiệu', 'Luyện giới thiệu bản thân, chào hỏi, quê quán, tính cách, mục tiêu và trải nghiệm cá nhân.', '👋', 1, true),
  ('family', '家庭', 'Gia đình', 'Nói về người thân, quan hệ gia đình, sinh hoạt, trách nhiệm và quan điểm về gia đình.', '👨‍👩‍👧', 2, true),
  ('food', '吃饭', 'Ăn uống', 'Hỏi đáp về món ăn, thói quen ăn uống, gọi món, sức khỏe và văn hóa ẩm thực.', '🍜', 3, true),
  ('shopping', '买东西', 'Mua sắm', 'Luyện hỏi giá, so sánh sản phẩm, mua online, hoàn trả hàng và thói quen tiêu dùng.', '🛍️', 4, true),
  ('travel', '旅行', 'Du lịch', 'Nói về phương tiện, kế hoạch, trải nghiệm, sự cố khi đi du lịch và văn hóa địa phương.', '✈️', 5, true),
  ('study', '学习', 'Học tập', 'Trao đổi về việc học tiếng Trung, phương pháp học, trường lớp, áp lực và mục tiêu học tập.', '📚', 6, true)
on conflict (key) do update set
  title_zh = excluded.title_zh,
  title_vi = excluded.title_vi,
  description_vi = excluded.description_vi,
  emoji = excluded.emoji,
  order_index = excluded.order_index,
  is_active = excluded.is_active;

create or replace function seed_hanapp_question(
  p_level_code text,
  p_topic_key text,
  p_question_zh text,
  p_question_pinyin text,
  p_question_vi text,
  p_sample_answer_zh text,
  p_sample_answer_pinyin text,
  p_sample_answer_vi text,
  p_hint_vi text,
  p_difficulty integer,
  p_order_index integer
)
returns void as $$
declare
  v_level_id uuid;
  v_topic_id uuid;
begin
  select id into v_level_id from hsk_levels where code = p_level_code;
  select id into v_topic_id from topics where key = p_topic_key;

  if v_level_id is null then
    raise exception 'Missing HSK level: %', p_level_code;
  end if;

  if v_topic_id is null then
    raise exception 'Missing topic: %', p_topic_key;
  end if;

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
    v_level_id,
    v_topic_id,
    p_question_zh,
    p_question_pinyin,
    p_question_vi,
    p_sample_answer_zh,
    p_sample_answer_pinyin,
    p_sample_answer_vi,
    p_hint_vi,
    p_difficulty,
    p_order_index,
    true
  where not exists (
    select 1
    from questions q
    where q.hsk_level_id = v_level_id
      and q.topic_id = v_topic_id
      and q.question_zh = p_question_zh
  );
end;
$$ language plpgsql;

-- HSK1 intro
select seed_hanapp_question('HSK1', 'intro', '你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'Bạn tên là gì?', '我叫安。', 'Wǒ jiào Ān.', 'Tôi tên là An.', 'Dùng mẫu câu 我叫... để nói tên.', 1, 1);
select seed_hanapp_question('HSK1', 'intro', '你是哪国人？', 'Nǐ shì nǎ guó rén?', 'Bạn là người nước nào?', '我是越南人。', 'Wǒ shì Yuènán rén.', 'Tôi là người Việt Nam.', 'Dùng 我是...人, ví dụ 越南人.', 1, 2);
select seed_hanapp_question('HSK1', 'intro', '你今年多大？', 'Nǐ jīnnián duō dà?', 'Năm nay bạn bao nhiêu tuổi?', '我今年二十岁。', 'Wǒ jīnnián èrshí suì.', 'Năm nay tôi 20 tuổi.', 'Dùng 我今年...岁.', 1, 3);

-- HSK1 family
select seed_hanapp_question('HSK1', 'family', '你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'Nhà bạn có mấy người?', '我家有四口人。', 'Wǒ jiā yǒu sì kǒu rén.', 'Nhà tôi có bốn người.', 'Dùng 我家有...口人.', 1, 1);
select seed_hanapp_question('HSK1', 'family', '你有哥哥吗？', 'Nǐ yǒu gēge ma?', 'Bạn có anh trai không?', '我没有哥哥，我有一个姐姐。', 'Wǒ méiyǒu gēge, wǒ yǒu yí ge jiějie.', 'Tôi không có anh trai, tôi có một chị gái.', 'Dùng 有 hoặc 没有.', 1, 2);
select seed_hanapp_question('HSK1', 'family', '你爸爸做什么工作？', 'Nǐ bàba zuò shénme gōngzuò?', 'Bố bạn làm nghề gì?', '我爸爸是老师。', 'Wǒ bàba shì lǎoshī.', 'Bố tôi là giáo viên.', 'Dùng 我爸爸是...', 2, 3);

-- HSK1 food
select seed_hanapp_question('HSK1', 'food', '你喜欢吃什么？', 'Nǐ xǐhuān chī shénme?', 'Bạn thích ăn gì?', '我喜欢吃米饭。', 'Wǒ xǐhuān chī mǐfàn.', 'Tôi thích ăn cơm.', 'Dùng 我喜欢吃...', 1, 1);
select seed_hanapp_question('HSK1', 'food', '你想喝什么？', 'Nǐ xiǎng hē shénme?', 'Bạn muốn uống gì?', '我想喝茶。', 'Wǒ xiǎng hē chá.', 'Tôi muốn uống trà.', 'Dùng 我想喝...', 1, 2);
select seed_hanapp_question('HSK1', 'food', '这个菜好吃吗？', 'Zhège cài hǎochī ma?', 'Món này có ngon không?', '这个菜很好吃。', 'Zhège cài hěn hǎochī.', 'Món này rất ngon.', 'Dùng 很好吃 hoặc 不好吃.', 1, 3);

-- HSK1 shopping
select seed_hanapp_question('HSK1', 'shopping', '这个多少钱？', 'Zhège duōshao qián?', 'Cái này bao nhiêu tiền?', '这个十块钱。', 'Zhège shí kuài qián.', 'Cái này mười tệ.', 'Dùng 这个...块钱.', 1, 1);
select seed_hanapp_question('HSK1', 'shopping', '你想买什么？', 'Nǐ xiǎng mǎi shénme?', 'Bạn muốn mua gì?', '我想买水果。', 'Wǒ xiǎng mǎi shuǐguǒ.', 'Tôi muốn mua trái cây.', 'Dùng 我想买...', 1, 2);
select seed_hanapp_question('HSK1', 'shopping', '你喜欢什么颜色？', 'Nǐ xǐhuān shénme yánsè?', 'Bạn thích màu gì?', '我喜欢蓝色。', 'Wǒ xǐhuān lán sè.', 'Tôi thích màu xanh dương.', 'Dùng 我喜欢...色.', 1, 3);

-- HSK1 travel
select seed_hanapp_question('HSK1', 'travel', '你想去哪儿？', 'Nǐ xiǎng qù nǎr?', 'Bạn muốn đi đâu?', '我想去北京。', 'Wǒ xiǎng qù Běijīng.', 'Tôi muốn đi Bắc Kinh.', 'Dùng 我想去...', 1, 1);
select seed_hanapp_question('HSK1', 'travel', '你怎么去学校？', 'Nǐ zěnme qù xuéxiào?', 'Bạn đi đến trường bằng gì?', '我坐车去学校。', 'Wǒ zuò chē qù xuéxiào.', 'Tôi đi xe đến trường.', 'Dùng 坐车, 走路, 骑车.', 1, 2);
select seed_hanapp_question('HSK1', 'travel', '你今天去哪儿了？', 'Nǐ jīntiān qù nǎr le?', 'Hôm nay bạn đã đi đâu?', '我今天去商店了。', 'Wǒ jīntiān qù shāngdiàn le.', 'Hôm nay tôi đã đi cửa hàng.', 'Dùng 了 để nói việc đã xảy ra.', 2, 3);

-- HSK1 study
select seed_hanapp_question('HSK1', 'study', '你学习什么？', 'Nǐ xuéxí shénme?', 'Bạn học gì?', '我学习中文。', 'Wǒ xuéxí Zhōngwén.', 'Tôi học tiếng Trung.', 'Dùng 我学习...', 1, 1);
select seed_hanapp_question('HSK1', 'study', '你每天学习吗？', 'Nǐ měitiān xuéxí ma?', 'Bạn có học mỗi ngày không?', '我每天学习。', 'Wǒ měitiān xuéxí.', 'Tôi học mỗi ngày.', 'Dùng 每天 để nói thói quen.', 1, 2);
select seed_hanapp_question('HSK1', 'study', '你觉得中文难吗？', 'Nǐ juéde Zhōngwén nán ma?', 'Bạn thấy tiếng Trung khó không?', '我觉得中文有一点儿难。', 'Wǒ juéde Zhōngwén yǒu yìdiǎnr nán.', 'Tôi thấy tiếng Trung hơi khó.', 'Dùng 我觉得...', 2, 3);

-- HSK2 intro
select seed_hanapp_question('HSK2', 'intro', '请你介绍一下自己。', 'Qǐng nǐ jièshào yíxià zìjǐ.', 'Bạn hãy giới thiệu bản thân một chút.', '大家好，我叫安，今年二十岁，是越南人。', 'Dàjiā hǎo, wǒ jiào Ān, jīnnián èrshí suì, shì Yuènán rén.', 'Chào mọi người, tôi tên là An, năm nay 20 tuổi, là người Việt Nam.', 'Kết hợp tên, tuổi, quốc tịch trong một câu.', 2, 1);
select seed_hanapp_question('HSK2', 'intro', '你为什么学习中文？', 'Nǐ wèishénme xuéxí Zhōngwén?', 'Vì sao bạn học tiếng Trung?', '因为我喜欢中国文化。', 'Yīnwèi wǒ xǐhuān Zhōngguó wénhuà.', 'Vì tôi thích văn hóa Trung Quốc.', 'Dùng 因为 để nêu lý do.', 2, 2);
select seed_hanapp_question('HSK2', 'intro', '你平时喜欢做什么？', 'Nǐ píngshí xǐhuān zuò shénme?', 'Bình thường bạn thích làm gì?', '我平时喜欢听音乐和看书。', 'Wǒ píngshí xǐhuān tīng yīnyuè hé kàn shū.', 'Bình thường tôi thích nghe nhạc và đọc sách.', 'Dùng 喜欢 + hoạt động.', 2, 3);

-- HSK2 family
select seed_hanapp_question('HSK2', 'family', '你和家人常常一起做什么？', 'Nǐ hé jiārén chángcháng yìqǐ zuò shénme?', 'Bạn và gia đình thường làm gì cùng nhau?', '我们常常一起吃饭、看电视。', 'Wǒmen chángcháng yìqǐ chīfàn, kàn diànshì.', 'Chúng tôi thường ăn cơm và xem TV cùng nhau.', 'Dùng 和...一起...', 2, 1);
select seed_hanapp_question('HSK2', 'family', '你觉得你的妈妈怎么样？', 'Nǐ juéde nǐ de māma zěnmeyàng?', 'Bạn thấy mẹ bạn là người thế nào?', '我觉得我妈妈很温柔，也很忙。', 'Wǒ juéde wǒ māma hěn wēnróu, yě hěn máng.', 'Tôi thấy mẹ tôi rất dịu dàng, cũng rất bận.', 'Dùng 我觉得...很...', 2, 2);
select seed_hanapp_question('HSK2', 'family', '你周末会回家吗？', 'Nǐ zhōumò huì huí jiā ma?', 'Cuối tuần bạn có về nhà không?', '我周末会回家看家人。', 'Wǒ zhōumò huì huí jiā kàn jiārén.', 'Cuối tuần tôi sẽ về nhà thăm gia đình.', 'Dùng 会 để nói dự định hoặc khả năng.', 2, 3);

-- HSK2 food
select seed_hanapp_question('HSK2', 'food', '你早饭一般吃什么？', 'Nǐ zǎofàn yìbān chī shénme?', 'Bữa sáng bạn thường ăn gì?', '我早饭一般吃面包，喝牛奶。', 'Wǒ zǎofàn yìbān chī miànbāo, hē niúnǎi.', 'Bữa sáng tôi thường ăn bánh mì và uống sữa.', 'Dùng 一般 để nói thói quen.', 2, 1);
select seed_hanapp_question('HSK2', 'food', '你喜欢在家吃饭还是在外面吃饭？', 'Nǐ xǐhuān zài jiā chīfàn háishi zài wàimiàn chīfàn?', 'Bạn thích ăn ở nhà hay ăn bên ngoài?', '我喜欢在家吃饭，因为比较健康。', 'Wǒ xǐhuān zài jiā chīfàn, yīnwèi bǐjiào jiànkāng.', 'Tôi thích ăn ở nhà vì tương đối tốt cho sức khỏe.', 'Dùng 还是 để chọn một trong hai.', 2, 2);
select seed_hanapp_question('HSK2', 'food', '这个菜有点儿辣，你能吃吗？', 'Zhège cài yǒudiǎnr là, nǐ néng chī ma?', 'Món này hơi cay, bạn ăn được không?', '我能吃一点儿辣。', 'Wǒ néng chī yìdiǎnr là.', 'Tôi ăn cay được một chút.', 'Dùng 能 để nói khả năng.', 2, 3);

-- HSK2 shopping
select seed_hanapp_question('HSK2', 'shopping', '你喜欢在网上买东西吗？', 'Nǐ xǐhuān zài wǎngshàng mǎi dōngxi ma?', 'Bạn có thích mua đồ online không?', '我喜欢在网上买东西，因为很方便。', 'Wǒ xǐhuān zài wǎngshàng mǎi dōngxi, yīnwèi hěn fāngbiàn.', 'Tôi thích mua đồ online vì rất tiện.', 'Dùng 因为 để giải thích lý do.', 2, 1);
select seed_hanapp_question('HSK2', 'shopping', '这件衣服你觉得怎么样？', 'Zhè jiàn yīfu nǐ juéde zěnmeyàng?', 'Bạn thấy bộ/quần áo này thế nào?', '我觉得这件衣服很好看，但是有点儿贵。', 'Wǒ juéde zhè jiàn yīfu hěn hǎokàn, dànshì yǒudiǎnr guì.', 'Tôi thấy bộ này đẹp, nhưng hơi đắt.', 'Dùng 但是 để nối ý trái ngược.', 2, 2);
select seed_hanapp_question('HSK2', 'shopping', '你买东西的时候最看重什么？', 'Nǐ mǎi dōngxi de shíhou zuì kànzhòng shénme?', 'Khi mua đồ, bạn coi trọng điều gì nhất?', '我最看重价格和质量。', 'Wǒ zuì kànzhòng jiàgé hé zhìliàng.', 'Tôi coi trọng giá cả và chất lượng nhất.', 'Dùng 最 để nhấn mạnh nhất.', 3, 3);

-- HSK2 travel
select seed_hanapp_question('HSK2', 'travel', '你去过中国吗？', 'Nǐ qùguo Zhōngguó ma?', 'Bạn đã từng đi Trung Quốc chưa?', '我还没去过中国，但是很想去。', 'Wǒ hái méi qùguo Zhōngguó, dànshì hěn xiǎng qù.', 'Tôi chưa từng đi Trung Quốc, nhưng rất muốn đi.', 'Dùng 过 để nói kinh nghiệm từng làm.', 2, 1);
select seed_hanapp_question('HSK2', 'travel', '你旅行的时候喜欢坐什么车？', 'Nǐ lǚxíng de shíhou xǐhuān zuò shénme chē?', 'Khi du lịch bạn thích đi phương tiện gì?', '我喜欢坐火车，因为可以看风景。', 'Wǒ xǐhuān zuò huǒchē, yīnwèi kěyǐ kàn fēngjǐng.', 'Tôi thích đi tàu hỏa vì có thể ngắm cảnh.', 'Dùng 可以 để nói điều có thể làm.', 2, 2);
select seed_hanapp_question('HSK2', 'travel', '你周末想去哪儿玩？', 'Nǐ zhōumò xiǎng qù nǎr wán?', 'Cuối tuần bạn muốn đi đâu chơi?', '我周末想去海边玩。', 'Wǒ zhōumò xiǎng qù hǎibiān wán.', 'Cuối tuần tôi muốn đi biển chơi.', 'Dùng 想去...玩.', 2, 3);

-- HSK2 study
select seed_hanapp_question('HSK2', 'study', '你每天学习中文多长时间？', 'Nǐ měitiān xuéxí Zhōngwén duō cháng shíjiān?', 'Mỗi ngày bạn học tiếng Trung bao lâu?', '我每天学习中文一个小时。', 'Wǒ měitiān xuéxí Zhōngwén yí ge xiǎoshí.', 'Mỗi ngày tôi học tiếng Trung một tiếng.', 'Dùng thời lượng sau động từ.', 2, 1);
select seed_hanapp_question('HSK2', 'study', '你觉得听力难还是口语难？', 'Nǐ juéde tīnglì nán háishi kǒuyǔ nán?', 'Bạn thấy nghe khó hay nói khó?', '我觉得口语比较难。', 'Wǒ juéde kǒuyǔ bǐjiào nán.', 'Tôi thấy nói tương đối khó.', 'Dùng 比较 để nói tương đối.', 2, 2);
select seed_hanapp_question('HSK2', 'study', '你怎么复习生词？', 'Nǐ zěnme fùxí shēngcí?', 'Bạn ôn từ mới như thế nào?', '我用手机复习生词，也会大声读。', 'Wǒ yòng shǒujī fùxí shēngcí, yě huì dàshēng dú.', 'Tôi dùng điện thoại ôn từ mới, cũng đọc to.', 'Dùng 用... để nói công cụ.', 3, 3);

-- HSK3 intro
select seed_hanapp_question('HSK3', 'intro', '请介绍一下你的兴趣爱好。', 'Qǐng jièshào yíxià nǐ de xìngqù àihào.', 'Hãy giới thiệu sở thích của bạn.', '我的兴趣爱好是跑步和学习语言，因为它们让我很开心。', 'Wǒ de xìngqù àihào shì pǎobù hé xuéxí yǔyán, yīnwèi tāmen ràng wǒ hěn kāixīn.', 'Sở thích của tôi là chạy bộ và học ngôn ngữ vì chúng làm tôi vui.', 'Dùng 因为 và 让 để mở rộng câu.', 3, 1);
select seed_hanapp_question('HSK3', 'intro', '你觉得自己是一个什么样的人？', 'Nǐ juéde zìjǐ shì yí ge shénme yàng de rén?', 'Bạn thấy mình là người như thế nào?', '我觉得自己比较认真，也喜欢帮助别人。', 'Wǒ juéde zìjǐ bǐjiào rènzhēn, yě xǐhuān bāngzhù biérén.', 'Tôi thấy mình khá nghiêm túc và thích giúp người khác.', 'Dùng 比较 + tính từ để miêu tả.', 3, 2);
select seed_hanapp_question('HSK3', 'intro', '你最近有什么新的计划？', 'Nǐ zuìjìn yǒu shénme xīn de jìhuà?', 'Gần đây bạn có kế hoạch mới nào không?', '我最近计划每天练习中文口语，希望说得更自然。', 'Wǒ zuìjìn jìhuà měitiān liànxí Zhōngwén kǒuyǔ, xīwàng shuō de gèng zìrán.', 'Gần đây tôi định luyện nói tiếng Trung mỗi ngày, hy vọng nói tự nhiên hơn.', 'Dùng 希望 để nói mong muốn.', 3, 3);

-- HSK3 family
select seed_hanapp_question('HSK3', 'family', '你家谁对你的影响最大？', 'Nǐ jiā shéi duì nǐ de yǐngxiǎng zuì dà?', 'Trong gia đình, ai ảnh hưởng đến bạn nhiều nhất?', '我妈妈对我的影响最大，因为她很努力，也很关心我。', 'Wǒ māma duì wǒ de yǐngxiǎng zuì dà, yīnwèi tā hěn nǔlì, yě hěn guānxīn wǒ.', 'Mẹ ảnh hưởng đến tôi nhiều nhất vì bà rất nỗ lực và quan tâm tôi.', 'Dùng 对...的影响 để nói ảnh hưởng.', 3, 1);
select seed_hanapp_question('HSK3', 'family', '你和家人意见不一样的时候怎么办？', 'Nǐ hé jiārén yìjiàn bù yíyàng de shíhou zěnme bàn?', 'Khi bạn và gia đình không cùng ý kiến thì làm thế nào?', '我会先听他们的想法，然后再说自己的意见。', 'Wǒ huì xiān tīng tāmen de xiǎngfǎ, ránhòu zài shuō zìjǐ de yìjiàn.', 'Tôi sẽ nghe suy nghĩ của họ trước, sau đó nói ý kiến của mình.', 'Dùng 先...然后... để trình bày thứ tự.', 3, 2);
select seed_hanapp_question('HSK3', 'family', '你觉得家人之间最重要的是什么？', 'Nǐ juéde jiārén zhījiān zuì zhòngyào de shì shénme?', 'Bạn nghĩ điều quan trọng nhất giữa người thân là gì?', '我觉得最重要的是理解和关心。', 'Wǒ juéde zuì zhòngyào de shì lǐjiě hé guānxīn.', 'Tôi nghĩ quan trọng nhất là thấu hiểu và quan tâm.', 'Dùng 最重要的是... để nêu quan điểm.', 3, 3);

-- HSK3 food
select seed_hanapp_question('HSK3', 'food', '你最喜欢的一道菜是什么？为什么？', 'Nǐ zuì xǐhuān de yí dào cài shì shénme? Wèishénme?', 'Món bạn thích nhất là gì? Vì sao?', '我最喜欢牛肉面，因为味道很好，而且很有营养。', 'Wǒ zuì xǐhuān niúròu miàn, yīnwèi wèidào hěn hǎo, érqiě hěn yǒu yíngyǎng.', 'Tôi thích nhất mì bò vì hương vị ngon và bổ dưỡng.', 'Dùng 而且 để bổ sung ý.', 3, 1);
select seed_hanapp_question('HSK3', 'food', '你觉得健康饮食应该注意什么？', 'Nǐ juéde jiànkāng yǐnshí yīnggāi zhùyì shénme?', 'Bạn nghĩ ăn uống lành mạnh nên chú ý điều gì?', '我觉得应该少吃太甜太油的东西，多吃水果和蔬菜。', 'Wǒ juéde yīnggāi shǎo chī tài tián tài yóu de dōngxi, duō chī shuǐguǒ hé shūcài.', 'Tôi nghĩ nên ăn ít đồ quá ngọt, quá dầu, ăn nhiều trái cây và rau.', 'Dùng 应该, 少, 多 để đưa lời khuyên.', 3, 2);
select seed_hanapp_question('HSK3', 'food', '如果朋友来你家，你会准备什么菜？', 'Rúguǒ péngyou lái nǐ jiā, nǐ huì zhǔnbèi shénme cài?', 'Nếu bạn bè đến nhà, bạn sẽ chuẩn bị món gì?', '如果朋友来我家，我会准备越南春卷和米饭。', 'Rúguǒ péngyou lái wǒ jiā, wǒ huì zhǔnbèi Yuènán chūnjuǎn hé mǐfàn.', 'Nếu bạn bè đến nhà tôi, tôi sẽ chuẩn bị nem Việt Nam và cơm.', 'Dùng 如果...会... để nói giả định.', 3, 3);

-- HSK3 shopping
select seed_hanapp_question('HSK3', 'shopping', '你买东西前会比较价格吗？', 'Nǐ mǎi dōngxi qián huì bǐjiào jiàgé ma?', 'Trước khi mua đồ bạn có so sánh giá không?', '我会比较价格，也会看别人的评价。', 'Wǒ huì bǐjiào jiàgé, yě huì kàn biérén de píngjià.', 'Tôi sẽ so sánh giá và xem đánh giá của người khác.', 'Dùng 会...也会... để liệt kê hành động.', 3, 1);
select seed_hanapp_question('HSK3', 'shopping', '你有没有买过不满意的东西？', 'Nǐ yǒu méiyǒu mǎiguo bù mǎnyì de dōngxi?', 'Bạn đã từng mua món gì không hài lòng chưa?', '我买过一件衣服，大小不合适，所以退了。', 'Wǒ mǎiguo yí jiàn yīfu, dàxiǎo bù héshì, suǒyǐ tuì le.', 'Tôi từng mua một bộ đồ, kích cỡ không phù hợp nên đã trả.', 'Dùng 过 và 所以 để kể trải nghiệm.', 3, 2);
select seed_hanapp_question('HSK3', 'shopping', '你觉得网上购物有什么优点？', 'Nǐ juéde wǎngshàng gòuwù yǒu shénme yōudiǎn?', 'Bạn thấy mua sắm online có ưu điểm gì?', '我觉得网上购物很方便，选择也很多。', 'Wǒ juéde wǎngshàng gòuwù hěn fāngbiàn, xuǎnzé yě hěn duō.', 'Tôi thấy mua sắm online rất tiện, lựa chọn cũng nhiều.', 'Dùng 优点 để nói điểm tốt.', 3, 3);

-- HSK3 travel
select seed_hanapp_question('HSK3', 'travel', '你最难忘的一次旅行是哪一次？', 'Nǐ zuì nánwàng de yí cì lǚxíng shì nǎ yí cì?', 'Chuyến du lịch đáng nhớ nhất của bạn là chuyến nào?', '我最难忘的一次旅行是去岘港，因为那里的海很漂亮。', 'Wǒ zuì nánwàng de yí cì lǚxíng shì qù Xiàngǎng, yīnwèi nàlǐ de hǎi hěn piàoliang.', 'Chuyến đáng nhớ nhất của tôi là đi Đà Nẵng vì biển ở đó rất đẹp.', 'Dùng 最难忘的...是...', 3, 1);
select seed_hanapp_question('HSK3', 'travel', '旅行前你一般会准备什么？', 'Lǚxíng qián nǐ yìbān huì zhǔnbèi shénme?', 'Trước khi du lịch bạn thường chuẩn bị gì?', '我一般会准备护照、衣服和一些药。', 'Wǒ yìbān huì zhǔnbèi hùzhào, yīfu hé yìxiē yào.', 'Tôi thường chuẩn bị hộ chiếu, quần áo và một ít thuốc.', 'Dùng 一般会 để nói thói quen.', 3, 2);
select seed_hanapp_question('HSK3', 'travel', '如果飞机晚点了，你会怎么办？', 'Rúguǒ fēijī wǎndiǎn le, nǐ huì zěnme bàn?', 'Nếu máy bay bị trễ, bạn sẽ làm gì?', '如果飞机晚点了，我会先联系酒店，然后在机场等。', 'Rúguǒ fēijī wǎndiǎn le, wǒ huì xiān liánxì jiǔdiàn, ránhòu zài jīchǎng děng.', 'Nếu máy bay trễ, tôi sẽ liên hệ khách sạn trước rồi chờ ở sân bay.', 'Dùng 如果 và 先...然后...', 3, 3);

-- HSK3 study
select seed_hanapp_question('HSK3', 'study', '你学习中文遇到的最大困难是什么？', 'Nǐ xuéxí Zhōngwén yùdào de zuì dà kùnnan shì shénme?', 'Khó khăn lớn nhất khi học tiếng Trung của bạn là gì?', '我遇到的最大困难是听力，因为中国人说得很快。', 'Wǒ yùdào de zuì dà kùnnan shì tīnglì, yīnwèi Zhōngguó rén shuō de hěn kuài.', 'Khó khăn lớn nhất của tôi là nghe vì người Trung Quốc nói rất nhanh.', 'Dùng 遇到的最大困难是...', 3, 1);
select seed_hanapp_question('HSK3', 'study', '你用什么方法提高口语？', 'Nǐ yòng shénme fāngfǎ tígāo kǒuyǔ?', 'Bạn dùng phương pháp gì để cải thiện nói?', '我每天跟着录音读，也会和朋友练习。', 'Wǒ měitiān gēnzhe lùyīn dú, yě huì hé péngyou liànxí.', 'Tôi đọc theo ghi âm mỗi ngày và luyện với bạn.', 'Dùng 跟着... để nói làm theo.', 3, 2);
select seed_hanapp_question('HSK3', 'study', '你觉得考试重要吗？为什么？', 'Nǐ juéde kǎoshì zhòngyào ma? Wèishénme?', 'Bạn thấy thi cử có quan trọng không? Vì sao?', '我觉得考试重要，因为它可以帮助我了解自己的水平。', 'Wǒ juéde kǎoshì zhòngyào, yīnwèi tā kěyǐ bāngzhù wǒ liǎojiě zìjǐ de shuǐpíng.', 'Tôi thấy thi cử quan trọng vì nó giúp tôi hiểu trình độ của mình.', 'Dùng 可以帮助我... để giải thích lợi ích.', 3, 3);

-- HSK4 intro
select seed_hanapp_question('HSK4', 'intro', '请谈谈你最近的一个变化。', 'Qǐng tántan nǐ zuìjìn de yí ge biànhuà.', 'Hãy nói về một thay đổi gần đây của bạn.', '最近我开始早起学习中文，这让我一天更有精神。', 'Zuìjìn wǒ kāishǐ zǎoqǐ xuéxí Zhōngwén, zhè ràng wǒ yì tiān gèng yǒu jīngshén.', 'Gần đây tôi bắt đầu dậy sớm học tiếng Trung, điều này khiến cả ngày tôi có tinh thần hơn.', 'Dùng 这让我... để nói tác động.', 4, 1);
select seed_hanapp_question('HSK4', 'intro', '你认为自己的优点和缺点是什么？', 'Nǐ rènwéi zìjǐ de yōudiǎn hé quēdiǎn shì shénme?', 'Bạn cho rằng ưu và nhược điểm của mình là gì?', '我的优点是做事认真，缺点是有时候不够自信。', 'Wǒ de yōudiǎn shì zuò shì rènzhēn, quēdiǎn shì yǒu shíhou bú gòu zìxìn.', 'Ưu điểm của tôi là làm việc nghiêm túc, nhược điểm là đôi khi chưa đủ tự tin.', 'Dùng 优点是..., 缺点是...', 4, 2);
select seed_hanapp_question('HSK4', 'intro', '如果要给第一次见面的人留下好印象，你会怎么做？', 'Rúguǒ yào gěi dì yī cì jiànmiàn de rén liúxià hǎo yìnxiàng, nǐ huì zěnme zuò?', 'Nếu muốn tạo ấn tượng tốt với người gặp lần đầu, bạn sẽ làm gì?', '我会保持微笑，认真听对方说话，并且礼貌地介绍自己。', 'Wǒ huì bǎochí wēixiào, rènzhēn tīng duìfāng shuōhuà, bìngqiě lǐmào de jièshào zìjǐ.', 'Tôi sẽ giữ nụ cười, lắng nghe nghiêm túc và giới thiệu bản thân lịch sự.', 'Dùng 并且 để nối hành động.', 4, 3);

-- HSK4 family
select seed_hanapp_question('HSK4', 'family', '你觉得年轻人应该和父母住在一起吗？', 'Nǐ juéde niánqīng rén yīnggāi hé fùmǔ zhù zài yìqǐ ma?', 'Bạn nghĩ người trẻ nên sống cùng bố mẹ không?', '我觉得要看情况。如果工作离家近，住在一起可以互相照顾。', 'Wǒ juéde yào kàn qíngkuàng. Rúguǒ gōngzuò lí jiā jìn, zhù zài yìqǐ kěyǐ hùxiāng zhàogù.', 'Tôi nghĩ còn tùy tình huống. Nếu chỗ làm gần nhà, sống cùng nhau có thể chăm sóc lẫn nhau.', 'Dùng 要看情况 để trả lời linh hoạt.', 4, 1);
select seed_hanapp_question('HSK4', 'family', '家庭教育对孩子有什么影响？', 'Jiātíng jiàoyù duì háizi yǒu shénme yǐngxiǎng?', 'Giáo dục gia đình ảnh hưởng gì đến trẻ em?', '家庭教育会影响孩子的性格和习惯，所以父母的陪伴很重要。', 'Jiātíng jiàoyù huì yǐngxiǎng háizi de xìnggé hé xíguàn, suǒyǐ fùmǔ de péibàn hěn zhòngyào.', 'Giáo dục gia đình ảnh hưởng đến tính cách và thói quen của trẻ, nên sự đồng hành của bố mẹ rất quan trọng.', 'Dùng 会影响...所以...', 4, 2);
select seed_hanapp_question('HSK4', 'family', '当家人不理解你时，你会怎么沟通？', 'Dāng jiārén bù lǐjiě nǐ shí, nǐ huì zěnme gōutōng?', 'Khi người thân không hiểu bạn, bạn sẽ giao tiếp thế nào?', '我会先冷静下来，再把自己的想法说清楚，尽量避免吵架。', 'Wǒ huì xiān lěngjìng xiàlai, zài bǎ zìjǐ de xiǎngfǎ shuō qīngchu, jìnliàng bìmiǎn chǎojià.', 'Tôi sẽ bình tĩnh trước, rồi nói rõ suy nghĩ của mình, cố gắng tránh cãi nhau.', 'Dùng 把...说清楚 để nói làm rõ.', 4, 3);

-- HSK4 food
select seed_hanapp_question('HSK4', 'food', '你怎么看外卖越来越流行这个现象？', 'Nǐ zěnme kàn wàimài yuè lái yuè liúxíng zhège xiànxiàng?', 'Bạn nhìn nhận thế nào về việc đồ ăn giao tận nơi ngày càng phổ biến?', '我觉得外卖很方便，但如果经常吃，可能不太健康。', 'Wǒ juéde wàimài hěn fāngbiàn, dàn rúguǒ jīngcháng chī, kěnéng bú tài jiànkāng.', 'Tôi thấy đồ ăn giao tận nơi rất tiện, nhưng nếu ăn thường xuyên có thể không tốt cho sức khỏe.', 'Dùng 越来越 và 可能 để phân tích.', 4, 1);
select seed_hanapp_question('HSK4', 'food', '你认为饮食习惯会影响工作效率吗？', 'Nǐ rènwéi yǐnshí xíguàn huì yǐngxiǎng gōngzuò xiàolǜ ma?', 'Bạn cho rằng thói quen ăn uống ảnh hưởng hiệu suất làm việc không?', '会。如果吃得太油或者太少，人就容易累，效率也会下降。', 'Huì. Rúguǒ chī de tài yóu huòzhě tài shǎo, rén jiù róngyì lèi, xiàolǜ yě huì xiàjiàng.', 'Có. Nếu ăn quá dầu hoặc quá ít thì con người dễ mệt, hiệu suất cũng giảm.', 'Dùng 如果...就... để nêu hệ quả.', 4, 2);
select seed_hanapp_question('HSK4', 'food', '请介绍一道你们国家有代表性的菜。', 'Qǐng jièshào yí dào nǐmen guójiā yǒu dàibiǎoxìng de cài.', 'Hãy giới thiệu một món ăn tiêu biểu của nước bạn.', '越南河粉很有代表性，汤很香，通常会放牛肉、青菜和香草。', 'Yuènán héfěn hěn yǒu dàibiǎoxìng, tāng hěn xiāng, tōngcháng huì fàng niúròu, qīngcài hé xiāngcǎo.', 'Phở Việt Nam rất tiêu biểu, nước dùng thơm, thường có thịt bò, rau xanh và rau thơm.', 'Dùng 有代表性 và 通常 để giới thiệu.', 4, 3);

-- HSK4 shopping
select seed_hanapp_question('HSK4', 'shopping', '你认为年轻人应该怎样控制消费？', 'Nǐ rènwéi niánqīng rén yīnggāi zěnyàng kòngzhì xiāofèi?', 'Bạn nghĩ người trẻ nên kiểm soát tiêu dùng thế nào?', '我认为应该先做预算，分清楚需要和想要的东西。', 'Wǒ rènwéi yīnggāi xiān zuò yùsuàn, fēn qīngchu xūyào hé xiǎng yào de dōngxi.', 'Tôi nghĩ nên lập ngân sách trước, phân biệt rõ thứ cần và thứ muốn.', 'Dùng 分清楚...和...', 4, 1);
select seed_hanapp_question('HSK4', 'shopping', '你会因为广告而买东西吗？为什么？', 'Nǐ huì yīnwèi guǎnggào ér mǎi dōngxi ma? Wèishénme?', 'Bạn có mua đồ vì quảng cáo không? Vì sao?', '有时候会，但我现在会先看评价，不会只相信广告。', 'Yǒu shíhou huì, dàn wǒ xiànzài huì xiān kàn píngjià, bú huì zhǐ xiāngxìn guǎnggào.', 'Đôi khi có, nhưng bây giờ tôi sẽ xem đánh giá trước, không chỉ tin quảng cáo.', 'Dùng 不会只... để phủ định tuyệt đối.', 4, 2);
select seed_hanapp_question('HSK4', 'shopping', '如果买到质量差的东西，你会怎么处理？', 'Rúguǒ mǎi dào zhìliàng chà de dōngxi, nǐ huì zěnme chǔlǐ?', 'Nếu mua phải đồ chất lượng kém, bạn xử lý thế nào?', '我会联系商家，说明问题，并要求退货或者换货。', 'Wǒ huì liánxì shāngjiā, shuōmíng wèntí, bìng yāoqiú tuìhuò huòzhě huànhuò.', 'Tôi sẽ liên hệ người bán, giải thích vấn đề và yêu cầu trả hoặc đổi hàng.', 'Dùng 并 để nối hành động trang trọng hơn.', 4, 3);

-- HSK4 travel
select seed_hanapp_question('HSK4', 'travel', '自由行和跟团游，你更喜欢哪一种？', 'Zìyóuxíng hé gēntuányóu, nǐ gèng xǐhuān nǎ yì zhǒng?', 'Du lịch tự túc và theo tour, bạn thích loại nào hơn?', '我更喜欢自由行，因为时间比较灵活，可以按自己的兴趣安排。', 'Wǒ gèng xǐhuān zìyóuxíng, yīnwèi shíjiān bǐjiào línghuó, kěyǐ àn zìjǐ de xìngqù ānpái.', 'Tôi thích du lịch tự túc hơn vì thời gian linh hoạt, có thể sắp xếp theo sở thích.', 'Dùng 更喜欢 và 按...安排.', 4, 1);
select seed_hanapp_question('HSK4', 'travel', '旅行中遇到突发情况时，你会怎么做？', 'Lǚxíng zhōng yùdào tūfā qíngkuàng shí, nǐ huì zěnme zuò?', 'Khi gặp tình huống bất ngờ trong chuyến đi, bạn sẽ làm gì?', '我会先保持冷静，然后联系酒店、航空公司或者当地朋友。', 'Wǒ huì xiān bǎochí lěngjìng, ránhòu liánxì jiǔdiàn, hángkōng gōngsī huòzhě dāngdì péngyou.', 'Tôi sẽ giữ bình tĩnh trước, sau đó liên hệ khách sạn, hãng bay hoặc bạn bè địa phương.', 'Dùng 保持冷静 để nói xử lý tình huống.', 4, 2);
select seed_hanapp_question('HSK4', 'travel', '旅游能给人带来什么收获？', 'Lǚyóu néng gěi rén dàilái shénme shōuhuò?', 'Du lịch có thể mang lại thu hoạch gì cho con người?', '旅游能让人放松，也能帮助我们了解不同的文化。', 'Lǚyóu néng ràng rén fàngsōng, yě néng bāngzhù wǒmen liǎojiě bùtóng de wénhuà.', 'Du lịch giúp con người thư giãn và hiểu các nền văn hóa khác nhau.', 'Dùng 能让人...也能帮助...', 4, 3);

-- HSK4 study
select seed_hanapp_question('HSK4', 'study', '你认为自学语言最大的挑战是什么？', 'Nǐ rènwéi zìxué yǔyán zuì dà de tiǎozhàn shì shénme?', 'Bạn cho rằng thách thức lớn nhất khi tự học ngôn ngữ là gì?', '我认为最大的挑战是坚持，因为没有老师监督，很容易放弃。', 'Wǒ rènwéi zuì dà de tiǎozhàn shì jiānchí, yīnwèi méiyǒu lǎoshī jiāndū, hěn róngyì fàngqì.', 'Tôi cho rằng thách thức lớn nhất là kiên trì vì không có giáo viên giám sát nên rất dễ bỏ cuộc.', 'Dùng 最大的挑战是...', 4, 1);
select seed_hanapp_question('HSK4', 'study', '线上学习和线下学习有什么不同？', 'Xiànshàng xuéxí hé xiànxià xuéxí yǒu shénme bùtóng?', 'Học online và học trực tiếp khác nhau thế nào?', '线上学习更方便，线下学习互动更多，各有优点。', 'Xiànshàng xuéxí gèng fāngbiàn, xiànxià xuéxí hùdòng gèng duō, gè yǒu yōudiǎn.', 'Học online tiện hơn, học trực tiếp tương tác nhiều hơn, mỗi bên đều có ưu điểm.', 'Dùng 各有优点 để kết luận cân bằng.', 4, 2);
select seed_hanapp_question('HSK4', 'study', '你怎么安排学习和休息的时间？', 'Nǐ zěnme ānpái xuéxí hé xiūxi de shíjiān?', 'Bạn sắp xếp thời gian học và nghỉ như thế nào?', '我会把学习任务分成几个小部分，完成以后休息十分钟。', 'Wǒ huì bǎ xuéxí rènwu fēn chéng jǐ ge xiǎo bùfen, wánchéng yǐhòu xiūxi shí fēnzhōng.', 'Tôi chia nhiệm vụ học thành vài phần nhỏ, hoàn thành xong thì nghỉ 10 phút.', 'Dùng 把...分成... để nói cách sắp xếp.', 4, 3);

-- HSK5 intro
select seed_hanapp_question('HSK5', 'intro', '请谈谈一个塑造你性格的重要经历。', 'Qǐng tántan yí ge sùzào nǐ xìnggé de zhòngyào jīnglì.', 'Hãy nói về một trải nghiệm quan trọng hình thành tính cách của bạn.', '大学时我第一次独自生活，那段经历让我学会了承担责任，也让我变得更独立。', 'Dàxué shí wǒ dì yī cì dúzì shēnghuó, nà duàn jīnglì ràng wǒ xuéhuì le chéngdān zérèn, yě ràng wǒ biàn de gèng dúlì.', 'Khi học đại học tôi lần đầu sống một mình, trải nghiệm đó giúp tôi học cách chịu trách nhiệm và trở nên độc lập hơn.', 'Dùng 那段经历让我... để kể tác động sâu hơn.', 5, 1);
select seed_hanapp_question('HSK5', 'intro', '你希望别人怎样评价你？', 'Nǐ xīwàng biérén zěnyàng píngjià nǐ?', 'Bạn mong người khác đánh giá bạn như thế nào?', '我希望别人觉得我是一个可靠、愿意学习并且能解决问题的人。', 'Wǒ xīwàng biérén juéde wǒ shì yí ge kěkào, yuànyì xuéxí bìngqiě néng jiějué wèntí de rén.', 'Tôi mong người khác thấy tôi là người đáng tin, sẵn sàng học hỏi và có thể giải quyết vấn đề.', 'Dùng 可靠, 愿意, 解决问题 để diễn đạt trưởng thành.', 5, 2);
select seed_hanapp_question('HSK5', 'intro', '面对新的环境，你通常如何适应？', 'Miànduì xīn de huánjìng, nǐ tōngcháng rúhé shìyìng?', 'Đối mặt môi trường mới, bạn thường thích nghi thế nào?', '我会先观察周围的规则，再主动和别人交流，这样能更快适应。', 'Wǒ huì xiān guānchá zhōuwéi de guīzé, zài zhǔdòng hé biérén jiāoliú, zhèyàng néng gèng kuài shìyìng.', 'Tôi sẽ quan sát quy tắc xung quanh trước, rồi chủ động giao tiếp với người khác, như vậy có thể thích nghi nhanh hơn.', 'Dùng 面对, 适应, 主动 để nói mạch lạc.', 5, 3);

-- HSK5 family
select seed_hanapp_question('HSK5', 'family', '现代社会中，家庭成员之间的关系发生了哪些变化？', 'Xiàndài shèhuì zhōng, jiātíng chéngyuán zhījiān de guānxi fāshēng le nǎxiē biànhuà?', 'Trong xã hội hiện đại, quan hệ giữa các thành viên gia đình đã thay đổi thế nào?', '我觉得关系变得更平等了，年轻人更愿意表达自己的想法，父母也开始尊重孩子的选择。', 'Wǒ juéde guānxi biàn de gèng píngděng le, niánqīng rén gèng yuànyì biǎodá zìjǐ de xiǎngfǎ, fùmǔ yě kāishǐ zūnzhòng háizi de xuǎnzé.', 'Tôi thấy quan hệ trở nên bình đẳng hơn, người trẻ sẵn sàng bày tỏ suy nghĩ, bố mẹ cũng bắt đầu tôn trọng lựa chọn của con.', 'Dùng 变得更... và 开始... để phân tích thay đổi.', 5, 1);
select seed_hanapp_question('HSK5', 'family', '你怎么看代沟问题？', 'Nǐ zěnme kàn dàigōu wèntí?', 'Bạn nhìn nhận vấn đề khoảng cách thế hệ thế nào?', '代沟并不可怕，关键是双方是否愿意倾听和解释。', 'Dàigōu bìng bù kěpà, guānjiàn shì shuāngfāng shìfǒu yuànyì qīngtīng hé jiěshì.', 'Khoảng cách thế hệ không đáng sợ, điều then chốt là hai bên có sẵn sàng lắng nghe và giải thích hay không.', 'Dùng 关键是... để nêu trọng tâm.', 5, 2);
select seed_hanapp_question('HSK5', 'family', '在照顾家人和发展事业之间，你会如何平衡？', 'Zài zhàogù jiārén hé fāzhǎn shìyè zhījiān, nǐ huì rúhé pínghéng?', 'Giữa chăm sóc gia đình và phát triển sự nghiệp, bạn cân bằng thế nào?', '我会提前安排时间，并和家人沟通，让他们理解我的压力和计划。', 'Wǒ huì tíqián ānpái shíjiān, bìng hé jiārén gōutōng, ràng tāmen lǐjiě wǒ de yālì hé jìhuà.', 'Tôi sẽ sắp xếp thời gian trước và giao tiếp với gia đình để họ hiểu áp lực và kế hoạch của tôi.', 'Dùng 在...之间平衡 để trả lời chủ đề cân bằng.', 5, 3);

-- HSK5 food
select seed_hanapp_question('HSK5', 'food', '饮食文化如何反映一个国家的特点？', 'Yǐnshí wénhuà rúhé fǎnyìng yí ge guójiā de tèdiǎn?', 'Văn hóa ẩm thực phản ánh đặc điểm của một quốc gia như thế nào?', '饮食文化能反映气候、历史和生活方式，比如越南菜常用新鲜蔬菜，味道比较清爽。', 'Yǐnshí wénhuà néng fǎnyìng qìhòu, lìshǐ hé shēnghuó fāngshì, bǐrú Yuènán cài cháng yòng xīnxiān shūcài, wèidào bǐjiào qīngshuǎng.', 'Văn hóa ẩm thực phản ánh khí hậu, lịch sử và lối sống, ví dụ món Việt thường dùng rau tươi, vị khá thanh.', 'Dùng 反映 và 比如 để giải thích.', 5, 1);
select seed_hanapp_question('HSK5', 'food', '快节奏生活对饮食习惯有什么影响？', 'Kuài jiézòu shēnghuó duì yǐnshí xíguàn yǒu shénme yǐngxiǎng?', 'Nhịp sống nhanh ảnh hưởng gì đến thói quen ăn uống?', '快节奏生活让很多人依赖外卖和快餐，虽然节省时间，但长期来看可能影响健康。', 'Kuài jiézòu shēnghuó ràng hěn duō rén yīlài wàimài hé kuàicān, suīrán jiéshěng shíjiān, dàn chángqī lái kàn kěnéng yǐngxiǎng jiànkāng.', 'Nhịp sống nhanh khiến nhiều người phụ thuộc vào đồ giao tận nơi và thức ăn nhanh; tuy tiết kiệm thời gian nhưng về lâu dài có thể ảnh hưởng sức khỏe.', 'Dùng 虽然...但... để cân bằng ý.', 5, 2);
select seed_hanapp_question('HSK5', 'food', '你认为传统菜应该保持原样还是不断创新？', 'Nǐ rènwéi chuántǒng cài yīnggāi bǎochí yuányàng háishi búduàn chuàngxīn?', 'Bạn nghĩ món truyền thống nên giữ nguyên hay liên tục đổi mới?', '我认为应该在尊重传统味道的基础上适当创新，这样才能吸引年轻人。', 'Wǒ rènwéi yīnggāi zài zūnzhòng chuántǒng wèidào de jīchǔ shàng shìdàng chuàngxīn, zhèyàng cáinéng xīyǐn niánqīng rén.', 'Tôi nghĩ nên đổi mới vừa phải trên nền tảng tôn trọng hương vị truyền thống, như vậy mới thu hút được người trẻ.', 'Dùng 在...的基础上 để diễn đạt nâng cao.', 5, 3);

-- HSK5 shopping
select seed_hanapp_question('HSK5', 'shopping', '消费主义会给年轻人带来什么影响？', 'Xiāofèi zhǔyì huì gěi niánqīng rén dàilái shénme yǐngxiǎng?', 'Chủ nghĩa tiêu dùng ảnh hưởng gì đến người trẻ?', '消费主义可能让年轻人把购买和幸福感联系在一起，从而忽视真正的需求。', 'Xiāofèi zhǔyì kěnéng ràng niánqīng rén bǎ gòumǎi hé xìngfúgǎn liánxì zài yìqǐ, cóng ér hūshì zhēnzhèng de xūqiú.', 'Chủ nghĩa tiêu dùng có thể khiến người trẻ liên hệ mua sắm với cảm giác hạnh phúc, từ đó bỏ qua nhu cầu thật sự.', 'Dùng 从而 để nói hệ quả.', 5, 1);
select seed_hanapp_question('HSK5', 'shopping', '你如何判断一个商品是否值得购买？', 'Nǐ rúhé pànduàn yí ge shāngpǐn shìfǒu zhídé gòumǎi?', 'Bạn đánh giá một sản phẩm có đáng mua hay không thế nào?', '我会考虑价格、质量、使用频率以及它是否真的能解决我的问题。', 'Wǒ huì kǎolǜ jiàgé, zhìliàng, shǐyòng pínlǜ yǐjí tā shìfǒu zhēn de néng jiějué wǒ de wèntí.', 'Tôi sẽ cân nhắc giá, chất lượng, tần suất sử dụng và liệu nó có thật sự giải quyết vấn đề của tôi không.', 'Dùng 是否 và 值得 để trả lời logic.', 5, 2);
select seed_hanapp_question('HSK5', 'shopping', '直播购物为什么能吸引很多消费者？', 'Zhíbō gòuwù wèishénme néng xīyǐn hěn duō xiāofèizhě?', 'Vì sao mua sắm qua livestream thu hút nhiều người tiêu dùng?', '因为它把娱乐和购物结合起来，而且主播的介绍容易制造信任感和紧迫感。', 'Yīnwèi tā bǎ yúlè hé gòuwù jiéhé qǐlái, érqiě zhǔbō de jièshào róngyì zhìzào xìnrèngǎn hé jǐnpògǎn.', 'Vì nó kết hợp giải trí và mua sắm, hơn nữa phần giới thiệu của streamer dễ tạo cảm giác tin tưởng và cấp bách.', 'Dùng 把...结合起来 để diễn đạt nguyên nhân.', 5, 3);

-- HSK5 travel
select seed_hanapp_question('HSK5', 'travel', '旅游业的发展会给当地带来哪些影响？', 'Lǚyóuyè de fāzhǎn huì gěi dāngdì dàilái nǎxiē yǐngxiǎng?', 'Sự phát triển du lịch mang lại ảnh hưởng gì cho địa phương?', '旅游业能增加收入和就业机会，但如果管理不好，也可能破坏环境和当地文化。', 'Lǚyóuyè néng zēngjiā shōurù hé jiùyè jīhuì, dàn rúguǒ guǎnlǐ bù hǎo, yě kěnéng pòhuài huánjìng hé dāngdì wénhuà.', 'Du lịch có thể tăng thu nhập và cơ hội việc làm, nhưng nếu quản lý không tốt cũng có thể phá hoại môi trường và văn hóa địa phương.', 'Dùng 但如果...也可能... để phân tích hai mặt.', 5, 1);
select seed_hanapp_question('HSK5', 'travel', '你认为深度旅行和打卡式旅行有什么区别？', 'Nǐ rènwéi shēndù lǚxíng hé dǎkǎ shì lǚxíng yǒu shénme qūbié?', 'Bạn nghĩ du lịch trải nghiệm sâu và du lịch check-in khác nhau thế nào?', '深度旅行更重视理解当地生活，而打卡式旅行更关注照片和速度。', 'Shēndù lǚxíng gèng zhòngshì lǐjiě dāngdì shēnghuó, ér dǎkǎ shì lǚxíng gèng guānzhù zhàopiàn hé sùdù.', 'Du lịch trải nghiệm sâu coi trọng hiểu đời sống địa phương hơn, còn du lịch check-in chú ý ảnh và tốc độ hơn.', 'Dùng 而 để so sánh đối lập.', 5, 2);
select seed_hanapp_question('HSK5', 'travel', '如果你负责设计一条旅游路线，你会考虑哪些因素？', 'Rúguǒ nǐ fùzé shèjì yì tiáo lǚyóu lùxiàn, nǐ huì kǎolǜ nǎxiē yīnsù?', 'Nếu bạn phụ trách thiết kế một lịch trình du lịch, bạn sẽ cân nhắc yếu tố nào?', '我会考虑交通、预算、时间安排、游客兴趣以及安全问题。', 'Wǒ huì kǎolǜ jiāotōng, yùsuàn, shíjiān ānpái, yóukè xìngqù yǐjí ānquán wèntí.', 'Tôi sẽ cân nhắc giao thông, ngân sách, lịch trình, sở thích du khách và vấn đề an toàn.', 'Dùng 以及 để liệt kê yếu tố cuối.', 5, 3);

-- HSK5 study
select seed_hanapp_question('HSK5', 'study', '你认为学习语言最重要的能力是什么？', 'Nǐ rènwéi xuéxí yǔyán zuì zhòngyào de nénglì shì shénme?', 'Bạn cho rằng năng lực quan trọng nhất khi học ngôn ngữ là gì?', '我认为最重要的是持续输入和表达的能力，因为语言不是知识，而是一种习惯。', 'Wǒ rènwéi zuì zhòngyào de shì chíxù shūrù hé biǎodá de nénglì, yīnwèi yǔyán bú shì zhīshi, ér shì yì zhǒng xíguàn.', 'Tôi cho rằng quan trọng nhất là khả năng tiếp nhận liên tục và biểu đạt, vì ngôn ngữ không phải kiến thức mà là một thói quen.', 'Dùng 不是...而是... để đối chiếu.', 5, 1);
select seed_hanapp_question('HSK5', 'study', '人工智能会如何改变语言学习？', 'Réngōng zhìnéng huì rúhé gǎibiàn yǔyán xuéxí?', 'AI sẽ thay đổi việc học ngôn ngữ như thế nào?', '人工智能可以提供即时反馈和个性化练习，但学习者仍然需要主动思考。', 'Réngōng zhìnéng kěyǐ tígōng jíshí fǎnkuì hé gèxìnghuà liànxí, dàn xuéxí zhě réngrán xūyào zhǔdòng sīkǎo.', 'AI có thể cung cấp phản hồi tức thì và bài luyện cá nhân hóa, nhưng người học vẫn cần chủ động suy nghĩ.', 'Dùng 仍然 để nhấn mạnh điều vẫn cần.', 5, 2);
select seed_hanapp_question('HSK5', 'study', '如果学习进入瓶颈期，你会怎么调整？', 'Rúguǒ xuéxí jìnrù píngjǐng qī, nǐ huì zěnme tiáozhěng?', 'Nếu việc học bước vào giai đoạn chững lại, bạn sẽ điều chỉnh thế nào?', '我会重新分析问题，改变学习材料和练习方式，同时设定更具体的小目标。', 'Wǒ huì chóngxīn fēnxī wèntí, gǎibiàn xuéxí cáiliào hé liànxí fāngshì, tóngshí shèdìng gèng jùtǐ de xiǎo mùbiāo.', 'Tôi sẽ phân tích lại vấn đề, thay đổi tài liệu và cách luyện tập, đồng thời đặt mục tiêu nhỏ cụ thể hơn.', 'Dùng 重新, 同时, 具体 để nói chiến lược.', 5, 3);

drop function seed_hanapp_question(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  integer
);
