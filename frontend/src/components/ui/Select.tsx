import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export default function Select({
  label,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
      </label>

      <select
        className={styles.select}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}