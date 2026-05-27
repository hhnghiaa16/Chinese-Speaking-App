import { TopicKey } from '../../data/questions';
import { apiGet } from './apiClient';
import { TopicApiDto } from './types';

export type MobileTopic = {
  key: TopicKey;
  emoji: string;
  titleZh: string;
  titleVi: string;
  description: string;
};

export async function getTopicsFromApi(): Promise<MobileTopic[]> {
  const topics = await apiGet<TopicApiDto[]>('/api/topics');

  return topics.map((topic) => ({
    key: topic.key as TopicKey,
    emoji: topic.emoji ?? '',
    titleZh: topic.titleZh,
    titleVi: topic.titleVi,
    description: topic.descriptionVi ?? '',
  }));
}
