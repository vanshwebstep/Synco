// src/components/DynamicTable.jsx
import React from "react";
import { Check } from "lucide-react";

const DynamicTable = ({ columns, data, from, selectedIds, setSelectedStudents, onRowClick }) => {
  const toggleSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };
  console.log('data', data)
  // ✅ Utility function


  return (
    <div className="overflow-auto mt-5 rounded-4xl w-full">
      <table className="min-w-full rounded-4xl bg-white text-sm border border-[#E2E1E5]">
        <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
          <tr className="font-semibold">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 text-[#717073]">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) =>
              item.students.map((student, studentIndex) => {
                console.log('item', item)
                const uniqueId =
                  from === "freetrial" || from === "waitingList" || from === "membership"
                    ? item.id
                    : item.bookingId;

                const isSelected = selectedIds.includes(uniqueId);

                return (
                  <tr
                    key={`${uniqueId}-${studentIndex}`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50"
                  >
                    {columns.map((col, cIdx) => {
                      // ✅ Dynamic checkbox column
                      if (col.selectable) {
                        return (
                          <td
                            key={cIdx}
                            className="p-4 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // ⛔ prevent row redirect
                                  toggleSelect(uniqueId);
                                }}
                                className={`lg:w-5 lg:h-5 me-2 flex items-center justify-center rounded-md border-2 
                  ${isSelected
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : "border-gray-300 text-transparent"
                                  }`}
                              >
                                {isSelected && <Check size={14} />}
                              </button>

                              {/* ✅ If header = Parent Name, show parent; else show student */}
                              <span>
                                {col.header === "Parent Name"
                                  ? `${item.parents?.[0]?.parentFirstName || ""} ${item.parents?.[0]?.parentLastName || ""
                                    }`.trim() || "null"
                                  : `${student.studentFirstName || ""} ${student.studentLastName || ""
                                    }`.trim() || "null"}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      // ✅ Custom render
                      if (col.render) {
                        return (
                          <td key={cIdx} className="p-4   hj">
                            {col.render(item, student)}
                          </td>
                        );
                      }

                      // ✅ Default value lookup
                      return (
                        <td key={cIdx} className="p-4">
                          {item[col.key] || student[col.key] || "-"}
                        </td>
                      );
                    })}
                  </tr>
                );

              })
            )
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-4 text-gray-500"
              >
                Data not found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default DynamicTable;
