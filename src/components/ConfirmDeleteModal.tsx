import { Modal } from './Modal';

interface ConfirmDeleteModalProps {
  title: string;
  onCancel: () => void;
  onDelete: () => void;
}

export function ConfirmDeleteModal({ title, onCancel, onDelete }: ConfirmDeleteModalProps) {
  return (
    <Modal title="Delete this word set?" onClose={onCancel}>
      <p className="modal-copy"><strong>{title}</strong></p>
      <p className="muted">This action cannot be undone.</p>
      <div className="modal-actions split">
        <button className="button button-ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="button button-danger" type="button" onClick={onDelete}>Delete</button>
      </div>
    </Modal>
  );
}
