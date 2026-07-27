import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({
  text = "Loading..."
}: LoadingSpinnerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>

      <p>{text}</p>
    </div>
  );
}