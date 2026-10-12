import { Icon } from '../components/Icon';
import type { CSSProperties } from 'react';
import { calculatePercentage } from '../utils/quiz';
import type { WordSet } from '../types/vocabulary';

interface ResultPageProps {
  wordSet: WordSet;
  correct: number;
  incorrect: number;
  onReplay: () => void;
  onBack: () => void;
}

export function ResultPage({ wordSet, correct, incorrect, onReplay, onBack }: ResultPageProps) {
  const total = correct + incorrect;
  const percentage = calculatePercentage(correct, total);

  const message = percentage >= 90 ? 'Excellent work!' : percentage >= 70 ? 'Nice work!' : 'Keep practicing!';

  return (
    <main className="result-shell">
      <section className="result-card">
        <div className="result-icon"><Icon name="trophy" size={34} /></div>
        <div className="eyebrow centered"><Icon name="sparkle" size={15} /> {wordSet.title}</div>
        <h1>Quiz Complete!</h1>
        <p className="result-message">{message}</p>
        <div className="score-ring" style={{ '--score': `${percentage}%` } as CSSProperties}>
          <div className="score-ring-inner">
            <strong>{percentage}%</strong>
            <span>accuracy</span>
          </div>
        </div>
        <div className="score-main">{correct} <span>/</span> {total}</div>
        <p className="muted">You answered {correct} out of {total} correctly.</p>
        <div className="stats-row">
          <div><span className="stat-value correct-text">{correct}</span><span className="stat-label">Correct</span></div>
          <div><span className="stat-value wrong-text">{incorrect}</span><span className="stat-label">Incorrect</span></div>
        </div>
        <div className="result-actions">
          <button className="button button-primary button-wide" type="button" onClick={onReplay}>Play Again</button>
          <button className="button button-secondary button-wide" type="button" onClick={onBack}>Back to Word Sets</button>
        </div>
      </section>
    </main>
  );
}
