import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h2>{title}</h2>

        {subtitle && (
          <p>{subtitle}</p>
        )}
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}