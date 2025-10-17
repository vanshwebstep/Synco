// src/components/DynamicTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Check } from "lucide-react";

const DynamicTable = ({
  columns,
  data,
  from,
  selectedIds = [],
  setSelectedStudents,
  onRowClick,
  
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toggleSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  // Flatten the data into entries of { ...parentItemFields, student, studentIndex }
  const flattenedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.flatMap((item) =>
      (item.students || []).map((student, studentIndex) => ({
        parent: item,           // original parent item (keeps original intact)
        ...item,                // spread parent fields (id, bookingId, parents, etc)
        student,                // the student object
        studentIndex,           // index of the student within parent
      }))
    );
  }, [data]);

  // Calculate pagination
  const totalItems = flattenedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = flattenedData.slice(startIndex, startIndex + rowsPerPage);

  // Keep currentPage in range when data or rowsPerPage change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (currentPage < 1 && totalPages > 0) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, currentPage]);

  // If rowsPerPage changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  return (
    <div className="mt-5 w-full rounded-2xl overflow-hidden border border-[#E2E1E5]">
      <div className="overflow-auto">
        <table className="min-w-full bg-white text-sm border-separate border-spacing-0">
          <thead className="bg-[#F5F5F5]">
            <tr className="font-semibold">
              {columns.map((col, idx) => (
                <th key={idx} className="p-4 text-[#717073] whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentData && currentData.length > 0 ? (
              currentData.map((entry) => {
                const { student, studentIndex, parent, ...item } = entry;

                // uniqueId must refer to the parent-level id or bookingId depending on `from`
                const uniqueId =
                  from === "freetrial" || from === "waitingList" || from === "membership"
                    ? item.id
                    : item.bookingId;

                const isSelected = selectedIds.includes(uniqueId);

                return (
                  // KEY FIX: use the flattened entry's studentIndex (stable) together with uniqueId
                  <tr
                    key={`${uniqueId}-${studentIndex}`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50"
                  >
                    {columns.map((col, cIdx) => {
                      if (col.selectable) {
                        return (
                          <td key={cIdx} className="p-4 cursor-pointer whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelect(uniqueId);
                                }}
                                className={`lg:w-5 lg:h-5 me-2 flex items-center justify-center rounded-md border-2 ${
                                  isSelected
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : "border-gray-300 text-transparent"
                                }`}
                              >
                                {isSelected && <Check size={14} />}
                              </button>

                              <span>
                                {col.header === "Parent Name"
                                  ? `${item.parents?.[0]?.parentFirstName || ""} ${
                                      item.parents?.[0]?.parentLastName || ""
                                    }`.trim() || "N/A"
                                  : `${student?.studentFirstName || ""} ${
                                      student?.studentLastName || ""
                                    }`.trim() || "N/A"}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      if (col.render) {
                        return (
                          <td key={cIdx} className="p-4 whitespace-nowrap">
                            {col.render(item, student)}
                          </td>
                        );
                      }

                      return (
                        <td key={cIdx} className="p-4 whitespace-nowrap">
                          {item[col.key] ?? student?.[col.key] ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                  Data not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border rounded-md px-2 py-1"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="ml-2">
              {Math.min(startIndex + 1, totalItems)} - {Math.min(startIndex + rowsPerPage, totalItems)} of {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1 ? "text-gray-400 border-gray-200" : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              Prev
            </button>

            {/* Basic page buttons (shows all pages). If you have many pages we can collapse to a windowed paginator.) */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === pageNum ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages ? "text-gray-400 border-gray-200" : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;