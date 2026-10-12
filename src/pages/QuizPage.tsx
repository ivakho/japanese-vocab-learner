import { useState } from 'react';
import { Icon } from '../components/Icon';
import { FeedbackModal } from '../components/FeedbackModal';
import { Modal } from '../components/Modal';
import type { WordSet } from '../types/vocabulary';
import type { QuizState } from '../types/quiz';

interface QuizPageProps {
  wordSet: WordSet;
  state: QuizState;
  onAnswer: (id: string) => void;
  onContinue: () => void;
  onExit: () => void;
  onComplete: (state: QuizState) => void;
}

export function QuizPage({ wordSet, state, onAnswer, onContinue, onExit, onComplete }: QuizPageProps) {
  const [showExit, setShowExit] = useState(false);
  const question = state.currentQuestion;

  if (!question) return null;

  const questionNumber = state.questionIndex + 1;
  const progress = Math.round((questionNumber / state.orderedTargets.length) * 100);

  const continueFromFeedback = () => {
    const isLastQuestion = state.questionIndex === state.orderedTargets.length - 1;
    onContinue();
    if (isLastQuestion) onComplete(state);
  };

  const selectedIsCorrect = state.selectedAnswerId === question.target.id;

  return (
    <main className="quiz-shell">
      <div className="quiz-topbar">
        <button className="button button-ghost back-button" type="button" onClick={() => setShowExit(true)}><Icon name="arrow-left" size={18} /> <span>Back</span></button>
        <div className="quiz-title">{wordSet.title}</div>
        <div className="question-count">{questionNumber} / {state.orderedTargets.length}</div>
      </div>

      <div className="progress-track" aria-label={`Question ${questionNumber} of ${state.orderedTargets.length}`}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <section className="question-panel">
        <div className="question-label">Choose the Japanese word</div>
        <div className="target-word" lang={wordSet.language}>{question.target.translation}</div>
        <div className="question-helper">Which Japanese card matches this meaning?</div>
      </section>

      <section className="answers-grid" aria-label="Japanese answer choices">
        {question.options.map((option) => {
          const isSelected = state.selectedAnswerId === option.id;
          const isCorrect = option.id === question.target.id;
          const stateClass = state.answerLocked
            ? isSelected
              ? selectedIsCorrect ? 'answer-correct' : 'answer-wrong'
              : isCorrect && state.feedback === 'incorrect' ? 'answer-correct reveal-correct' : 'answer-inactive'
            : '';

          return (
            <button
              key={option.id}
              className={`answer-card ${stateClass}`}
              type="button"
              disabled={state.answerLocked}
              onClick={() => onAnswer(option.id)}
            >
              <span className="answer-japanese" lang="ja">{option.japanese}</span>
            </button>
          );
        })}
      </section>

      {state.feedback && <FeedbackModal feedback={state.feedback} question={question} onContinue={continueFromFeedback} />}

      {showExit && (
        <Modal title="Leave this quiz?" onClose={() => setShowExit(false)}>
          <p className="muted">Your current progress will be lost.</p>
          <div className="modal-actions split">
            <button className="button button-ghost" type="button" onClick={() => setShowExit(false)}>Keep Learning</button>
            <button className="button button-danger" type="button" onClick={onExit}>Leave Quiz</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
