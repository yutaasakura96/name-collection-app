import { useRef, useEffect } from "react";

const ConfirmationModal = ({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  const modalRef = useRef(null);

  // Get button class based on type
  const getButtonClass = () => {
    switch (type) {
      case "error":
        return "btn-error";
      case "warning":
        return "btn-warning";
      case "info":
        return "btn-info";
      case "success":
        return "btn-success";
      default:
        return "btn-primary";
    }
  };

  // Open/close modal based on isOpen prop
  useEffect(() => {
    const modalElement = modalRef.current;
    if (isOpen && modalElement) {
      modalElement.showModal();
    } else if (modalElement) {
      modalElement.close();
    }
  }, [isOpen]);

  // Handle modal close event
  const handleClose = () => {
    onClose();
  };

  return (
    <dialog
      id={id}
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle"
      onClose={handleClose}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={`btn ${getButtonClass()}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onSubmit={handleClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ConfirmationModal;
