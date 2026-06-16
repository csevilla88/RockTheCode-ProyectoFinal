import Modal from "./Modal";

/**
 * Diálogo de confirmación reutilizable.
 *
 * Sustituye a window.confirm/window.alert para mantener una UI propia
 * y coherente con el diseño del club.
 *
 * Props:
 *  - isOpen, onClose
 *  - title (string)
 *  - message (string | node)
 *  - confirmText (default "Confirmar")
 *  - cancelText (default "Cancelar")
 *  - variant: "danger" | "warning" | "info" (color del botón principal)
 *  - onConfirm: función a ejecutar al confirmar
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  onConfirm,
}) => {
  const icon = variant === "danger" ? "⚠️" : variant === "warning" ? "⚠️" : "ℹ️";

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="confirm-dialog">
        <span
          className={`confirm-dialog_icon confirm-dialog_icon--${variant}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3 className="confirm-dialog_title">{title}</h3>
        <p className="confirm-dialog_message">{message}</p>

        <div className="confirm-dialog_actions">
          <button
            type="button"
            className="confirm-dialog_btn confirm-dialog_btn--cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-dialog_btn confirm-dialog_btn--confirm ${variant}`}
            onClick={handleConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
