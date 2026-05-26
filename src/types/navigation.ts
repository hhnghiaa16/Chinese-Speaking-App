import { HSKLevel, TopicKey } from '../data/questions';

export type RootStackParamList = {
  Home: undefined;
  Level: undefined;
  Progress: undefined;
  Profile: undefined;
  Topic: {
    level: HSKLevel;
  };
  Practice: {
    level: HSKLevel;
    topic: TopicKey;
  };
  Result: {
    level: HSKLevel;
    topic: TopicKey;
    totalQuestions: number;
    answeredQuestions: number;
  };
};
