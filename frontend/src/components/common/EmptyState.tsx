import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
}

export default function EmptyState({
  icon,
  title,
  message,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.icon}>{icon}</div>}

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  );
}