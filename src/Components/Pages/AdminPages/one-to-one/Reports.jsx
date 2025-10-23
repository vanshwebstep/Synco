import { useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,

} from "recharts";
import Select from "react-select";

import { PiUsersThreeBold } from "react-icons/pi";
import {
    Database, CirclePercent, CirclePoundSterling, PackageOpen,
    Box,
    Plus
} from "lucide-react";
const lineData = [
    { month: "Jan", students: 300, comparison: 280 },
    { month: "Feb", students: 350, comparison: 320 },
    { month: "Mar", students: 420, comparison: 310 },
    { month: "Apr", students: 500, comparison: 380 },
    { month: "May", students: 620, comparison: 420 },
    { month: "Jun", students: 570, comparison: 430 },
    { month: "Jul", students: 640, comparison: 450 },
    { month: "Aug", students: 600, comparison: 470 },
    { month: "Sep", students: 680, comparison: 490 },
    { month: "Oct", students: 710, comparison: 520 },
    { month: "Nov", students: 750, comparison: 540 },
    { month: "Dec", students: 800, comparison: 560 },
];

const marketingData = [
    { name: "Facebook", value: 23456, percent: "50%" },
    { name: "Website", value: 14000, percent: "30%" },
    { name: "Instagram", value: 9000, percent: "20%" },
    { name: "Referral", value: 5000, percent: "10%" },
    { name: "Socials", value: 4000, percent: "10%" },
    { name: "Other", value: 3000, percent: "10%" },
];

const topAgents = [
    { name: "Jessica Smith", value: 50, avatar: "JS" },
    { name: "Mark Johnson", value: 30, avatar: "MJ" },
    { name: "Ava Brown", value: 20, avatar: "AB" },
    { name: "Liam Davis", value: 10, avatar: "LD" },
    { name: "Sophia Lee", value: 8, avatar: "SL" },
];

const pieData = [
    { name: "Gold Package", value: 1235 },
    { name: "Silver Package", value: 3245 },
];

const COLORS = ["#7C3AED", "#FBBF24"];

const statCards = [
    { icon: PiUsersThreeBold, iconStyle: "text-[#3DAFDB] bg-[#E6F7FB]", title: "Total Leads", value: "375", sub: "vs. previous period 275" },
    { icon: Database, iconStyle: "text-[#6F65F1] bg-[#F6F6FE]", title: "Number of Sales", value: "126", sub: "vs. prev period 275" },
    { icon: CirclePercent, iconStyle: "text-[#34AE56] bg-[#F0F9F9]", title: "Conversion Rate", value: "65%", sub: "vs. previous period 15%" },
    { icon: CirclePoundSterling, iconStyle: "text-[#E769BD] bg-[#FEF6FB]", title: "Revenue Generated", value: "£6,500", sub: "vs. previous period £7,020" },
    { icon: PackageOpen, iconStyle: "text-[#099699] bg-[#F0F9F9]", title: "Revenue Gold Package", value: "£6,500", sub: "vs. previous period £7,020" },
    { icon: Box, iconStyle: "text-[#F38B4D] bg-[#FEF8F4]", title: "Revenue Silver Package", value: "£6,500", sub: "vs. previous period £7,020" },
];

export default function Reports() {

    const [selectedOption, setSelectedOption] = useState({ value: "lastMonth", label: "Last month" });

    const options = [
        { value: "lastMonth", label: "Last month" },
        { value: "last3Months", label: "Last 3 months" },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: "8px",
            borderColor: "#E2E1E5",
            padding: "2px 2px",
            minHeight: "42px",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#c7c6cb",
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "0 12px",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#000",
            fontSize: "0.875rem", // text-sm
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#777",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 10,
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: "0.875rem",
            backgroundColor: state.isFocused ? "#f2f2f2" : "#fff",
            color: "#000",
            cursor: "pointer",
        }),
    };

    return (
        <div className="">
            <div className=" mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">One to one</h1>
                    <div className="flex items-center space-x-3">
                        <Select
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={options}
                            styles={customStyles}
                            classNamePrefix="react-select"
                            isSearchable={false}
                        />
                        <button className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-2 rounded-lg shadow">
                            <Plus /> Export data
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {statCards.map((s, i) => {
                        const Icon = s.icon;

                        return (
                            <div
                                key={i}
                                className="bg-white flex items-center gap-2  rounded-[30px] p-4   "
                            >
                                <div>
                                    <div
                                        className={`p-2 h-[50px] w-[50px] rounded-full ${s.iconStyle} bg-opacity-10 flex items-center justify-center`}
                                    >
                                        <Icon size={24} className={s.iconStyle} />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[14px] text-[#717073] font-semibold">{s.title}</div>
                                    <div className="text-[20px] text-black font-semibold">{s.value}</div>
                                    <div className="text-[12px] text-[#717073] font-semibold ">{s.sub}</div>
                                </div>
                            </div>

                        )
                    })}
                </div>

                <div className="flex">
                    <div className=" space-y-6 md:w-[75%] md:pe-6">
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-[24px]">One to one students</h2>
                                <div className="text-sm text-slate-400">...</div>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="students" stroke="transparent" fill="url(#colorStudents)" />
                                        <Line type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="comparison" stroke="#FB7185" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="md:grid grid-cols-2 gap-6">
                            <div className="bg-white p-5 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Marketing channel performance</h3>
                                    <div className="text-slate-400">...</div>
                                </div>
                                <div className="space-y-4">
                                    {marketingData.map((m, idx) => {
                                        const pct = Math.min(100, Math.round((m.value / 23456) * 100)); 
                                        return (
                                            <div key={idx}>
                                                <div className=" text-sm mb-2">
                                                    <div className="text-slate-600">{m.name}</div>
                                                    <div className="text-slate-400">{m.percent}</div>
                                                </div>
                                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-3 rounded-full"
                                                        style={{ width: pct + "%", backgroundColor: "#2563EB" }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Top Agents</h3>
                                    <div className="text-slate-400">...</div>
                                </div>
                                <div className="space-y-4">
                                    {topAgents.map((a, idx) => (
                                        <div key={idx} className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-medium text-indigo-700">
                                                {a.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div className="text-sm font-medium">{a.name}</div>
                                                    <div className="text-sm text-slate-400">{a.value}</div>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                                                    <div className="h-2 rounded-full" style={{ width: `${(a.value / 50) * 100}%`, backgroundColor: "#60A5FA" }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" gap-6 md:w-[25%]">
                      
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Package breakdown</h3>
                                    <div className="text-slate-400">...</div>
                                </div>
                                <div className="">
                                    <div className=" h-50">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    {pieData.map((entry, idx) => (
                                                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="ml-4 flex gap-4 justify-between">
                                        <div>  <div className="text-sm text-slate-500">Gold Package</div>
                                            <div className="font-semibold">1,235</div></div>
                                        <div>   <div className="text-sm text-slate-500 ">Silver Package</div>
                                            <div className="font-semibold">3,245</div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Renewal</h3>
                                    <div className="text-slate-400">...</div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <div className="text-slate-600">Gold</div>
                                            <div className="text-slate-400">50%</div>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div className="h-3 rounded-full" style={{ width: "50%", backgroundColor: "#2563EB" }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <div className="text-slate-600">Silver</div>
                                            <div className="text-slate-400">30%</div>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div className="h-3 rounded-full" style={{ width: "30%", backgroundColor: "#60A5FA" }} />
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        Reason
                                        <div className="mt-2 text-xs text-slate-500">
                                            The main reason is that they feel good with the packages but they don't need to renewal.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Revenue by Package</h3>
                                    <div className="text-slate-400">...</div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-slate-500 text-sm">Gold</div>
                                                <div className="font-semibold">£10,000</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-400">Revenue Growth</div>
                                                <div className="font-semibold text-sm">57%</div>
                                                <div className="text-xs text-red-400">vs. last month 34%</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-slate-500 text-sm">Silver</div>
                                                <div className="font-semibold">£10,000</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-400">Revenue Growth</div>
                                                <div className="font-semibold text-sm">57%</div>
                                                <div className="text-xs text-red-400">vs. last month 34%</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-6" />
            </div>
        </div>
    );
}
