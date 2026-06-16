import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

/**
 * Modal genérico reutilizable.
 * Renderiza su contenido en un portal a document.body para evitar
 * problemas de z-index/overflow con el layout.
 *
 * Props:
 *  - isOpen: boolean (controla visibilidad)
 *  - onClose: function (callback al cerrar – click fuera o tecla ESC)
 *  - title: string opcional (cabecera del modal)
 *  - size: "sm" | "md" | "lg" (ancho)
 *  - children: contenido del modal
 *  - closeOnOverlay: cerrar al hacer click fuera (default true)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  closeOnOverlay = true,
}) => {
  // Cerrar con tecla ESC
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);

    // Evita scroll del body cuando hay modal
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = original;
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && closeOnOverlay) {
        onClose?.();
      }
    },
    [onClose, closeOnOverlay]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal_overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={`modal_window modal_window--${size}`}>
        {title && (
          <div className="modal_header">
            <h2 className="modal_title">{title}</h2>
            <button
              type="button"
              className="modal_close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        )}
        <div className="modal_body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
