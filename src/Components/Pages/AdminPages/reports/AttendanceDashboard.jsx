import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
    Users,
    CalendarDays,
    CalendarCheck,
    UserCheck,
    BarChart3,
    Download,
    EllipsisVertical,
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
    CartesianGrid,
} from "recharts";
import Loader from "../contexts/Loader";

const AttendanceDashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [activeTab, setActiveTab] = useState("age"); // age | gender
    const [analytics, setAnalytics] = useState(null);
    const [allClasses, setAllClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log('allClasses', allClasses)
    // Select options (use dynamic venues/classes from API when loaded)
    const staticVenueOptions = [
        { value: "all", label: "All venues" },
        { value: "london", label: "London" },
        { value: "manchester", label: "Manchester" },
    ];
    const ageOptionsSelect = [
        { value: "", label: "All Classes" },
        ...allClasses.map(c => ({
            value: c.id,
            label: c.className
        })),
    ];

    const dateOptions = [
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
        { value: "year", label: "This Year" },
    ];

    // custom styles for react-select
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #E2E1E5",
            borderRadius: "0.5rem",
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

    // Fetch analytics
    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/weekly-class/analytics/attendance`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const resultRaw = await response.json();
            // API response structure: { status, message, data: { ... } }
            const result = resultRaw.data || null;
            setAnalytics(result);
            const classes = result.allClasses;
            setAllClasses(classes)
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            setAnalytics(null);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = async (key, value) => {
        const token = localStorage.getItem("adminToken");

        const query = new URLSearchParams({ [key]: value }).toString();
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/weekly-class/analytics/attendance?${query}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const resultRaw = await response.json();
            const url = ``;
            const result = resultRaw.data || null;
            setAnalytics(result);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            setAnalytics(null);
        } finally {
            setLoading(false);
        }

    };

    // Top small cards data (dynamic)
    const topCards = [
        {
            icon: "/reportsIcons/greenuser.png",
            iconStyle: "text-[#3DAFDB] bg-[#F3FAFD]",
            title: "Rate of attendance",
            value:
                analytics?.rateOfAttendance?.thisMonth != null
                    ? String(analytics.rateOfAttendance.thisMonth) + (String(analytics.rateOfAttendance.thisMonth).includes("%") ? "" : "%")
                    : "-",
            change: analytics?.rateOfAttendance?.change || "-",
        },
        {
            icon: "/reportsIcons/venue.png",
            iconStyle: "text-[#3DAFDB] bg-[#F3FAFD]",
            title: "Worst venue attendance",
            value:
                analytics?.worstVenueAttendance?.thisMonth != null
                    ? String(analytics.worstVenueAttendance.thisMonth) + (String(analytics.worstVenueAttendance.thisMonth).includes("%") ? "" : "%")
                    : "-",
            change: analytics?.worstVenueAttendance?.change || "-",
        },
        {
            icon: "/reportsIcons/Calendar.png",
            title: "High venue attendance",
            value:
                analytics?.highVenueAttendance?.thisMonth != null
                    ? String(analytics.highVenueAttendance.thisMonth) + (String(analytics.highVenueAttendance.thisMonth).includes("%") ? "" : "%")
                    : "-",
            change: analytics?.highVenueAttendance?.change || "-",
        },

        {
               icon: "/reportsIcons/atgroup.png",
            title: "Attendance growth",
            value:
                analytics?.attendanceGrowth?.thisMonth != null
                    ? String(analytics.attendanceGrowth.thisMonth) + (String(analytics.attendanceGrowth.thisMonth).includes("%") ? "" : "%")
                    : "-",
            change: analytics?.attendanceGrowth?.change || "-",
        },
        // {
        //   icon: <BarChart3 className="text-orange-400" size={22} />,
        //   title: "Conversion Rate lead to Sale",
        //   value: analytics?.conversionRate || "-", // optional field; fallback
        //   change: analytics?.conversionChange || "-",
        // },
    ];
    const exportTopCardsExcel = () => {
        // Prepare formatted export rows
        const exportData = topCards.map((item) => ({
            Title: item.title,
            Value: typeof item.value === "string" ? item.value : String(item.value),
            Change: item.change,
        }));

        // Create worksheet + workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Stats");

        // Convert to excel buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Download file
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "attendance-top-cards.xlsx");
    };
    // Line chart data (monthly attendance rates)
    const lineData =
        analytics?.charts?.monthlyAttendance?.map((m) => ({
            month: m.month,
            attended: Number(m.attended ?? 0),
            total: Number(m.total ?? 0),
            rate: Number(m.rate ?? 0),
        })) || [];

    // For the main area/line we will use 'rate' per month
    const lineChartData =
        lineData.length > 0
            ? lineData.map((d) => ({ month: d.month, rate: d.rate }))
            : [
                { month: "Jan", rate: 0 },
                { month: "Feb", rate: 0 },
                { month: "Mar", rate: 0 },
                { month: "Apr", rate: 0 },
                { month: "May", rate: 0 },
                { month: "Jun", rate: 0 },
                { month: "Jul", rate: 0 },
                { month: "Aug", rate: 0 },
                { month: "Sep", rate: 0 },
                { month: "Oct", rate: 0 },
                { month: "Nov", rate: 0 },
                { month: "Dec", rate: 0 },
            ];

    // Pie data: age and gender
    const agePieData =
        analytics?.charts?.ageRate?.map((a) => ({
            name: a.age,
            value: Number(a.rate ?? 0),
        })) || [];

    const genderPieData =
        analytics?.charts?.genderRate?.map((g) => ({
            name: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
            value: Number(g.rate ?? 0),
        })) || [];

    // Top and worst venues
    const topVenues = analytics?.charts?.topVenues || [];
    const worstVenues = analytics?.charts?.worstVenues || [];

    // Best month
    const bestMonth = analytics?.charts?.bestMonth || null;

    // colors for pies
    const pieColors = ["#8B5CF6", "#FACC15", "#22C55E", "#3B82F6", "#EF4444", "#06B6D4"];

    if (loading) return <Loader />;

    return (
        <div className="lg:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Attendance</h1>
                <div className="flex flex-wrap gap-3 items-center">
                    {/* VENUE SELECT */}
                    <Select
                        options={
                            analytics?.allVenues
                                ? [{ value: "", label: "All venues" }].concat(
                                    analytics.allVenues.map((v) => ({ value: v.id, label: v.name }))
                                )
                                : staticVenueOptions
                        }
                        defaultValue={
                            analytics?.allVenues
                                ? { value: "", label: "All venues" }
                                : staticVenueOptions[0]
                        }
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}
                        className="md:w-40"
                        onChange={(selected) => handleFilterChange("venueId", selected.value)}
                    />

                    {/* AGE SELECT */}
                    <Select
                        options={ageOptionsSelect}
                        defaultValue={ageOptionsSelect[0]}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}
                        className="md:w-40"
                        onChange={(selected) => handleFilterChange("filterByClass", selected.value)}
                    />

                    {/* DATE SELECT */}
                    <Select
                        options={dateOptions}
                        defaultValue={dateOptions[0]}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}
                        className="md:w-40"
                        onChange={(selected) => handleFilterChange("filterType", selected.value)}
                    />

                    <button onClick={exportTopCardsExcel} className="flex items-center gap-2 bg-[#237FEA] text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                        <Download size={16} /> Export data
                    </button>
                </div>

            </div>

            {/* Top metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
                {topCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-4xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
                    >
                        <div>
                            <div className="p-2 h-[50px] w-[50px] rounded-full flex items-center justify-center bg-[#F8FAFC]">
                                <div className={card.iconStyle}><img className="p-1" src={card.icon} alt="" /></div>
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold text-[#717073] text-sm">{card.title}</span>
                            <h3 className="text-[20px] font-semibold text-gray-900">
                                {card.value}{" "}
                                <small className="text-green-500 font-normal text-xs">{card.change}</small>
                            </h3>
                            {/* If you want a subtext you can place it here */}
                        </div>
                    </div>
                ))}
            </div>

            <div className="md:flex gap-6">
                {/* Left/primary column */}
                <div className="md:w-[75%]">
                    {/* Line chart card */}
                    <div className="bg-white rounded-2xl p-4">
                        <h2 className="text-gray-800 font-semibold text-[20px] mb-4">Attendance</h2>

                        <div className="w-full h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={lineChartData}
                                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                                >
                                    {/* Soft grid for modern look */}
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        stroke="#E5E7EB"
                                    />

                                    {/* Clean axes */}
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

                                    {/* Tooltip clean + matches your % format */}
                                    <Tooltip
                                        cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                                        formatter={(value) =>
                                            value != null ? `${value}%` : value
                                        }
                                        contentStyle={{
                                            backgroundColor: "rgba(255,255,255,0.95)",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                        }}
                                    />

                                    {/* Soft gradient under line */}
                                    <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.03} />
                                        </linearGradient>
                                    </defs>

                                    {/* Smooth shaded area */}
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="none"
                                        fill="url(#colorRate)"
                                    />

                                    {/* Main line */}
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                        </div>
                    </div>

                    {/* two columns below line chart */}
                    <div className="grid lg:grid-cols-2 gap-5 mt-7">
                        {/* Top best venues attendance */}
                        <div className="bg-white rounded-2xl p-4 mt-3">
                            <h2 className="text-gray-800 font-semibold mb-3 text-[24px] flex justify-between items-center">
                                Top best venues attendance <EllipsisVertical />
                            </h2>

                            {topVenues && topVenues.length > 0 ? (
                                topVenues.map((item, idx) => (
                                    <div key={idx} className="mb-4">
                                        <div className="flex gap-5 justify-between items-center">
                                            <p className="text-xs max-w-[50px] min-w-[50px] text-[#344054] font-semibold">
                                                {item.venueName}
                                            </p>
                                            <div className="w-full">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                                        <div
                                                            className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Number(item.rate ?? 0)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-[#344054] font-semibold">{Number(item.rate ?? 0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No data available</p>
                            )}
                        </div>

                        {/* Worst venues */}
                        <div className="bg-white rounded-2xl p-4 mt-3">
                            <h2 className="text-gray-800 font-semibold mb-3 text-[24px] flex justify-between items-center">
                                Worst venues attendance <EllipsisVertical />
                            </h2>

                            {worstVenues && worstVenues.length > 0 ? (
                                worstVenues.map((item, idx) => (
                                    <div key={idx} className="mb-4">
                                        <div className="flex gap-5 justify-between items-center">
                                            <p className="text-xs max-w-[50px] min-w-[50px] text-[#344054] font-semibold">
                                                {item.venueName}
                                            </p>
                                            <div className="w-full">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-gray-100 h-2 rounded-full">
                                                        <div
                                                            className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Number(item.rate ?? 0)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-[#344054] font-semibold">{Number(item.rate ?? 0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No data available</p>
                            )}
                        </div>

                        {/* Attendance rate by age - Tabs and bars */}
                        <div className="bg-white rounded-2xl p-4 md:max-h-[500px] overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-gray-800 font-semibold text-[24px]">Attendance rate by age</h2>
                                <EllipsisVertical className="text-gray-500" />
                            </div>

                            {/* Tabs */}
                            <div className="flex border border-[#E2E1E5] rounded-lg p-1 w-full mb-5">
                                <button
                                    onClick={() => setActiveTab("age")}
                                    className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${activeTab === "age" ? "bg-[#237FEA] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    Age
                                </button>
                                <button
                                    onClick={() => setActiveTab("gender")}
                                    className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${activeTab === "gender" ? "bg-[#237FEA] text-white shadow-sm" : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    Gender
                                </button>
                            </div>

                            {/* Chart Bars for active tab */}
                            <div>
                                {activeTab === "age" ? (
                                    agePieData && agePieData.length > 0 ? (
                                        agePieData.map((item, i) => (
                                            <div key={i} className="mb-4">
                                                <div className="flex justify-between gap-3 items-center mb-1">
                                                    <p className="text-xs text-[#344054] font-semibold">{item.name}</p>
                                                    <div className="w-full bg-gray-100 h-2 rounded-full relative">
                                                        <div
                                                            className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${Number(item.value)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 font-medium">{Number(item.value)}%</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No age data available</p>
                                    )
                                ) : genderPieData && genderPieData.length > 0 ? (
                                    genderPieData.map((item, i) => (
                                        <div key={i} className="mb-4">
                                            <div className="flex justify-between gap-3 items-center mb-1">
                                                <p className="text-xs text-[#344054] font-semibold">{item.name}</p>
                                                <div className="w-full bg-gray-100 h-2 rounded-full relative">
                                                    <div
                                                        className="bg-[#237FEA] h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${Number(item.value)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">{Number(item.value)}%</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No gender data available</p>
                                )}
                            </div>
                        </div>

                        {/* Spare: a small container for top/worst lists if needed */}
                    </div>
                </div>

                {/* Right/side column */}
                <div className="md:w-[25%]">
                    <div className="bg-white rounded-2xl p-4 mt-3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-gray-800 font-semibold text-[20px] flex items-center">Attendance trends</h2>
                            <EllipsisVertical />
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <h6 className="text-[16px] font-semibold">Best month attendance</h6>
                                <p className="font-semibold text-[16px] text-[#717073]">
                                    {bestMonth?.month || "—"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {bestMonth ? `${Number(bestMonth.rate ?? 0)}% (${bestMonth.attended}/${bestMonth.total})` : ""}
                                </p>
                            </div>

                            <div className="mt-1">
                                <h2 className="text-[28px] font-semibold">
                                    {analytics?.charts?.bestMonth?.rate != null ? `${analytics.charts.bestMonth.rate}%` : "—"}
                                </h2>
                                <p className="text-xs text-gray-500">Best monthly rate</p>
                            </div>
                        </div>

                        {/* Pie charts for age & gender (compact) */}
                        {/* <div className="mt-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">By Age</h3>
                {agePieData && agePieData.length > 0 ? (
                  <div style={{ width: "100%", height: "120px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agePieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={4}
                          label={() => null}
                        >
                          {agePieData.map((_, i) => (
                            <Cell key={i} fill={pieColors[i % pieColors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No age breakdown</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">By Gender</h3>
                {genderPieData && genderPieData.length > 0 ? (
                  <div style={{ width: "100%", height: "120px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderPieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={4}
                          label={() => null}
                        >
                          {genderPieData.map((_, i) => (
                            <Cell key={i} fill={pieColors[i % pieColors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No gender breakdown</p>
                )}
              </div>
            </div> */}
                    </div>

                    {/* Top venues list */}
                    {/* <div className="bg-white rounded-2xl p-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Top venues</h3>
              <EllipsisVertical />
            </div>

            {topVenues && topVenues.length > 0 ? (
              topVenues.slice(0, 5).map((v, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{v.venueName}</div>
                    <div className="text-xs text-gray-500">{v.attended}/{v.total} attended</div>
                  </div>
                  <div className="text-sm font-semibold">{Number(v.rate ?? 0)}%</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No top venues</p>
            )}
          </div> */}

                    {/* Worst venues list */}
                    {/* <div className="bg-white rounded-2xl p-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Worst venues</h3>
              <EllipsisVertical />
            </div>

            {worstVenues && worstVenues.length > 0 ? (
              worstVenues.slice(0, 5).map((v, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{v.venueName}</div>
                    <div className="text-xs text-gray-500">{v.attended}/{v.total} attended</div>
                  </div>
                  <div className="text-sm font-semibold">{Number(v.rate ?? 0)}%</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No worst venues</p>
            )}
          </div> */}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
