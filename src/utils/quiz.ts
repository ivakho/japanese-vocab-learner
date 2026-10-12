import type { QuizQuestion } from '../types/quiz';
import type { WordPair } from '../types/vocabulary';
import { shuffleArray } from './shuffle';

export function createQuestion(target: WordPair, allWords: WordPair[]): QuizQuestion {
  const distractorCandidates = allWords.filter((word) => word.id !== target.id);
  const distractors = shuffleArray(distractorCandidates).slice(0, 3);

  return {
    target,
    options: shuffleArray([target, ...distractors]),
  };
}

export function calculatePercentage(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}
