import { hskLevels } from '../../data/levels';
import { HSKLevel } from '../../data/questions';
import { apiGet } from './apiClient';
import { HskLevelApiDto } from './types';

type MobileHskLevel = {
  key: HSKLevel;
  number: number;
  title: string;
  subtitle: string;
  vocabCount: string;
  questionCount: number;
  available: boolean;
};

const levelSubtitles = new Map(
  hskLevels.map((level) => [level.key, level.subtitle]),
);

function getLevelNumber(code: string) {
  const match = code.match(/\d+/);

  return match ? Number(match[0]) : 0;
}

export async function getHskLevelsFromApi(): Promise<MobileHskLevel[]> {
  const levels = await apiGet<HskLevelApiDto[]>('/api/hsk-levels');

  return levels.map((level) => {
    const number = getLevelNumber(level.code);

    return {
      key: level.code as HSKLevel,
      number,
      title: level.name,
      subtitle: levelSubtitles.get(level.code as HSKLevel) ?? level.description ?? '',
      vocabCount: level.vocabCount ? `~${level.vocabCount} từ` : '~0 từ',
      questionCount: level.questionCount,
      available: level.questionCount > 0,
    };
  });
}
