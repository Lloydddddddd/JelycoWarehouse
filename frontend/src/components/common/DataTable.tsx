import styles from "./DataTable.module.css";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.accessor)}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={String(column.accessor)}>
                {String(row[column.accessor])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}