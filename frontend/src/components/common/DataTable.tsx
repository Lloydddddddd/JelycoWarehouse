import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import styles from "./DataTable.module.css";

interface Column<T> {
  header: string;

  accessor?: keyof T;

  render?: (row: T) => ReactNode;

  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];

  data: T[];
}

export default function DataTable<
  T extends { id: number }
>({
  columns,
  data,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] =
    useState<keyof T | null>(null);

  const [ascending, setAscending] =
    useState(true);

  function handleSort(column: Column<T>) {
    if (!column.sortable || !column.accessor) {
      return;
    }

    if (sortColumn === column.accessor) {
      setAscending(!ascending);
    } else {
      setSortColumn(column.accessor);
      setAscending(true);
    }
  }

  const sortedData = useMemo(() => {
    if (!sortColumn) {
      return data;
    }

    return [...data].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (
        typeof valueA === "number" &&
        typeof valueB === "number"
      ) {
        return ascending
          ? valueA - valueB
          : valueB - valueA;
      }

      const textA = String(valueA).toLowerCase();
      const textB = String(valueB).toLowerCase();

      return ascending
        ? textA.localeCompare(textB)
        : textB.localeCompare(textA);
    });
  }, [data, sortColumn, ascending]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              onClick={() => handleSort(column)}
              className={
                column.sortable
                  ? styles.sortable
                  : ""
              }
            >
              {column.header}

              {column.sortable &&
                column.accessor ===
                  sortColumn && (
                  <span
                    className={styles.arrow}
                  >
                    {ascending ? " ▲" : " ▼"}
                  </span>
                )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sortedData.map((row) => (
          <tr key={row.id}>
            {columns.map((column, index) => (
              <td key={index}>
                {column.render
                  ? column.render(row)
                  : String(
                      row[column.accessor!]
                    )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}