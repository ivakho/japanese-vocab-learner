import { useRef, useState } from 'react';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { parseWordSetFileSafely } from '../utils/parser';
import type { ParseResult } from '../types/vocabulary';

const EN_TEMPLATE = `@title: Basic Countries\n@translation: en\n\nにほん ||| Japan\nロシア ||| Russia\nひと ||| Person\nおとこ ||| Man\nおんな ||| Woman\n`;
const RU_TEMPLATE = `@title: Basic Countries RU\n@translation: ru\n\nにほん ||| Япония\nロシア ||| Россия\nひと ||| Человек\nおとこ ||| Мужчина\nおんな ||| Женщина\n`;

interface UploadPanelProps {
  onImported: (result: ParseResult) => void;
  onClose: () => void;
}

function downloadTemplate(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function UploadPanel({ onImported, onClose }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const text = await file.text();
      const result = parseWordSetFileSafely(file, text);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      onImported(result);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Upload Word Set" onClose={onClose}>
      <div className="upload-content">
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''}`}
          onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => { event.preventDefault(); setIsDragging(false); void handleFile(event.dataTransfer.files?.[0]); }}
        >
          <div className="upload-icon"><Icon name="upload" size={26} /></div>
          <strong>Drop a .txt file here</strong>
          <span>or choose one from your device</span>
          <button className="button button-secondary" type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Reading file…' : 'Choose File'}
          </button>
          <input ref={inputRef} type="file" accept=".txt,text/plain" hidden onChange={(event) => void handleFile(event.target.files?.[0])} />
        </div>

        {error && (
          <div className="error-box" role="alert">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="format-guide">
          <div className="section-heading-row">
            <div>
              <h3>File format</h3>
              <p className="muted">UTF-8 plain text. One word pair per line.</p>
            </div>
            <div className="template-buttons">
              <button className="text-button" type="button" onClick={() => downloadTemplate('example-en.txt', EN_TEMPLATE)}><Icon name="download" size={15} /> English example</button>
              <button className="text-button" type="button" onClick={() => downloadTemplate('example-ru.txt', RU_TEMPLATE)}><Icon name="download" size={15} /> Russian example</button>
            </div>
          </div>
          <pre><code>{`@title: Basic Countries\n@translation: en\n\nにほん ||| Japan\nロシア ||| Russia`}</code></pre>
          <p className="muted small">Use <code>|||</code> as the delimiter. Lines beginning with <code>#</code> are comments. Import 1–100 pairs; quizzes need at least 4 pairs.</p>
        </div>
      </div>
    </Modal>
  );
}
