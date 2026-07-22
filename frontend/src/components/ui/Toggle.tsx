interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

import styles from "./Toggle.module.css";

export default function Toggle({
  checked,
  onChange,
  label,
}: ToggleProps) {
  return (
    <label className={styles.container}>
      {label && (
        <span className={styles.label}>
          {label}
        </span>
      )}

      <div
        className={`${styles.switch} ${
          checked ? styles.checked : ""
        }`}
        onClick={() =>
          onChange(!checked)
        }
      >
        <div className={styles.thumb} />
      </div>
    </label>
  );
}