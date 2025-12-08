import { useState, useEffect, useMemo, useCallback } from "react";
import Select from "react-select";
import {
    Download,
    EllipsisVertical,
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

        leads: [300, 320, 400, 420, 480, 300, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 900, 1000, 1200, 1400, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 300, 320, 400, 420, 480, 300, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 720, 760, 780, 820, 530, 480, 620, 650, 700, 720, 760, 780, 820, 300, 320, 400, 420, 480, 300, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 720, 760, 780, 820, 530, 480, 620, 650, 700, 720, 760, 780, 820, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 720, 760, 780, 820, 530, 480, 620, 650, 700, 720, 760, 780, 820],
        hires: [180, 300, 350, 300, 320, 400, 420, 480, 300, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 900, 1000, 1200, 1400, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 720, 760, 780, 820, 530, 480, 620, 650, 700, 720, 760, 780, 820, 300, 320, 400, 420, 480, 300, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 720, 760, 780, 820, 530, 480, 620, 650, 700, 720, 760, 780, 820, 300, 320, 400, 420, 480, 300, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 720, 760, 780, 820, 530, 480, 620, 650, 700, 720, 760, 780, 820, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 300, 320, 400, 420, 480, 300, 530, 480, 620, 650, 700, 720, 760, 780, 820, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420, 180, 300, 350, 400, 200, 220, 240, 260, 280, 320, 340, 360, 380, 400, 420],
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

    enrolledStudents: {
        total: [
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
    coachesDemographics: {
        revenue: [
            { label: "Acton", value: 2348, percent: 10 },
            { label: "Acton", value: 1800, percent: 10 },
            { label: "Acton", value: 1650, percent: 10 },
            { label: "Acton", value: 1500, percent: 10 },
            { label: "Acton", value: 1300, percent: 10 },
            { label: "Acton", value: 1200, percent: 10 },
            { label: "Acton", value: 1100, percent: 10 },
            { label: "Acton", value: 900, percent: 10 },
            { label: "Acton", value: 700, percent: 10 },
            { label: "Acton", value: 400, percent: 10 },
        ],
        growth: [
            { label: "Acton", value: 1300, percent: 10 },
            { label: "Acton", value: 1200, percent: 10 },
            { label: "Acton", value: 1100, percent: 10 },
            { label: "Acton", value: 900, percent: 10 },
            { label: "Acton", value: 700, percent: 10 },
            { label: "Acton", value: 400, percent: 10 },
        ],
    },

    qualifications: [
        { label: "FA Qualification(s)", value: 3, img: '/reportsIcons/fa.png' },
        { label: "DBS Certificate", value: 2, img: '/reportsIcons/dbs.png' },
        { label: "4-5 years of coaching experience", value: 4, img: '/reportsIcons/coaching.png' },
        { label: "Management Experience", value: 3, img: '/reportsIcons/manage.png' },
    ],

    onboardingResults: [
        { label: "Average Interview Grade", value: "82%" },
        { label: "Average Practical Assessment Grade", value: "67%" },
        { label: "Average Coach Education Pass Mark", value: "79%" },
    ],

    topAgents: [
        { label: "Jessica Smith", value: 50 },
        { label: "Aiden Jones", value: 30 },
        { label: "Priya Kumar", value: 20 },
        { label: "Liam Brown", value: 10 },
        { label: "Mia White", value: 5 },
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
        icon: "/demo/synco/reportsIcons/pound.png",
        iconStyle: "text-[#3DAFDB] bg-[#FEF6FB]",
        title: "Total Revenue",
        value: ` 150`,
        sub: "vs. prev period  ",
        subvalue: '275'
    },
    {
        icon: "/demo/synco/reportsIcons/pound2.png",
        iconStyle: "text-[#E769BD] bg-[#FEF8F4]",
        title: "Average Revenue Per Camp",
        value: `87`,
        diff: "+33%",
        sub: "vs. prev period",
        subvalue: '275'
    },
    {
        icon: "/demo/synco/reportsIcons/chart2.png",
        iconStyle: "text-[#F38B4D] bg-[#F6F6FE]",
        title: "Revenue Growth",
        value: `42`,
        diff: "+33%",
        sub: "vs. prev period ",
        subvalue: '150'
    },

    {
        icon: "/demo/synco/reportsIcons/content.png",
        iconStyle: "text-[#FF5353] bg-[#F6F6FE]",
        title: "Conversion Rate (Leads to recruitment)",
        value: `65%`,
        diff: "",
        sub: "vs. prev period ",
        subvalue: '15%'
    },

];



export default function HolidayReports() {
      const [activeTab, setActiveTab] = useState("revenue");
        const [activeTabEnrolled, setActiveTabEnrolled] = useState("total");
        const [summary, setSummary] = useState({});
        const [monthlyStudents, setMonthlyStudents] = useState([]);
        const [marketPerformance, setMarketPerformance] = useState([]);
        const [topAgents, setTopAgents] = useState([]);
        const [campsRegistration, setCampsRegistration] = useState({});
        const [enrolledStudents, setEnrolledStudents] = useState({});
        const [loading, setLoading] = useState(false);
    
        const token = localStorage.getItem("adminToken");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
        const fetchReports = useCallback(async () => {
            if (!token) return;
            setLoading(true);
    
            try {
                const url = `${API_BASE_URL}/api/admin/holiday/booking/reports`;
    
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP ${response.status}: ${text}`);
                }
    
                const result = await response.json();
                if (!response.status) {
                    Swal.fire({
                        icon: "error",
                        title: "Fetch Failed",
                        text: result.message || "Failed to fetch report data.",
                    });
                    return;
                }
    
                setSummary(result.data.summary || {});
                setMonthlyStudents(result.data.monthlyStudents || []);
                setMarketPerformance(result.data.marketChannelPerformance || []);
                setTopAgents(result.data.topAgents || []);
                setCampsRegistration(result.data.campsRegistration || {});
                setEnrolledStudents(result.data.enrolledStudents || {});
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Fetch Failed",
                    text: error.message,
                });
            } finally {
                setLoading(false);
            }
        }, [API_BASE_URL, token]);
    
        useEffect(() => {
            fetchReports();
        }, [fetchReports]);
    
        // ============================
        // 📌 Dynamic Stats
        // ============================
        const stats = useMemo(() => {
            return [
                {
                    icon: "/demo/synco/reportsIcons/pound.png",
                    iconStyle: "text-[#3DAFDB] bg-[#FEF6FB]",
                    title: "Total Revenue",
                    value: `£${summary?.totalRevenue?.total ?? 0}`,
                    diff: `${summary?.totalRevenue?.percentage ?? 0}%`,
                    sub: "vs. prev period",
                    subvalue: `£${summary?.totalRevenue?.lastMonth ?? 0}`
                },
                {
                    icon: "/demo/synco/reportsIcons/pound2.png",
                    iconStyle: "text-[#E769BD] bg-[#FEF8F4]",
                    title: "Average Revenue Per Camp",
                    value: `£${summary?.averageRevenuePerCamp?.total ?? 0}`,
                    diff: `${summary?.averageRevenuePerCamp?.percentage ?? 0}%`,
                    sub: "vs. prev period",
                    subvalue: `£${summary?.averageRevenuePerCamp?.lastMonth ?? 0}`
                },
                {
                    icon: "/demo/synco/reportsIcons/chart2.png",
                    iconStyle: "text-[#F38B4D] bg-[#F6F6FE]",
                    title: "Revenue Growth",
                    value: `${summary?.revenueGrowth?.percentage ?? 0}%`,
                    diff: "",
                    sub: "vs. prev period",
                    subvalue: `${summary?.revenueGrowth?.lastMonth ?? 0}`
                },
                {
                    icon: "/demo/synco/reportsIcons/content.png",
                    iconStyle: "text-[#FF5353] bg-[#F6F6FE]",
                    title: "Conversion Rate (Leads to recruitment)",
                    value: `${summary?.averageAgeOfChild?.total ?? 0}`,
                    diff: "",
                    sub: "",
                    subvalue: ""
                },
            ];
        }, [summary]);
    
        // ============================
        // 📌 Dynamic Chart Data
        // ============================
        const chartData = useMemo(() => {
            return monthlyStudents?.map((m) => ({
                month: m.month,
                current: m.students,
                previous: m.bookings,
            }));
        }, [monthlyStudents]);
    
        // ============================
        // 📌 Dynamic Enrollment by Age
        // ============================
        const enrolledByAge = useMemo(() => {
            if (!enrolledStudents.byAge) return [];
            return Object.entries(enrolledStudents.byAge).map(([label, obj]) => ({
                label,
                value: obj.total,
                percent: obj.percentage
            }));
        }, [enrolledStudents]);
    
        // ============================
        // 📌 Dynamic Enrollment by Gender
        // ============================
        const enrolledByGender = useMemo(() => {
            if (!enrolledStudents.byGender) return [];
            return Object.entries(enrolledStudents.byGender).map(([label, obj]) => ({
                label,
                value: obj.total,
                percent: obj.percentage
            }));
        }, [enrolledStudents]);
    

    return (
        <div className="min-h-screen bg-gray-50 p-6 pt-0">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Holiday Camps</h1>
                <div className="flex flex-wrap gap-3 items-center">

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

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
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
                            <p className="text-4 font-semibold text-[#717073]">
                                {s.sub} <span className="text-green-500">{s.subvalue}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="md:flex  gap-6">

                <div className="lg:col-span-2 md:w-9/12 space-y-6">

                    <div className="grid  gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-5 rounded-2xl">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-[22px] font-semibold text-gray-800 ms-5">Total Students</h2>
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
                            </div>
                        </div>


                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-2xl">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[22px] font-semibold text-gray-800">Coaches Demographics</h3>
                                <EllipsisVertical className="text-gray-400" />
                            </div>

                            <div className="mb-3">
                                <div className="grid md:grid-cols-2 items-center gap-3 mb-3 border border-[#E2E1E5] p-1 w-full rounded-2xl">
                                    <button
                                        onClick={() => setActiveTab("revenue")}
                                        className={`px-3 py-2 rounded-xl text-sm ${activeTab === "revenue" ? "bg-[#237FEA] text-white" : "text-gray-600"
                                            }`}
                                    >
                                        Revenue
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("growth")}
                                        className={`px-3 py-2 rounded-xl text-sm ${activeTab === "growth" ? "bg-[#237FEA] text-white" : "text-gray-600"
                                            }`}
                                    >
                                        Growth
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
                        </div>
                        <div className="bg-white p-5 rounded-2xl">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[22px] font-semibold text-gray-800">Enrolled Students</h3>
                                <EllipsisVertical className="text-gray-400" />
                            </div>

                             <div className="mb-3">
                                <div className="grid md:grid-cols-3 items-center gap-3 mb-3 border border-[#E2E1E5] p-1 w-full rounded-2xl">
                                    <button onClick={() => setActiveTabEnrolled("total")} className={`px-3 py-2 rounded-xl text-sm ${activeTabEnrolled === "total" ? "bg-[#237FEA] text-white" : "text-gray-600"}`}>
                                        Total
                                    </button>
                                    <button onClick={() => setActiveTabEnrolled("byAge")} className={`px-3 py-2 rounded-xl text-sm ${activeTabEnrolled === "byAge" ? "bg-[#237FEA] text-white" : "text-gray-600"}`}>
                                        By age
                                    </button>
                                    <button onClick={() => setActiveTabEnrolled("byGender")} className={`px-3 py-2 rounded-xl text-sm ${activeTabEnrolled === "byGender" ? "bg-[#237FEA] text-white" : "text-gray-600"}`}>
                                        By gender
                                    </button>
                                </div>

                                {/* TOTAL */}
                                {activeTabEnrolled === "total" && (
                                    <p className="text-lg font-semibold text-gray-700">
                                        Total Students: {enrolledStudents?.total ?? 0}
                                    </p>
                                )}

                                {/* AGE */}
                                {activeTabEnrolled === "byAge" &&
                                    enrolledByAge.map((d, i) => (
                                        <div key={i} className="mb-3 flex items-center gap-2">
                                            <p className="text-sm text-gray-700">{d.label}</p>
                                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                                <div style={{ width: `${d.percent}%` }} className="h-2 rounded-full bg-[#237FEA]"></div>
                                            </div>
                                            <p className="text-sm text-gray-500">{d.percent}%</p>
                                        </div>
                                    ))}

                                {/* GENDER */}
                                {activeTabEnrolled === "byGender" &&
                                    enrolledByGender.map((d, i) => (
                                        <div key={i} className="mb-3 flex items-center gap-2">
                                            <p className="text-sm text-gray-700">{d.label}</p>
                                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                                <div style={{ width: `${d.percent}%` }} className="h-2 rounded-full bg-[#237FEA]"></div>
                                            </div>
                                            <p className="text-sm text-gray-500">{d.percent}%</p>
                                        </div>
                                    ))}
                            </div>
                        </div>




                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-white p-5 rounded-2xl">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[22px] font-semibold text-gray-800">Marketing Channel Performance</h3>
                                <EllipsisVertical className="text-gray-400" />
                            </div>
<div className="space-y-3">
                                {marketPerformance?.map((s, i) => (
                                    <div key={i}>
                                        <p className="text-sm text-gray-700">{s.name}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                                <div className="h-2 rounded-full bg-[#237FEA]" style={{ width: `${s.percentage}%` }}></div>
                                            </div>
                                            <p className="text-sm text-gray-500">{s.percentage}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl">
                            <h3 className="text-[22px] font-semibold text-gray-800 mb-3">Top agents </h3>
                            <div className="space-y-3">
                                {topAgents.map((item, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="flex gap-5 justify-between">
                                            <div className="w-10 h-10">
                                                <img src={item.creator?.profile || "/demo/synco/members/dummyuser.png"} alt="" />
                                            </div>
                                            <div className="w-full">
                                                <p className="text-sm text-[#344054] font-semibold">
                                                    {item.creator?.firstName} {item.creator?.lastName}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                                        <div className="bg-[#237FEA] h-2 rounded-full" style={{ width: `${item.leadCount}%` }}></div>
                                                    </div>
                                                    <span className="text-xs text-[#344054] font-semibold">{item.leadCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                </div>

                <div className="space-y-6 md:grid md:w-3/12 lg:block md:grid-cols-2 gap-3 ">


                    <div className="bg-white p-3 rounded-2xl">
                        <div className="flex justify-between items-center mb-3 px-4">
                            <h3 className="text-[24px] font-semibold text-gray-800 pb-3">Camps Registration</h3>
                            <EllipsisVertical className="text-gray-400" />
                        </div>

                          <div className="space-y-4">
                                <div className="flex gap-4 items-center border-b border-[#E2E1E5] pb-4">
                                    <img src="/demo/synco/reportsIcons/Icon-with-shape.png" className="w-12" alt="" />
                                    <div>
                                        <p className="text-[16px] text-[#717073] font-semibold">Percentage of camp capacity filled</p>
                                        <h4 className="text-[22px] font-semibold my-1">
                                            {campsRegistration?.percentFilled ?? "0%"}
                                        </h4>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center pb-4">
                                    <img src="/demo/synco/reportsIcons/capacity1.png" className="w-12" alt="" />
                                    <div>
                                        <p className="text-[16px] text-[#717073] font-semibold">Untapped business</p>
                                        <h4 className="text-[22px] font-semibold my-1">
                                            £{campsRegistration?.untappedBusiness ?? 0}
                                        </h4>
                                    </div>
                                </div>

                            </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl">
                        <div className="flex justify-between items-center mb-3 px-4">
                            <h3 className="text-[24px] font-semibold text-gray-800 pb-3">Early Bird Offer</h3>
                            <EllipsisVertical className="text-gray-400" />
                        </div>

                        <div className="space-y-4 px-4">
                            <div className="flex gap-4 items-center border-b border-[#E2E1E5] pb-4">

                                <img src="/demo/synco/reportsIcons/logout.png" className="w-12" alt="" />
                                <div>
                                    <p className="text-[16px] text-[#717073] font-semibold ">Number of registration</p>
                                    <div className="">
                                        <h4 className="text-[22px] font-semibold my-1">85%</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center border-b border-[#E2E1E5] pb-4">
                                <img src="/demo/synco/reportsIcons/percentage.png" className="w-12" alt="" />
                                <div>
                                    <p className="text-[16px] text-[#717073] font-semibold ">Percentage</p>
                                    <div className="">
                                        <h4 className="text-[22px] font-semibold my-1">12%</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center pb-4">
                                <img src="/demo/synco/reportsIcons/poundIcon.png" className="w-12" alt="" />

                                <div>
                                    <p className="text-[16px] text-[#717073] font-semibold ">Revenue Impact</p>
                                    <div className="">
                                        <h4 className="text-[22px] font-semibold my-1">£12.569</h4>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>





                </div>
            </div>
        </div>
    );
}
