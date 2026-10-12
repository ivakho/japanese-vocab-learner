import { useEffect, useRef, type PropsWithChildren, type ReactNode } from 'react';
import { Icon } from './Icon';

interface ModalProps extends PropsWithChildren {
  title: string;
  onClose?: () => void;
  actions?: ReactNode;
  tone?: 'default' | 'success' | 'danger';
}

export function Modal({ title, onClose, actions, children, tone = 'default' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target && onClose) onClose(); }}>
      <div ref={dialogRef} className={`modal-card modal-${tone}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
        {onClose && <button className="icon-button modal-close" type="button" aria-label="Close" onClick={onClose}><Icon name="x" /></button>}
        <h2 id="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
