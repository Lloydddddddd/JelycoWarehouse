import type { ReactNode } from "react";

import styles from "./ReportCard.module.css";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

export default function ReportCard({
  title,
  description,
  icon,
  active,
  onClick,
}: Props) {
  return (
    <button
      className={`${styles.card} ${
        active ? styles.active : ""
      }`}
      onClick={onClick}
    >
      <div className={styles.icon}>
        {icon}
      </div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </button>
  );
}