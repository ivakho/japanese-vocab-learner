import type { WordPair } from './vocabulary';

export interface QuizQuestion {
  target: WordPair;
  options: WordPair[];
}

export interface QuizState {
  orderedTargets: WordPair[];
  questionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentQuestion: QuizQuestion | null;
  selectedAnswerId: string | null;
  answerLocked: boolean;
  feedback: 'correct' | 'incorrect' | null;
}
