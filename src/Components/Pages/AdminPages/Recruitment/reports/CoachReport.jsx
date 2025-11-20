import React, { useState, useMemo } from "react";
import Select from "react-select";
import {
    Users,
    CalendarDays,
    CalendarCheck,
    UserCheck,
    BarChart3,
    Download,
    EllipsisVertical,
    MoreVertical,
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

/**
 * Dummy static data (based on what you provided earlier)
 */
const dashboardData = {
    recruitmentChart: {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        leads: [420, 480, 500, 530, 580, 620, 650, 700, 720, 760, 780, 820],
        hires: [180, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420],
    },

    recruitmentCallStats: {
        callsMade: {
            value: 1920,
            previous: 2004,
        },
        avgCallDuration: {
            value: "23 min",
            previous: "10 min",
        },
        timeToFirstContact: {
            value: "3 hr 16 min",
            previous: "1 hr 8 min",
        },
    },

    coachesDemographics: {
        byAge: [
            { label: "18", value: 2348, percent: 10 },
            { label: "23", value: 1800, percent: 10 },
            { label: "28", value: 1650, percent: 10 },
            { label: "33", value: 1500, percent: 10 },
            { label: "38", value: 1300, percent: 10 },
            { label: "43", value: 1200, percent: 10 },
            { label: "48", value: 1100, percent: 10 },
            { label: "53", value: 900, percent: 10 },
            { label: "58", value: 700, percent: 10 },
            { label: "63+", value: 400, percent: 10 },
        ],
        byGender: [
            { label: "Male", value: 2348, percent: 10 },
            { label: "Female", value: 1800, percent: 10 },
            { label: "Others", value: 1650, percent: 10 },
        ],
    },

    qualifications: [
        { label: "FA Qualification(s)", value: 3 ,img:'/demo/synco/reportsIcons/fa.png'},
        { label: "DBS Certificate", value: 2 ,img:'/demo/synco/reportsIcons/dbs.png'},
        { label: "2–3 years of coaching experience", value: 4 ,img:'/demo/synco/reportsIcons/coaching.png'},
        { label: "No experience", value: 3 ,img:'/demo/synco/reportsIcons/experience.png'},
    ],

    onboardingResults: [
        { label: "Average Call Grade", value: "82%" },
        { label: "Average Practical Assessment Grade", value: "67%" },
        { label: "Average Coach Education Pass Mark", value: "79%" },
    ],

    topAgents: [
        { name: "Jessica Smith", count: 50 },
        { name: "Aiden Jones", count: 30 },
        { name: "Priya Kumar", count: 20 },
        { name: "Liam Brown", count: 10 },
        { name: "Mia White", count: 5 },
    ],

    sourceOfLeads: [
        { label: "Indeed", value: 45 },
        { label: "Google", value: 30 },
        { label: "Instagram", value: 20 },
        { label: "Referral", value: 10 },
        { label: "LinkedIn", value: 5 },
        { label: "Other", value: 3 },
    ],

    highDemandVenues: [
        { label: "Acton", value: 2346 },
        { label: "Kings Cross", value: 2100 },
        { label: "Chelsea", value: 1900 },
        { label: "Greenwich", value: 1850 },
        { label: "Hackney", value: 1800 },
        { label: "Brixton", value: 1700 },
    ],
};

const dateOptions = [
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
];

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        border: "1px solid #E2E1E5",
        borderRadius: "0.5rem",
        boxShadow: state.isFocused ? "0 0 0 1px #237FEA" : "none",
        minHeight: "40px",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#237FEA" : state.isFocused ? "#F3F4F6" : "white",
        color: state.isSelected ? "white" : "#111827",
        cursor: "pointer",
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: "0.5rem",
        overflow: "hidden",
        zIndex: 50,
    }),
};

const stats = [
    {
        icon: "/demo/synco/reportsIcons/user-group.png",
        iconStyle: "text-[#3DAFDB] bg-[#F3FAFD]",
        title: "Total Leads",
        value: ` 150`,
        sub: "vs. prev period  ",
        subvalue: '275'
    },
    {
        icon: "/demo/synco/reportsIcons/Calling.png",
        iconStyle: "text-[#E769BD] bg-[#F3FAFD]",
        title: "No. of telephone interviews",
        value: `87`,
        diff: "+33%",
        sub: "vs. prev period",
        subvalue: '275'
    },
    {
        icon: "/demo/synco/reportsIcons/Note.png",
        iconStyle: "text-[#F38B4D] bg-[#FEF8F4]",
        title: "No. of practical assessments",
        value: `42`,
        diff: "+33%",
        sub: "vs. prev period ",
        subvalue: '150'
    },
    {
        icon: "/demo/synco/reportsIcons/Recruitment.png",
        iconStyle: "text-[#6F65F1] bg-[#F3FAFD]",
        title: "No. of hires",
        value: `32`,
        diff: "",
        sub: "vs. prev period ",
        subvalue: '75%'
    },
    {
        icon: "/demo/synco/reportsIcons/Percent.png",
        iconStyle: "text-[#FF5353] bg-[#F0F9F9]",
        title: "Conversion Rate (Leads to recruitment)",
        value: `65%`,
        diff: "",
        sub: "vs. prev period ",
        subvalue: '15%'
    },

];

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}>{children}</div>
);


export default function CoachReport() {
    const [dateRange, setDateRange] = useState(dateOptions[0]);
    const [activeTab, setActiveTab] = useState("byAge");

    // Build chart data for recharts: [{ month, current, previous }, ...]
    const chartData = useMemo(() => {
        const labels = dashboardData.recruitmentChart.labels;
        return labels.map((m, idx) => ({
            month: m,
            current: dashboardData.recruitmentChart.leads[idx],
            previous: dashboardData.recruitmentChart.hires[idx],
        }));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6 pt-0">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Coach Recruitment</h1>
                <div className="flex flex-wrap gap-3 items-center absolute top-0 right-0">

                    <Select
                        components={{ IndicatorSeparator: () => null }}
                        placeholder='Date Range'
                        options={dateOptions}
                        defaultValue={dateOptions[0]}
                        styles={customSelectStyles}
                        className="md:w-40"
                    />
                    <button className="flex items-center gap-2 bg-[#237FEA] text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                        <Download size={16} /> Export data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (


                    <div
                        key={i}
                        className="bg-white rounded-4xl p-3 flex items-center gap-4 hover:shadow-md transition-all duration-200"
                    >
                        <div>
                            <div
                                className={`p-2 h-[50px] w-[50px] p-2 rounded-full flex items-center justify-center ${s.iconStyle}`}
                            >
                                <div className={s.iconStyle}><img className="p-1" src={s.icon} alt="" /></div>
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold text-[#717073] text-sm">{s.title}</span>

                            <h3 className="text-[20px] font-semibold text-gray-900">{s.value} <small className="text-green-500 font-normal text-xs">{s.diff}</small></h3>
                            <p className="text-xs font-semibold text-[#717073]">
                                {s.sub} <span className="text-red-500">{s.subvalue}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left / center area */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="grid  gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold text-gray-800">Recruitment Chart (Leads vs Hires)</h2>
                                    <EllipsisVertical className="text-gray-400" />
                                </div>

                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={false}
                                                contentStyle={{
                                                    backgroundColor: "rgba(255,255,255,0.9)",
                                                    border: "1px solid #E5E7EB",
                                                    borderRadius: 8,
                                                    fontSize: 12,
                                                }}
                                            />
                                            <defs>
                                                <linearGradient id="colorLeads" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                                                </linearGradient>
                                                <linearGradient id="colorHires" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.02} />
                                                </linearGradient>
                                            </defs>

                                            <Area type="monotone" dataKey="current" stroke="none" fill="url(#colorLeads)" />
                                            <Area type="monotone" dataKey="previous" stroke="none" fill="url(#colorHires)" />

                                            <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
                                            <Line type="monotone" dataKey="previous" stroke="#EC4899" strokeWidth={2.5} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* Right small stats card (Recruitment Call Statistics) */}

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <Card>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">Coaches Demographics</h3>
                                    <EllipsisVertical className="text-gray-400" />
                                </div>

                                <div className="mb-3">
                                    <div className="grid md:grid-cols-3 items-center gap-3 mb-3 border border-[#E2E1E5] p-2 w-full rounded-2xl">
                                        <button
                                            onClick={() => setActiveTab("byAge")}
                                            className={`px-3 py-2 rounded-xl text-sm ${activeTab === "byAge" ? "bg-[#237FEA] text-white" : "text-gray-600"
                                                }`}
                                        >
                                            By age
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("byGender")}
                                            className={`px-3 py-2 rounded-xl text-sm ${activeTab === "byGender" ? "bg-[#237FEA] text-white" : "text-gray-600"
                                                }`}
                                        >
                                            By gender
                                        </button>

                                        <button
                                            onClick={() => setActiveTab("venue")}
                                            className={`px-3 py-2 rounded-xl text-sm ${activeTab === "venue" ? "bg-[#237FEA] text-white" : "text-gray-600"
                                                }`}
                                        >
                                            By venue
                                        </button>
                                    </div>

                                    {dashboardData.coachesDemographics[activeTab]?.slice(0, 6).map((d, i) => (
                                        <div key={i} className="mb-3 flex items-center gap-2">
                                            <div className="flex justify-between  mb-1">
                                                <p className="text-sm text-gray-700">{d.label}</p>
                                            </div>

                                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                                <div
                                                    style={{ width: `${d.percent}%` }}   // percent bar accuracy fixed
                                                    className="h-2 rounded-full bg-[#237FEA]"
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-500">{d.percent}%</p>

                                        </div>
                                    ))}

                                </div>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">Qualifications & Experience</h3>
                                    <EllipsisVertical className="text-gray-400" />
                                </div>

                                <div className="space-y-4">
                                    {dashboardData.qualifications.map((q, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#237FEA]"><img src={q.img} alt="" /></div>
                                                    <p className="text-sm text-gray-700">{q.label}</p>
                                                </div>
                                                <div className="text-sm text-gray-500">{q.value}</div>
                                            </div>

                                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                                <div className="h-2 rounded-full bg-[#237FEA]" style={{ width: `${(q.value / 5) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>


                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Card>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">Source of Leads</h3>
                                <EllipsisVertical className="text-gray-400" />
                            </div>

                            <div className="space-y-3">
                                {dashboardData.sourceOfLeads.map((s, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm text-gray-700">{s.label}</p>
                                            <p className="text-sm text-gray-500">{s.value}%</p>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full">
                                            <div className="h-2 rounded-full bg-[#237FEA]" style={{ width: `${s.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">High demand venues</h3>
                            <div className="space-y-3">
                                {dashboardData.highDemandVenues.map((v, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm text-gray-700">{v.label}</p>
                                            <p className="text-sm text-gray-500">10%</p>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full">
                                            <div className="h-2 rounded-full bg-[#237FEA]" style={{ width: `${(i + 1) * 12}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>



                </div>

                {/* Right column (summary + small cards) */}
                <div className="space-y-6">

                    <div>
                        <Card>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-semibold text-gray-800">Recruitment Call Statistics</h3>
                                <EllipsisVertical className="text-gray-400" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#F3FAFD] text-[#3DAFDB]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 10.5C3 7 6.5 3.5 10 3.5c1.6 0 3 .6 4.2 1.6M15 9.5c0 4-2.2 7.5-6 8.5" stroke="#3DAFDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">No. of calls made</p>
                                        <div className="flex items-baseline gap-2">
                                            <h4 className="text-lg font-semibold">1920</h4>
                                            <span className="text-xs text-gray-400">vs. previous period 2004</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#FFF7F3] text-[#F38B4D]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 3" stroke="#F38B4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Avg. duration of calls</p>
                                        <div className="flex items-baseline gap-2">
                                            <h4 className="text-lg font-semibold">23 min</h4>
                                            <span className="text-xs text-gray-400">vs. previous period 18 months</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#F3F9F6] text-[#34C38F]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 7v6l4 2" stroke="#34C38F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Avg. time duration of first contact</p>
                                        <div className="flex items-baseline gap-2">
                                            <h4 className="text-lg font-semibold">3 hr 16 min</h4>
                                            <span className="text-xs text-gray-400">vs. previous period 1 hr 8 minutes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <Card className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">Onboarding Results</h3>
                            <EllipsisVertical className="text-gray-400" />
                        </div>

                        <div className="space-y-3">
                            {dashboardData.onboardingResults.map((r, i) => (
                                <div key={i}>
                                    <p className="text-sm text-gray-700 mb-1">{r.label}</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                        <div className="h-2 rounded-full bg-[#34C38F]" style={{ width: `${parseInt(r.value)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        <Card>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Top agents with most hires</h3>
                            <div className="space-y-3">
                                {dashboardData.topAgents.map((a, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">JS</div>
                                            <div>
                                                <p className="text-sm text-gray-700">{a.name}</p>
                                                <p className="text-xs text-gray-400">Hires</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700">{a.count}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
