import { Icon } from '../components/Icon';
import { WordSetCard } from '../components/WordSetCard';
import { UploadPanel } from '../components/UploadPanel';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import type { ParseResult, WordSet } from '../types/vocabulary';
import { useState } from 'react';

interface LibraryPageProps {
  wordSets: WordSet[];
  onImported: (result: ParseResult) => void;
  onStart: (wordSet: WordSet) => void;
  onDelete: (id: string) => void;
}

export function LibraryPage({ wordSets, onImported, onStart, onDelete }: LibraryPageProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WordSet | null>(null);

  const handleDelete = () => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow"><Icon name="sparkle" size={15} /> Learn Japanese, one card at a time</div>
          <h1>Your word sets</h1>
          <p>Import a simple TXT file, choose a set, and practice with four-choice rounds.</p>
        </div>
        <div className="hero-actions">
          <button className="button button-primary button-large" type="button" onClick={() => setShowUpload(true)}><Icon name="upload" size={18} /> Upload Word Set</button>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading-row">
          <div>
            <h2>Library</h2>
            <p className="muted">Your word sets are stored locally in this browser.</p>
          </div>
          {wordSets.length > 0 && <span className="count-badge">{wordSets.length} {wordSets.length === 1 ? 'set' : 'sets'}</span>}
        </div>

        {wordSets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="book" size={30} /></div>
            <h3>No word sets yet</h3>
            <p className="muted">Upload your first vocabulary set to start learning.</p>
            <div className="empty-actions">
              <button className="button button-primary" type="button" onClick={() => setShowUpload(true)}><Icon name="upload" size={16} /> Upload Word Set</button>
              <button className="button button-secondary" type="button" onClick={() => setShowUpload(true)}>View format</button>
            </div>
          </div>
        ) : (
          <div className="set-grid">
            {wordSets.map((wordSet) => (
              <WordSetCard
                key={wordSet.id}
                wordSet={wordSet}
                onStart={() => onStart(wordSet)}
                onDelete={() => setDeleteTarget(wordSet)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="how-it-works section-block">
        <div className="section-heading-row"><div><h2>How it works</h2><p className="muted">Simple rules, no account required.</p></div></div>
        <div className="steps-grid">
          <div className="step"><span>01</span><h3>Import</h3><p>Upload one UTF-8 <code>.txt</code> file with Japanese and English or Russian translations.</p></div>
          <div className="step"><span>02</span><h3>Choose</h3><p>Each round shows one translation and four shuffled Japanese choices.</p></div>
          <div className="step"><span>03</span><h3>Practice</h3><p>Your targets never repeat, while answered words can still appear as distractors.</p></div>
        </div>
      </section>

      {showUpload && <UploadPanel onImported={onImported} onClose={() => setShowUpload(false)} />}
      {deleteTarget && <ConfirmDeleteModal title={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onDelete={handleDelete} />}
    </main>
  );
}
