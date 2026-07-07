import React, { useState } from "react";

export default function Table({ columns, data, actions, pageSize = 5, rowClassName, onSelectionChange }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSort = (col) => {
    if (sortColumn === col.accessor) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col.accessor);
      setSortDirection("asc");
    }
  };

  const toggleRowSelection = (id) => {
    let updated;
    if (selectedRows.includes(id)) {
      updated = selectedRows.filter((rowId) => rowId !== id);
    } else {
      updated = [...selectedRows, id];
    }
    setSelectedRows(updated);
    if (onSelectionChange) onSelectionChange(updated);
  };

  const toggleAllSelection = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const allIds = paginatedData.map((row) => row.id);
      setSelectedRows(allIds);
      if (onSelectionChange) onSelectionChange(allIds);
    }
  };

  // 🔍 Search filter
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 🔽 Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-3">
      {/* Search box */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr>
              {/* Checkbox header */}
              <th className="border border-gray-200 px-4 py-2 bg-gray-100 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={toggleAllSelection}
                />
              </th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col)}
                  style={{ width: col.width || "auto" }}
                  className={`border border-gray-200 px-4 py-2 bg-gray-100 cursor-pointer select-none ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                  {sortColumn === col.accessor &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
              {actions && (
                <th className="border border-gray-200 px-4 py-2 bg-gray-100 text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const baseClass =
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-blue-50";
                const customClass = rowClassName ? rowClassName(row) : "";
                return (
                  <tr key={row.id} className={`${baseClass} ${customClass}`}>
                    {/* Row checkbox */}
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                      />
                    </td>
                    {columns.map((col, cIdx) => {
                      const rawValue = row[col.accessor];
                      const displayValue = col.format ? col.format(rawValue) : rawValue;
                      const cellContent = col.render
                        ? col.render(rawValue, row)
                        : displayValue;

                      return (
                        <td
                          key={cIdx}
                          style={{ width: col.width || "auto" }}
                          className={`border border-gray-200 px-4 py-2 ${
                            col.align === "right" ? "text-right" : "text-left"
                          }`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                    {actions && (
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 2 : 1)} // +1 for checkbox column
                  className="text-center text-gray-500 py-4"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}