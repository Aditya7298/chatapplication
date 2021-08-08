import React from "react";
import ReactDOM from "react-dom";

import closeIcon from "../../assets/images/close-icon.svg";

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
        <button className="modal-close" onClick={onClose}>
          <img src={closeIcon} alt="close" />
        </button>
        {children}
      </div>
    </>,
    document.querySelector("#modal") as Element
  );
};
