export type AnswerCategory = 'affirmative' | 'neutral' | 'negative';

export type Answer = {
  id: string;
  text: string;
  category: AnswerCategory;
};

export type ThemePack = {
  id: 'classic' | 'career' | 'party';
  label: string;
  answers: Answer[];
};

export type OracleResult = {
  answer: Answer;
  isEasterEgg: boolean;
  easterEggText?: string;
};

export type OraclePhase = 'idle' | 'shaking' | 'revealing' | 'answered';
