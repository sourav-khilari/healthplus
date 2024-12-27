import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
            aria-hidden="true"
          ></div>
          <div
            className="relative bg-white p-4 rounded-lg z-10 text-right w-[90%] max-w-md"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <button
              className="text-black font-semibold hover:text-gray-700 focus:outline-none"
              onClick={onClose}
              aria-label="Close modal"
            >
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
