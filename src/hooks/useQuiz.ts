import { useCallback, useEffect, useState } from 'react';
import type { QuizQuestion, QuizState } from '../types/quiz';
import type { WordSet } from '../types/vocabulary';
import { createQuestion } from '../utils/quiz';
import { shuffleArray } from '../utils/shuffle';

const initialState: QuizState = {
  orderedTargets: [],
  questionIndex: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  currentQuestion: null,
  selectedAnswerId: null,
  answerLocked: false,
  feedback: null,
};

export function useQuiz(wordSet: WordSet | null) {
  const [state, setState] = useState<QuizState>(initialState);

  const startQuiz = useCallback(() => {
    if (!wordSet || wordSet.words.length < 4) return;

    const orderedTargets = shuffleArray(wordSet.words);
    const firstQuestion = createQuestion(orderedTargets[0], wordSet.words);

    setState({
      ...initialState,
      orderedTargets,
      currentQuestion: firstQuestion,
    });
  }, [wordSet]);

  useEffect(() => {
    setState(initialState);
  }, [wordSet?.id]);

  const submitAnswer = useCallback((answerId: string) => {
    setState((current) => {
      if (!current.currentQuestion || current.answerLocked) return current;
      const isCorrect = answerId === current.currentQuestion.target.id;
      return {
        ...current,
        selectedAnswerId: answerId,
        answerLocked: true,
        feedback: isCorrect ? 'correct' : 'incorrect',
        correctAnswers: current.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: current.incorrectAnswers + (isCorrect ? 0 : 1),
      };
    });
  }, []);

  const continueQuiz = useCallback((): void => {
    setState((current) => {
      const nextIndex = current.questionIndex + 1;
      if (nextIndex >= current.orderedTargets.length) {
        return {
          ...current,
          questionIndex: nextIndex,
          currentQuestion: null,
          selectedAnswerId: null,
          answerLocked: false,
          feedback: null,
        };
      }

      const nextTarget = current.orderedTargets[nextIndex];
      const nextQuestion: QuizQuestion = createQuestion(nextTarget, wordSet?.words ?? []);

      return {
        ...current,
        questionIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedAnswerId: null,
        answerLocked: false,
        feedback: null,
      };
    });
  }, [wordSet]);

  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  return { state, startQuiz, submitAnswer, continueQuiz, resetQuiz };
}
