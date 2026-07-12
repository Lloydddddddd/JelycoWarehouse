import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  visible: boolean;
}

export default function Toast({
  message,
  type = "success",
  visible,
}: ToastProps) {
  if (!visible) return null;

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
    >
      {message}
    </div>
  );
}