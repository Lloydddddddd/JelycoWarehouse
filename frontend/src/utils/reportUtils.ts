import type { Column } from "../components/common/DataTable";

export function exportToCsv(
  filename: string,
  rows: any[],
  columns: Column<any>[]
) {
  const headers = columns.map((column) => column.header);

  const csvRows = rows.map((row) =>
    columns.map((column) => {
      let value = "";

      if (column.render) {
        value = String(column.render(row));
      } else if (column.accessor) {
        value = String(row[column.accessor] ?? "");
      }

      return `"${value.replace(/"/g, '""')}"`;
    })
  );

  const csv = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
}