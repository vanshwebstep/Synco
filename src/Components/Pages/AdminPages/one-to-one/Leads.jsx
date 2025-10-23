import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadsDashboard from "./LeadsDashboard";
import SalesDashboard from "./SalesDashboard";
import SessionPlan from "./SessionPlan";


const tabs = [
  { name: "Leads", component: <LeadsDashboard /> },
  { name: "Sales", component: <SalesDashboard /> },
  { name: "All", component: <SessionPlan /> },
];

const Leads = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const navigate = useNavigate();
//   const { loading, setMainId ,fetchMembers } = useAccountsInfo();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get("id"); // <-- this will be "9"  console.log('id',id)

//   useEffect(() => {
//     fetchMembers(id);
//     if (id) {
//       setMainId(id);
//     }
//   }, [])

//   if (loading) return <Loader />;

  return (
    <div className="mt-3 relative">

      <div className="flex md:max-w-[300px] items-center p-3 gap-1 rounded-2xl p-1 space-x-2">
        {/* <h2
          onClick={() => {
            navigate('/weekly-classes/members-info');
          }}>
          <img
            src="/demo/synco/icons/arrow-left.png"
            alt="Back"
            className="w-5 h-5 md:w-6 md:h-6"
          />
        </h2> */}
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative flex-1 w-auto text-[15px] md:text-base font-semibold py-3 px-4 rounded-xl transition-all ${activeTab === tab.name
              ? "bg-[#237FEA] shadow text-white"
              : "text-[#282829] bg-white border border-[#E2E1E5] hover:text-[#282829]"
              }`}
          >
            {tab.name}

          </button>
        ))}
      </div>

      <div className="mt-0">
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </div>
    </div>
  );
};

export default Leads;
