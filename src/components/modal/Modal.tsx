import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal = ({ open, onClose, children }: ModalProps) => {
  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <div className="overlay" />
      <div className="modal">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </>,
    document.querySelector("#modal") as Element
  );
};
