import { apiGet } from './apiClient';
import { ProgressApiDto } from './types';

export async function getProgressFromApi(): Promise<ProgressApiDto> {
  return apiGet<ProgressApiDto>('/api/progress');
}
