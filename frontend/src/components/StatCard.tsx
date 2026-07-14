import styles from "./StatCard.module.css";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        {icon}
      </div>

      <div className={styles.content}>
        <p className={styles.title}>
          {title}
        </p>

        <h2 className={styles.value}>
          {value}
        </h2>
      </div>
    </div>
  );
}