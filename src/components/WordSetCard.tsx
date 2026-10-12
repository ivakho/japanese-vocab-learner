import type { WordSet } from '../types/vocabulary';
import { Icon } from './Icon';

interface WordSetCardProps {
  wordSet: WordSet;
  onStart: () => void;
  onDelete: () => void;
}

export function WordSetCard({ wordSet, onStart, onDelete }: WordSetCardProps) {
  const canStart = wordSet.words.length >= 4;

  return (
    <article className="word-set-card">
      <div className="word-set-topline">
        <span className="language-pill">{wordSet.language === 'en' ? 'English' : 'Russian'}</span>
        <span className="word-count">{wordSet.words.length} {wordSet.words.length === 1 ? 'pair' : 'pairs'}</span>
      </div>
      <div>
        <h3>{wordSet.title}</h3>
        <p className="muted">Japanese → {wordSet.language === 'en' ? 'English' : 'Russian'}</p>
      </div>
      {!canStart && <div className="mini-warning">This set needs at least 4 word pairs to start a quiz.</div>}
      <div className="card-actions">
        <button className="button button-primary grow" type="button" disabled={!canStart} onClick={onStart}>
          <Icon name="play" size={16} />
          Start Quiz
        </button>
        <button className="button button-ghost danger" type="button" aria-label={`Delete ${wordSet.title}`} onClick={onDelete}>
          <Icon name="trash" size={16} />
          Delete
        </button>
      </div>
    </article>
  );
}
