import { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import {
    Users,
    PoundSterling,
    Calendar,
    Clock,
    UserPlus,
    RotateCcw,
    Download,
    EllipsisVertical,
    CalendarDays,
    CalendarCheck,
    UserCheck,
    BarChart3,
    MoreVertical,

} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    CartesianGrid
} from "recharts";
import Loader from "../contexts/Loader";

const TrialsDashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [activeTab, setActiveTab] = useState("age");
    const [membersData, setMembersData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [mainData, setMainData] = useState([]);
    const metrics = [
        {
            icon: <Users className="text-teal-500" size={24} />,
            title: "Leads generated",
            value: 200,
            change: "+100%",
            prev: 1200,
        },
        {
            icon: <CalendarDays className="text-purple-500" size={24} />,
            title: "Trials Booked",
            value: 100,
            change: "+87%",
            prev: 120,
            conversion: "86%",
        },
        {
            icon: <CalendarCheck className="text-sky-500" size={24} />,
            title: "Trials Attended",
            value: 50,
            change: "+87%",
            prev: 42,
            conversion: "50%",
        },
        {
            icon: <UserCheck className="text-pink-400" size={24} />,
            title: "Memberships Sold",
            value: 25,
            change: "+87%",
            prev: 42,
            conversion: "50%",
        },
        {
            icon: <BarChart3 className="text-orange-400" size={24} />,
            title: "Conversion Rate lead to Sale",
            value: "12,5%",
            change: "+87%",
            prev: 42,
        },
    ];


    const venueOptions = [
        { value: "all", label: "All venues" },
        { value: "london", label: "London" },
        { value: "manchester", label: "Manchester" },
    ];
    const data = [
        { label: "Facebook", value: 60 },
        { label: "Website", value: 45 },
        { label: "Other", value: 10 },
    ];
    const ageOptions = [
        { value: "all", label: "All Classes" },
        { value: "under18", label: "Under 18" },
        { value: "18-25", label: "18–25" },
    ];

    const dateOptions = [
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
        { value: "year", label: "This Year" },
    ];

    const stats = [
        {
            icon: "/demo/synco/reportsIcons/user-group.png",
            iconStyle: "text-[#3DAFDB] bg-[#F3FAFD]",
            title: "Free Trials Booked",
            value: "3,200",
            diff: "+12%",
            sub: "vs. prev period ",
            subvalue: '2,900'
        },
        {
            icon: "/demo/synco/reportsIcons/attendent.png",
            iconStyle: "text-[#E769BD] bg-[#F3FAFD]",
            title: "How many attended",
            value: "£67,000",
            diff: "+8%",
            sub: "vs. prev period",
            subvalue: '£57,000'
        },
        {
            icon: "/demo/synco/reportsIcons/Percent.png",
            iconStyle: "text-[#F38B4D] bg-[#F3FAFD]",
            title: "Attendance Rate",
            value: "£43.94",
            diff: "+6%",
            sub: "vs. prev period ",
            subvalue: '£57,000'
        },
        {
            icon: "/demo/synco/reportsIcons/user-group2.png",
            iconStyle: "text-[#6F65F1] bg-[#F3FAFD]",
            title: "Trials to Members",
            value: "18 months",
            diff: "+6%",
            sub: "vs. prev period ",
            subvalue: '16.8 months'
        },
        {
            icon: "/demo/synco/reportsIcons/Chart.png",
            iconStyle: "text-[#FF5353] bg-[#FEF8F4]",
            title: "Conversion Rate",
            value: "82",
            diff: "+3%",
            sub: "vs. prev period ",
            subvalue: '16.8 months'
        },
        {
            icon: "/demo/synco/reportsIcons/calender.png",
            iconStyle: "text-[#FF5353] bg-[#FEF8F4]",
            title: "No. of Rebooks",
            value: "82",
            diff: "+3%",
            sub: "vs. prev period ",
            subvalue: '16.8 months'
        },
    ];

    useEffect(() => {
        const enrolledData =
            membersData?.yealyGrouped?.["2025"]?.monthlyGrouped?.["10"]
                ?.enrolledStudents || {};

        if (activeTab === "age") {
            const byAge = enrolledData.byAge || {};
            const total = Object.values(byAge).reduce((a, b) => a + b, 0);
            const formatted = Object.entries(byAge).map(([age, count]) => ({
                label: `${age} Years`,
                value: ((count / total) * 100).toFixed(2), // percentage
                count,
            }));
            setMainData(formatted);
        } else {
            const byGender = enrolledData.byGender || {};
            const total = Object.values(byGender).reduce((a, b) => a + b, 0);
            const formatted = Object.entries(byGender).map(([gender, count]) => ({
                label: gender.charAt(0).toUpperCase() + gender.slice(1),
                value: ((count / total) * 100).toFixed(2),
                count,
            }));
            setMainData(formatted);
        }
    }, [activeTab, membersData]);


    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/weekly-class/analytics/free-trail`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultRaw = await response.json();
            const result = resultRaw.data || [];
            setMembersData(result);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const lineData = [
        { month: "Jan", current: 380, previous: 300 },
        { month: "Feb", current: 400, previous: 310 },
        { month: "Mar", current: 450, previous: 320 },
        { month: "Apr", current: 500, previous: 100 },
        { month: "May", current: 600, previous: 140 },
        { month: "Jun", current: 580, previous: 360 },
        { month: "Jul", current: 620, previous: 370 },
        { month: "Aug", current: 610, previous: 580 },
        { month: "Sep", current: 630, previous: 390 },
        { month: "Oct", current: 670, previous: 440 },
        { month: "Nov", current: 690, previous: 410 },
        { month: "Dec", current: 1120, previous: 420 },
    ];

    const bookings =
        membersData?.yealyGrouped?.[2025]?.monthlyGrouped?.[10]?.bookings || [];

    // ✅ Group bookings by paymentPlan title
    const planCounts = {};
    bookings.forEach((b) => {
        const planName = b?.paymentPlan?.title || "Unknown Plan";
        planCounts[planName] = (planCounts[planName] || 0) + 1;
    });

    // ✅ Convert to chart format
    const total = Object.values(planCounts).reduce((a, b) => a + b, 0);
    const colors = ["#8B5CF6", "#FACC15", "#22C55E", "#3B82F6", "#EF4444"]; // add more if needed

    const pieData = Object.keys(planCounts).map((name, index) => ({
        name,
        value: Math.round((planCounts[name] / total) * 100), // percentage
        color: colors[index % colors.length],
    }));
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #E2E1E5",
            borderRadius: "0.5rem", // rounded-xl
            boxShadow: state.isFocused ? "0 0 0 1px #237FEA" : "none",
            "&:hover": {
                borderColor: "#237FEA",
            },
            minHeight: "40px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#237FEA"
                : state.isFocused
                    ? "#F3F4F6"
                    : "white",
            color: state.isSelected ? "white" : "#111827",
            cursor: "pointer",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "0.5rem",
            overflow: "hidden",
            zIndex: 50,
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "0 0.75rem",
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            paddingRight: "0.5rem",
        }),
    };


    if (loading) return (<><Loader /></>)

    return (
        <div className="lg:p-6 bg-gray-50 min-h-screen">

            <div className="flex flex-wrap justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Trials and conversions</h1>
                <div className="flex flex-wrap gap-3 items-center">
                    <Select
                        options={venueOptions}
                        defaultValue={venueOptions[0]}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}

                        className="md:w-40"
                    />
                    <Select
                        options={ageOptions}
                        defaultValue={ageOptions[0]}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}

                        className="md:w-40"
                    />
                    <Select
                        components={{ IndicatorSeparator: () => null }}

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

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (


                    <div
                        key={i}
                        className="bg-white rounded-4xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
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

            <div className="md:flex  gap-6">
                <div className="md:w-[75%]">

                    <div className="bg-white rounded-2xl p-4">
                        <h2 className="text-gray-800 font-semibold text-[20px] mb-4">
                            Total Trials
                        </h2>

                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={lineData}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                >

                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />

                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        cursor={false}
                                        contentStyle={{
                                            backgroundColor: "rgba(255,255,255,0.9)",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                    />


                                    <defs>
                                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>


                                    <Area
                                        type="monotone"
                                        dataKey="current"
                                        stroke="none"
                                        fill="url(#colorCurrent)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="previous"
                                        stroke="none"
                                        fill="url(#colorPrevious)"
                                    />


                                    <Line
                                        type="monotone"
                                        dataKey="current"
                                        stroke="#3B82F6"
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="previous"
                                        stroke="#EC4899"
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-5 mt-7">
                        <div className="bg-white rounded-2xl p-4 md:max-h-[500px] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-gray-800 font-semibold text-[24px]">
                                    Enrolled Students
                                </h2>
                                <EllipsisVertical className="text-gray-500" />
                            </div>

                            {/* Tabs */}
                            <div className="flex border border-[#E2E1E5] rounded-lg p-1 w-full mb-5">
                                <button
                                    onClick={() => setActiveTab("age")}
                                    className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${activeTab === "age"
                                        ? "bg-[#237FEA] text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    By Age
                                </button>
                                <button
                                    onClick={() => setActiveTab("gender")}
                                    className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${activeTab === "gender"
                                        ? "bg-[#237FEA] text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    By Gender
                                </button>
                                <button
                                    onClick={() => setActiveTab("venue")}
                                    className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${activeTab === "venue"
                                        ? "bg-[#237FEA] text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    By Venue
                                </button>
                            </div>

                            {/* Chart Bars */}
                            <div>
                                {mainData.map((item, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="flex justify-between gap-3 items-center mb-1">
                                            <p className="text-xs text-[#344054] font-semibold">
                                                {item.label}
                                            </p>
                                            <div className="w-full bg-gray-100 h-2 rounded-full relative">
                                                <div
                                                    className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${item.value}%` }}
                                                ></div>

                                                {/* Example floating label (only for first item) */}
                                                {i === 0 && (
                                                    <div className="absolute -top-6 left-[60%] transform -translate-x-1/2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                                                        {item.count} students
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {item.value}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-gray-800 font-semibold text-[24px]">Membership plans acquired post-trial</h2>
                                <EllipsisVertical className="text-gray-500" />
                            </div>

                            <div className="flex flex-col md:flex-row justify-between md:items-center">

                                <div className="md:w-4/12 w-[180px] h-[180px] mx-auto md:mx-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>


                                <div className="md:w-8/12 mt-6 md:mt-0 md:ml-6 md:max-h-[100px] overflow-auto">
                                    {pieData.map((item, i) => (
                                        <div
                                            key={i}
                                            className="grid md:grid-cols-2 justify-between gap-3 lg:gap-7 items-center mb-2 text-sm text-gray-600"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                ></span>
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-gray-800 font-semibold">
                                                <span>{item.value}%</span>
                                                <span>
                                                    {i === 0
                                                        ? "10,234"
                                                        : i === 1
                                                            ? "1,234"
                                                            : "934"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                                    Revenue Split
                                </h3>

                                <div className="grid md:grid-cols-3 md:justify-between md:max-h-[100px] overflow-auto gap-4 text-sm">
                                    {pieData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            ></span>
                                            <span className="font-medium text-gray-700">
                                                {item.name}
                                                <span className="font-semibold text-gray-900 block">£20,000</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 mt-3">
                            <h2 className="text-gray-800 font-semibold mb-3 text-[24px] flex justify-between items-center">
                                Marketing channel performance <EllipsisVertical />
                            </h2>

                            {data.map((item, i) => (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs text-[#344054] font-semibold">{item.label}</p>

                                    </div>
                                    <div className="flex items-center gap-2">

                                        <div className="w-full bg-gray-100 h-2 rounded-full">
                                            <div
                                                className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${item.value}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-[#344054] font-semibold">{item.value}%</span>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-4 mt-3">
                            <h2 className="text-gray-800 font-semibold mb-3 text-[24px] flex justify-between items-center">
                                Top Agents <EllipsisVertical />
                            </h2>

                            {data.map((item, i) => (
                                <div key={i} className="mb-4">
                                    <div className="flex gap-5 justify-between">

                                        <div className="w-10 h-10">
                                            <img src="/demo/synco/reportsIcons/agent.png" alt="" />
                                        </div>
                                        <div className="w-full">  <div className="flex justify-between items-center mb-1">
                                            <p className="text-xs text-[#344054] font-semibold">{item.label}</p>

                                        </div >
                                            <div className="flex items-center gap-2">

                                                <div className="w-full bg-gray-100 h-2 rounded-full">
                                                    <div
                                                        className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${item.value}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-[#344054] font-semibold">{item.value}%</span>

                                            </div></div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:w-[25%]">
                    <div className="bg-white rounded-2xl p-4 mt-3">

                        <div className="flex justify-between">


                            <h2 className="text-gray-800 font-semibold mb-3 gap-3 text-[20px] flex justify-between items-center">
                                <img src="/demo/synco/reportsIcons/Revenue.png" className="h-7 w-7" alt="" />  Revenue
                            </h2>
                            <EllipsisVertical />
                        </div>

                        <h1 className="text-[48px] font-semibold">£1.123</h1>
                        <p className="font-semibold text-[16px] text-[#717073]">Revenue generated from memberships acquired through free trials.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 mt-3">
                        <div className="flex justify-between">


                            <h2 className="text-gray-800 font-semibold mb-3 gap-3 text-[20px] flex justify-between items-center">
                                <img src="/demo/synco/reportsIcons/Growth.png" className="h-7 w-7" alt="" /> Insights
                            </h2>
                            <EllipsisVertical />

                        </div>

                        <h6 className="text-[18px] font-semibold">Reason for non attendance</h6>
                        <p className="font-semibold text-[16px] text-[#717073]">Time</p>
                        <div className="mt-1"> <h6 className="text-[18px] font-semibold">Reason for not becoming members</h6>
                            <p className="font-semibold text-[16px] text-[#717073]">Time</p></div>
                    </div>


                    <div className="bg-white rounded-2xl p-5 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className=" font-semibold text-lg">Facebook Performance</h2>
                            <MoreVertical className="text-gray-500" size={18} />
                        </div>

                        <div className="space-y-5">
                            {metrics.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-gray-50 p-2 rounded-full">{item.icon}</div>
                                        <div>
                                            <p className="text-[#717073] font-semibold text-[15px]">
                                                {item.title}
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900 flex items-center">
                                                {item.value}
                                                <span className="text-green-500 text-sm font-normal ml-1">
                                                    ({item.change})
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                vs. prev period{" "}
                                                <span className="text-red-500 font-medium">{item.prev}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {item.conversion && (
                                        <div className="text-right">
                                            <p className="text-gray-800 font-semibold">{item.conversion}</p>
                                            <p className="text-green-500 text-sm">(Conversion)</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default TrialsDashboard;
