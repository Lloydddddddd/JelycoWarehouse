import styles from "./Topbar.module.css";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <h1>{title}</h1>

      <div className={styles.user}>
        Admin
      </div>
    </header>
  );
}