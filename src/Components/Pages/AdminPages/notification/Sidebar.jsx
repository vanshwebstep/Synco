
import { useMembers } from "../contexts/MemberContext";

const tabs = [
  { label: "All" },
  { label: "Complaints", count: 2 },
  { label: "Cancelled Memberships" },
  { label: "Payments", count: 10 },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useMembers();

  return (
    <div className="md:w-3/12 lg:w-[508px] bg-white rounded-2xl">
      <h2 className="text-[24px] font-semibold mb-4 px-7 pt-5">Categories</h2>
      <ul className="space-y-2">
        {tabs.map((tab) => (
          <li
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`cursor-pointer text-[#282829] font-medium p-4 items-center flex gap-5 text-[18px] items-center px-7  ${
              activeTab === tab.label
                ? "bg-[#F7FBFF] border-l-3 border-[#237FEA] font-medium"
                : ""
            }`}
          >
            <span>{tab.label}</span>
            {tab.count && (
              <span className="bg-[#FF5C40] text-white text-[14px] font-semibold rounded-full h-7 w-7 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
