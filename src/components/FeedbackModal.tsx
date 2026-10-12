import type { QuizQuestion } from '../types/quiz';
import { Icon } from './Icon';
import { Modal } from './Modal';

interface FeedbackModalProps {
  feedback: 'correct' | 'incorrect';
  question: QuizQuestion;
  onContinue: () => void;
}

export function FeedbackModal({ feedback, question, onContinue }: FeedbackModalProps) {
  const correct = feedback === 'correct';

  return (
    <Modal title={correct ? 'Correct!' : 'Not quite!'} tone={correct ? 'success' : 'danger'}>
      <div className="feedback-stack">
        <div className={`feedback-icon ${correct ? 'success' : 'danger'}`}>
          <Icon name={correct ? 'check' : 'alert'} size={28} />
        </div>
        <p className="feedback-copy">{correct ? 'Nice work.' : 'The correct Japanese word is:'}</p>
        <div className="answer-reveal">{question.target.japanese}</div>
        <p className="muted">{question.target.translation}</p>
      </div>
      <div className="modal-footer-button">
        <button className="button button-primary button-wide" type="button" onClick={onContinue}>Continue</button>
      </div>
    </Modal>
  );
}
