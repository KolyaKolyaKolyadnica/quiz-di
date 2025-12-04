import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import style from "./Modal.module.css";

const modalRoot = document.querySelector("#modal-root");

function Modal({ children, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const closeByEsc = (e) => {
    if (e.code === "Escape") {
      onClose(e);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", closeByEsc);

    requestAnimationFrame(() => setIsOpen(true));

    return () => {
      window.removeEventListener("keydown", closeByEsc);
    };
  }, []);

  const clickOnOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  return createPortal(
    <div className={style.overlay} onClick={clickOnOverlay}>
      <div className={`${style.modal} ${isOpen ? style.modalOpen : ""}`}>{children}</div>
    </div>,
    modalRoot
  );
}

export default Modal;
