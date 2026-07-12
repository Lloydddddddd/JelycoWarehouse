import type { ReactNode } from "react";

import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2>{title}</h2>

          <button
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {children}
        </div>

      </div>
    </div>
  );
}