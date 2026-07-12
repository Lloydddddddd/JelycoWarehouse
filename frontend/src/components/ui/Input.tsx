import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({
  label,
  ...props
}: InputProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
      </label>

      <input
        className={styles.input}
        {...props}
      />
    </div>
  );
}