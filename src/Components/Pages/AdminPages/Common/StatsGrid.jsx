// src/components/StatsGrid.jsx
import React from "react";

const StatsGrid = ({ stats, variant = "A" }) => {
  const gridCols =
    variant === "A"
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-5"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid ${gridCols} mb-5 gap-4`}>
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-4 w-full max-w-full"
        >
          {/* Icon Section */}
          {variant === "A" ? (
            <div className="rounded-full flex items-center justify-center">
              <img
                src={item.icon}
                className="w-10 h-10 object-contain"
                alt={item.title}
              />
            </div>
          ) : (
            <div
              className={`min-w-[50px] min-h-[50px] p-3 rounded-full flex items-center justify-center ${item.bg}`}
            >
              <img
                src={item.icon}
                className="w-6 h-6 object-contain"
                alt={item.title}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col w-full">
            {/* Title */}
            <p
              className={`leading-tight ${
                variant === "A"
                  ? "text-[14px] text-gray-500"
                  : "text-sm text-gray-500"
              }`}
            >
              {item.title}
            </p>

            {/* Main Value */}
            <div className="text-lg font-semibold text-gray-900 flex items-center gap-1 flex-wrap">
              {item.value}
              {item.subValue && (
                <span className="text-sm font-normal text-green-500 whitespace-nowrap">
                  {item.subValue}
                </span>
              )}
            </div>

            {/* Change Tag */}
            {item.change && (
              <span
                className={`text-xs font-medium mt-1 ${item.color || ""}`}
              >
                {item.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
