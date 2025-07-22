import { useMembers } from "../contexts/MemberContext";
import { useNotification } from "../contexts/NotificationContext";

const validCategories = [
  "Complaints",
  "Payments",
  "Cancelled Memberships",
  "Members",
  "Member Roles",
  "System",
  "Activity Logs",
  "Security",
  "Login",
  "Settings",
  "Updates",
  "Announcements",
  "Tasks",
  "Messages",
  "Support"
];

const allTabs = ["All", ...validCategories];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useMembers();
  const { notification, customnotificationAll } = useNotification();

  // ✅ Merge and sanitize notifications
  const mergedNotifications = [...notification, ...customnotificationAll].map(n => ({
    ...n,
    category: (typeof n.category === "string" ? n.category.trim() : "") || "System"
  }));

  // ✅ Filter unread only
  const unreadNotifications = mergedNotifications.filter(n => !n.isRead);

  // ✅ Count unread per category
  const categoryCounts = unreadNotifications.reduce((acc, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Optional: Sort categories with unread items first
  // const sortedTabs = [...allTabs].sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));
  const tabsToDisplay = allTabs; // or use sortedTabs for sorting

  return (
    <div className="md:w-3/12 bg-white rounded-2xl">
      <h2 className="text-[24px] font-semibold mb-4 px-7 pt-5">Categories</h2>
      <ul className="space-y-2">
        {tabsToDisplay.map((tabLabel) => {
          const count =
            tabLabel === "All"
              ? unreadNotifications.length
              : categoryCounts[tabLabel] || 0;

          return (
            <li
              key={tabLabel}
              onClick={() => setActiveTab(tabLabel)}
              className={`cursor-pointer text-[#282829] font-medium p-4 flex gap-5 text-[18px] px-7 ${
                activeTab === tabLabel
                  ? "bg-[#F7FBFF] border-l-3 border-[#237FEA] font-medium"
                  : ""
              }`}
            >
              <span>{tabLabel}</span>
              {count > 0 && (
                <span className="bg-[#FF5C40] text-white text-[14px] font-semibold rounded-full h-7 w-7 flex items-center justify-center">
                  {count}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
