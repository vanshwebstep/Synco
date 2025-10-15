import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const tabs = [
    "General",
    "History of Payments",
    "Credits",
    "Attendance",
];
// import ServiceHistory from "./serviceHistory";
// import ParentProfile from "../ParentProfile";
import { useBookFreeTrial } from '../../../contexts/BookAFreeTrialContext';
import HistoryOfPayments from "./HistoryOfPayments";

const SeeDetails = () => {
    const { serviceHistoryMembership, serviceHistory } = useBookFreeTrial()

    const navigate = useNavigate();
    const location = useLocation();
    const [itemId, setItemId] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
console.log('serviceHistory',serviceHistory)
    

    useEffect(() => {
        if (location.state?.itemId) {
            setItemId(location.state.itemId);
        }

        if (location.state?.memberInfo) {
            setMemberInfo(location.state.memberInfo);
        }
    }, [location.state]);


    useEffect(() => {
        const fetchData = async () => {
            if (itemId) {
                await serviceHistoryMembership(itemId);
            }
        };
        fetchData();
    }, [itemId, serviceHistoryMembership]);
    const [activeTab, setActiveTab] = useState("Service History");



    return (
        <>
            <div className=" flex justify-between items-end mb-5 gap-2 md:gap-3">
                <div className=" flex items-center gap-2 md:gap-3">
                    <h2
                        onClick={() => {
                            navigate(
                                memberInfo === 'allMembers'
                                    ? "/weekly-classes/all-members/list"
                                    : "/weekly-classes/all-members/membership-sales"
                            );
                        }}
                        className="text-xl md:text-2xl font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    >
                        <img
                            src="/demo/synco/icons/arrow-left.png"
                            alt="Back"
                            className="w-5 h-5 md:w-6 md:h-6"
                        />
                    </h2>
                    <div className="flex gap-0   p-1 rounded-xl flex-wrap bg-white">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 rounded-xl text-[16px] font-medium transition capitalize
        ${activeTab === tab ? "bg-[#237FEA] text-white" : "hover:text-[#237FEA]"}      `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>


                <div className=" flex items-start  gap-2 md:gap-3">
                    <button
                        className=" border border-black flex items-center gap-2 text-black px-8 py-8 md:py-[12px] rounded-xl hover:bg-gray-200 text-[18px]  "
                    >
                        See Failed Payments
                    </button><button
                        className="border border-[#237FEA]  flex items-center gap-2 text-[#237FEA] px-8 py-8 md:py-[12px] rounded-xl hover:bg-[#237FEA] hover:text-white text-[18px]  "
                    >
                        Add a subscription
                    </button>
                    <button
                        className="bg-[#237FEA] flex items-center gap-2 text-white px-8 py-8 md:py-[12px] rounded-xl hover:bg-blue-700 text-[18px]  "
                    >
                        Create Payment
                    </button>
                </div>
            </div >
            {/* {/* {activeTab === "Service History" && (
        <ServiceHistory serviceHistory={serviceHistory} />
      )} */}
            {activeTab === "History of Payments" && (
                <HistoryOfPayments stateData={serviceHistory} />
            )}
        </>
    )
}

export default SeeDetails