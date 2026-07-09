import styles from "./StatCard.module.css";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>

      <div>
        <p className={styles.title}>{title}</p>

        <h2 className={styles.value}>{value}</h2>
      </div>
    </div>
  );
}