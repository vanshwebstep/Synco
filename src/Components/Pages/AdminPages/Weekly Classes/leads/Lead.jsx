
import {
    Plus,
} from "lucide-react";
import { TiUserAdd } from "react-icons/ti";
import Cards from "./Cards";
import Filters from "./Filters";
import { useLeads } from "../../contexts/LeadsContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Lead = () => {
    const leadsData = useLeads();
    const { activeTab, setActiveTab, setSearchTerm, tabs, fetchData, setSelectedVenue, loading, setCurrentPage } = leadsData;
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
    }, [activeTab]);
    console.log('acsstiveTab', activeTab)
    if (!leadsData) return (<>Loading</>)
    return (
        <div className="min-h-screen overflow-hidden bg-gray-50 py-6 flex flex-col lg:flex-row ">


            <div className="md:w-[73%] fullwidth80 gap-6 md:pe-3 mb-4 md:mb-0">
                <Cards />
                <div className="flex justify-between items-center mt-5">


                    <div className="flex  items-center  p-1 space-x-2 overflow-auto">

                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                disabled={loading}
                                onClick={() => {
                                    setSelectedVenue(null);setSearchTerm("");
                                    setCurrentPage(1);
                                    setActiveTab(tab.name);
                                }}
                                className={`relative flex-1 text-[15px] px-3 md:text-base font-semibold py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.name
                                    ? "bg-[#237FEA] shadow text-white"
                                    : "text-[#282829] hover:text-[#282829] border border-[#E2E1E5]"
                                    }`}
                            >
                                {tab.name}

                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 items-center">
                        <button className="bg-white border border-[#E2E1E5] rounded-full flex justify-center items-center h-10 w-10"><TiUserAdd className="text-xl" /></button>
                        <button onClick={() => navigate('/weekly-classes/central-leads/create')}
                            className="flex items-center gap-2 bg-[#237FEA] text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <Plus size={16} />
                            Add new lead
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    {tabs.find((tab) => tab.name === activeTab)?.component}
                </div>
            </div>


            <Filters />


        </div>
    );
};

export default Lead;
