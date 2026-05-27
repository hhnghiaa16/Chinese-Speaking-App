export const topics = [
  {
    key: 'intro',
    emoji: '👋',
    titleZh: '自我介绍',
    titleVi: 'Giới thiệu bản thân',
    description: 'Tên, tuổi, quốc tịch, nghề nghiệp',
  },
  {
    key: 'family',
    emoji: '👨‍👩‍👧',
    titleZh: '家庭',
    titleVi: 'Gia đình',
    description: 'Thành viên, mối quan hệ',
  },
  {
    key: 'food',
    emoji: '🍜',
    titleZh: '饮食',
    titleVi: 'Ăn uống',
    description: 'Món ăn, nhà hàng, đặt đồ',
  },
  {
    key: 'shopping',
    emoji: '🛍️',
    titleZh: '购物',
    titleVi: 'Mua sắm',
    description: 'Giá cả, mặc cả, thanh toán',
  },
  {
    key: 'travel',
    emoji: '✈️',
    titleZh: '旅游',
    titleVi: 'Du lịch',
    description: 'Đặt phòng, hỏi đường',
  },
  {
    key: 'study',
    emoji: '📚',
    titleZh: '学习',
    titleVi: 'Học tập',
    description: 'Trường học, môn học, kế hoạch học',
  },
] as const;

export type TopicKey = (typeof topics)[number]['key'];
