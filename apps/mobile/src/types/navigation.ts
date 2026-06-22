import { HSKLevel, TopicKey } from '../data/questions';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Level: undefined;
  Progress: undefined;
  Profile: undefined;
  Topic: {
    level: HSKLevel;
  };
  ModeSelect: {
    level: HSKLevel;
    topic: TopicKey;
    topicVi: string;
    topicEmoji: string;
  };
  Practice: {
    level: HSKLevel;
    topic: TopicKey;
  };
  AiConversation: {
    level: HSKLevel;
    topic: TopicKey;
    topicVi: string;
    topicEmoji: string;
  };
  Result: {
    level: HSKLevel;
    topic: TopicKey;
    totalQuestions: number;
    answeredQuestions: number;
    averageScore: number;
    suggestionVi?: string;
  };
};
