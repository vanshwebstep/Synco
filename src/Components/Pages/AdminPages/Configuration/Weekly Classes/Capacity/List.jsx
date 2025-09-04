// src/components/Capacity.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import Select from "react-select";
import Swal from "sweetalert2";
import { PieChart, Pie, Cell } from "recharts";

const Capacity = () => {
    const navigate = useNavigate();
    const booked = 1654
    const total = 2040
    const percentage = Math.round((booked / total) * 100);

    const venueOptions = [
        { value: "venue1", label: "Venue 1 (Downtown)" },
        { value: "venue2", label: "Venue 2 (Uptown)" },
        { value: "venue3", label: "Venue 3 (Suburbs)" },
    ];
    const data = [
        { name: "Booked", value: percentage },
        { name: "Remaining", value: 100 - percentage },
    ];

    const COLORS = ["#237FEA", "rgba(255,255,255,0.3)"];
    const COLORS2 = ["#ffffff", "rgba(255,255,255,0.3)"];

    const legendItems = [
        { label: "Total Students", color: "#F9FAFB", borderColor: "#ccc" },
        { label: "Members", color: "#237FEA", borderColor: "#237FEA" },
        { label: "Free Trials", color: "#EEAA1F", borderColor: "#EEAA1F" },
        { label: "Spaces Available", color: "#34AE56", borderColor: "#34AE56" },
        { label: "No Spaces", color: "#FE7058", borderColor: "#FE7058" },
    ];
    return (
        <div>

            <div className="flex items-end justify-between">
                <div className="flex gap-5 py-5 items-center a ">
                    <div className="relative w-100">
                        <Select
                            options={venueOptions}
                            placeholder="Search venue"
                            className=" "
                            classNamePrefix="react-select"
                            isClearable={true} // cross button
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderRadius: "1.5rem",
                                    borderColor: state.isFocused ? "#ccc" : "#E5E7EB",
                                    boxShadow: "none",
                                    padding: "4px 8px",
                                    minHeight: "48px",
                                }),
                                placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                indicatorSeparator: () => ({ display: "none" }),
                            }}
                        />
                    </div>
                    <button className="flex gap-2 items-center bg-[#237FEA] text-white px-3 py-3 rounded-lg text-sm sm:text-[16px]">
                        <img src='/demo/synco/DashboardIcons/filtericon.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                        Filters
                    </button>
                </div>
                <div className="flex justify-end flex-wrap items-center w-full mt-6">


                    {/* Total Box with Circular Progress */}
                    <div className="bg-[#237FEA]  text-white rounded-3xl shadow-md px-6 py-4 flex items-center">
                        <div className="flex flex-col">
                            <span className="text-[16px] font-semibold">Total</span>
                            <span className="text-[14px] text-[#D8DEF5]">
                                {booked} Booked of <br></br> {total} Spaces
                            </span>
                        </div>

                        <div className="ml-6  relative">
                            <PieChart width={80} height={80}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    startAngle={90}
                                    endAngle={-270}
                                    innerRadius={32}
                                    outerRadius={38}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS2[index]} />
                                    ))}
                                </Pie>
                            </PieChart>
                            <span className="absolute inset-0 flex items-center justify-center text-[18px] font-semibold">
                                {percentage}%
                            </span>
                        </div>
                    </div>
                    {/* Legend Section */}
                    <div className="flex my-5 items-center gap-6">
                        {legendItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">

                                <span className="text-[18px] font-semibold text-[#282829 ]">
                                    {item.label}
                                </span>
                                <span
                                    className={`w-6 h-6 rounded-md border  border-[${item.borderColor}]`}
                                    style={{ backgroundColor: item.color }
                                    }
                                ></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="transition-all duration-300 flex-1 bg-white space-y-6">
                <div className="rounded-2xl relative p-2 border border-[#D9D9D9] shadow-sm bg-white">
                    {/* Header */}
                    <div className="bg-[#2E2F3E] text-white p-4 rounded-xl flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <img src="/demo/synco/icons/crown.png" alt="" />
                            <span className="font-medium text-[20px]">
                                Weekly Classes Membership
                            </span>
                        </div>

                    </div>

                    {/* Venue Content */}
                    <div className="flex items-center bg-[#FCF9F6] flex-col lg:flex-row">
                        <div className="px-4 w-full py-2 flex-1 space-y-6">
                            <div className="flex gap-4 justify-between items-center flex-wrap">
                                {/* Membership Plan */}
                                <div>
                                    <div className="font-semibold text-[16px] text-black">
                                        Action
                                    </div>
                                    <div className="whitespace-nowrap text-[#717073] font-semibold text-[14px]">
                                        Saturday
                                    </div>
                                </div>

                                {/* Students */}
                                <div className="block text-center pr-10 border-r  border-[#ccc]">
                                    <div className="whitespace-nowrap font-semibold text-[14px]">
                                        Class 1: 3-7 years, 9:30pm - 10:30pm
                                    </div>
                                    <div className="text-[16px] py-4 font-semibold text-[#384455]">
                                        <div className="flex items-center gap-3 ">
                                            {legendItems.map((item, idx) => (
                                                <div key={idx} className={`w-10 h-10 rounded-md border  border-[${item.borderColor}]`}
                                                    style={{ backgroundColor: item.color }
                                                    }
                                                >
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="block text-center pr-10 border-r  border-[#ccc]">
                                    <div className="whitespace-nowrap font-semibold text-[14px]">
                                        Class 1: 3-7 years, 9:30pm - 10:30pm
                                    </div>
                                    <div className="text-[16px] py-4 font-semibold text-[#384455]">
                                        <div className="flex items-center gap-3 ">
                                            {legendItems.map((item, idx) => (
                                                <div key={idx} className={`w-10 h-10 rounded-md border  border-[${item.borderColor}]`}
                                                    style={{ backgroundColor: item.color }
                                                    }
                                                >
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Booking ID */}
                                <div className="block text-center pr-10 border-r  border-[#ccc]">
                                    <div className="whitespace-nowrap font-semibold text-[14px]">
                                        Class 1: 3-7 years, 9:30pm - 10:30pm
                                    </div>
                                    <div className="text-[16px] py-4 font-semibold text-[#384455]">
                                        <div className="flex items-center gap-3 ">
                                            {legendItems.map((item, idx) => (
                                                <div key={idx} className={`w-10 h-10 rounded-md border  border-[${item.borderColor}]`}
                                                    style={{ backgroundColor: item.color }
                                                    }
                                                >
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>




                                <div className="bg-[#F2ECE6]  border border-[#ccc] text-black rounded-3xl shadow-md px-6 py-4 flex items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[16px] font-semibold">Total</span>
                                        <span className="text-[14px] text-[#717073]">
                                            {booked} Booked of <br></br> {total} Spaces
                                        </span>
                                    </div>

                                    <div className="ml-6  relative">
                                        <PieChart width={80} height={80}>
                                            <Pie
                                                data={data}
                                                cx="50%"
                                                cy="50%"
                                                startAngle={90}
                                                endAngle={-270}
                                                innerRadius={32}
                                                outerRadius={38}
                                                dataKey="value"
                                                stroke="none" // ✅ removes border

                                            >
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                        <span className="absolute inset-0 flex items-center justify-center text-[18px] font-semibold">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Capacity;
