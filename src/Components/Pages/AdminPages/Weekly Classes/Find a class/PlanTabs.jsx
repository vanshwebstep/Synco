import React, { useState } from "react";

const PlanTabs = ({ selectedPlans }) => {
  const groupPlans = (plans, groupSize) => {
    const groups = [];
    for (let i = 0; i < plans.length; i += groupSize) {
      groups.push(plans.slice(i, i + groupSize));
    }
    return groups;
  };

  const groupedPlans = groupPlans(selectedPlans, 3); // 3 plans per tab
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex justify-center my-6">
       <div className="inline-flex rounded-2xl border border-gray-300 bg-white p-1">
        {groupedPlans.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-black  transition ${
              activeTab === index
                ? "bg-[#237FEA] text-white border-[#237FEA]"
                : "bg-white border-gray-300 text-[#237FEA]"
            } font-semibold transition`}
                               

          >
            {index + 1} Student{index > 0 ? "s" : ""}
          </button>
        ))}
      </div>
      </div>

      {/* Plan Cards */}
      <div className="grid pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {groupedPlans[activeTab].map((plan, idx) => (
          <div
            key={plan.id}
            className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition"
          >
            <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">
              {activeTab + 1} Student{activeTab > 0 ? "s" : ""}
            </h3>
            <p className="text-[24px] sm:text-[32px] font-semibold mb-4">
              £{plan.price}
            </p>
            <hr className="mb-4 text-[#E2E1E5]" />
            <ul className="space-y-2 text-[14px] sm:text-[16px] font-semibold pb-10">
              <li className="flex items-center py-2 gap-2">
                <img
                  src="/demo/synco/icons/tick-circle.png"
                  alt=""
                  className="w-5 h-5"
                />
                {plan.duration} {plan.interval}
                {plan.duration > 1 ? "s" : ""}
              </li>
              <li className="flex items-center py-2 pb-2 sm:pb-4 gap-2">
                <img
                  src="/demo/synco/icons/tick-circle.png"
                  alt=""
                  className="w-5 h-5"
                />
                {plan.holidayCampPackage
                  ? "Free Holiday Camp Bag"
                  : "No Holiday Camp Bag"}
              </li>
            </ul>
            <button className="px-8 py-3 text-[16px] font-medium rounded-xl bg-[#237FEA] text-white shadow transition">
              {plan.joiningFee ? `£${plan.joiningFee} Joining Fee` : "No Joining Fee"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTabs;
