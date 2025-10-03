import React, { useState } from "react";

const PlanTabs = ({ selectedPlans }) => {
  // Group by number of students
  const groupByStudents = selectedPlans.reduce((acc, plan) => {
    if (!acc[plan.students]) acc[plan.students] = [];
    acc[plan.students].push(plan);
    return acc;
  }, {});

  const studentKeys = Object.keys(groupByStudents).sort(); // ["1", "2", "3"]
  const [activeTab, setActiveTab] = useState(studentKeys[0]);
   console.log('groupByStudents', groupByStudents[activeTab])
  const sortedPlans = Array.isArray(groupByStudents[activeTab])
    ? [...groupByStudents[activeTab]]
    : groupByStudents[activeTab] && typeof groupByStudents[activeTab] === 'object'
      ? Object.values(groupByStudents[activeTab])
      : [];
  sortedPlans.sort((a, b) => {
    // Sort by duration ascending
    if (a.interval === "Year" && b.interval !== "Year") return 1;
    if (b.interval === "Year" && a.interval !== "Year") return -1;

    // Optional: Sort by interval if needed (e.g., Month before Year)
    const intervalOrder = ["Day", "Week", "Month", "Year"];
    return intervalOrder.indexOf(a.interval) - intervalOrder.indexOf(b.interval);
  });
  return (
    <div className="w-full">

      {
        sortedPlans && sortedPlans.length > 0 ?
          (
            <>
              <div className="flex justify-center my-6">
                <div className="md:inline-flex rounded-2xl border border-gray-300 bg-white p-1">
                  {studentKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-6 md:w-auto w-full py-2 text-[16px] font-medium rounded-xl transition ${activeTab === key
                          ? "bg-[#237FEA] text-white"
                          : "bg-white text-[#237FEA]"
                        }`}
                    >
                      {key} Student{key > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Cards */}
              <div className="grid pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedPlans?.map((plan, idx) => (
                  <div
                    key={plan?.id}
                    className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow transition"
                  >
                    <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-[24px] sm:text-[32px] font-semibold mb-4">
                      £{plan?.price?.toFixed(2)}/<span className="text-sm">{plan.interval?.toLowerCase()}</span>
                    </p>
                    <hr className="mb-4 text-[#E2E1E5]" />
                    <ul className="space-y-2 text-[14px] sm:text-[16px] font-semibold pb-10">
                      {(
                        plan.HolidayCampPackage || plan.holidayCampPackage // ✅ support both
                      ) &&
                        new DOMParser()
                          .parseFromString(
                            plan.HolidayCampPackage || plan.holidayCampPackage,
                            "text/html"
                          )
                          .body.textContent
                          // Replace <br> and &nbsp; with markers
                          .replace(/\r?\n|&nbsp;/gi, "###")
                          // Split by <p>, <br>, or markers
                          .split(/###|<\/?p>/gi)
                          .map((item, index) => {
                            const text = item.replace(/<\/?[^>]+(>|$)/g, "").trim(); // clean tags
                            return text ? (
                              <li key={index} className="flex items-center gap-2">
                                <img
                                  src="/demo/synco/icons/tick-circle.png"
                                  alt=""
                                  className="w-5 h-5"
                                />
                                {text}
                              </li>
                            ) : null;
                          })}
                    </ul>

                    <button className="px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-white shadow transition">
                      {plan.joiningFee ? `£${plan.joiningFee} Joining Fee` : "Not Defined Joining Fee"}
                    </button>
                  </div>
                ))}
              </div>

            </>
          ) : (
            <p className="text-center text-gray-500 text-lg font-medium py-10">
              No plans found.
            </p>
          )
      }

    </div>
  );
};

export default PlanTabs;
