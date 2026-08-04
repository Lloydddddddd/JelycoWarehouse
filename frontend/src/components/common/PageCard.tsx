import type { ReactNode } from "react";
import styles from "./PageCard.module.css";

interface PageCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export default function PageCard({
  title,
  subtitle,
  children,
}: PageCardProps) {
  return (
    <section className={styles.card}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      {children}
    </section>
  );
}