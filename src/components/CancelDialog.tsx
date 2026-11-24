interface Props {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 退号确认对话框 */
export function CancelDialog({ open, text, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="dlg-backdrop" onClick={onCancel}>
      <dialog open className="dlg" onClick={(e) => e.stopPropagation()}>
        <div className="dlg-body">
          <h2 className="dlg-title">确认退号</h2>
          <p className="dlg-text">{text}</p>
        </div>
        <div className="dlg-actions">
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            保留号源
          </button>
          <button className="btn btn-primary" type="button" onClick={onConfirm}>
            确认退号
          </button>
        </div>
      </dialog>
    </div>
  );
}
