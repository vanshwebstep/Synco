import { useState, useEffect, useCallback } from "react";
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

import {
  Users,
  PoundSterling,
  Calendar,
  Clock,
  UserPlus,
  RotateCcw,
  Download,
  EllipsisVertical,

} from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import { PiUsersThreeBold } from "react-icons/pi";
import {
  Database,
  CirclePercent,
  CirclePoundSterling,
  PackageOpen,
  Box,
  Plus,
} from "lucide-react";

export default function BirthdayReports() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("age");
  const [packageActiveTab, setPackageActiveTab] = useState("revenue");
  const [mainData, setMainData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const filterOptions = [
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "last6Months", label: "Last 6 Months" }
  ];

  /** =====================
   * ✅ Fetch Reports
   * ===================== */
  const fetchReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      // add ?filterType=selectedFilter?.value
      const url = `${API_BASE_URL}/api/admin/birthday-party/analytics${selectedFilter?.value ? `?filterType=${selectedFilter.value}` : ""
        }`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const result = await response.json();
      if (!result.status) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: result.message || "Something went wrong while fetching analytics data.",
        });
        return;
      }

      setData(result);
      setSummary(result.summary || {});
      setCharts(result.charts || {});
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token, selectedFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /** =====================
   * ✅ Stat Cards
   * ===================== */
useEffect(() => {
  const enrolledData = charts?.packageBackground || [];
  let formatted = [];

  if (packageActiveTab === "revenue") {
    const totals = enrolledData?.[0]?.revenue || [];
    formatted = totals.map(v => ({
      label: v.name,
      value: v.percentage,
      count: v.count,
    }));
  } 
  else if (packageActiveTab === "growth") {
    const totals = enrolledData?.[1]?.growth || [];
    formatted = totals.map(v => ({
      label: v.name,
      value: v.percentage,
      count: v.count,
    }));
  }

  setPackageData(formatted);
}, [packageActiveTab, charts]);



  useEffect(() => {
    const enrolledData = charts?.partyBooking?.[0] || {};

    let formatted = [];

    if (activeTab === "total") {
      const totals = enrolledData.byTotal || [];
      formatted = totals.map(v => ({
        label: v.name,
        value: v.percentage,
        count: v.count,
      }));
    }
    else if (activeTab === "age") {
      const totals = enrolledData.byAge || [];
      formatted = totals.map(v => ({
        label: v.name,
        value: v.percentage,
        count: v.count,
      }));
    }
    else if (activeTab === "venue") {
      const totals = enrolledData.byVenue || [];
      formatted = totals.map(v => ({
        label: v.name,
        value: v.percentage,
        count: v.count,
      }));
    }
    else {
      const totals = enrolledData.byGender || [];
      formatted = totals.map(v => ({
        label: v.name,
        value: v.percentage,
        count: v.count,
      }));
    }

    setMainData(formatted);
  }, [activeTab, charts]);


  /** =====================
   * ✅ Chart Data
   * ===================== */
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonthName = currentDate.toLocaleString("default", { month: "long" });

  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Step 1: Convert API data to dictionary for easy merge
  const existingData = {};
  (charts?.monthlyStudents || []).forEach(d => {
    existingData[d.month] = d.students;
  });

  // Step 2: Add current month if missing
  if (charts?.thisMonth && !existingData[currentMonthName]) {
    existingData[currentMonthName] = charts.thisMonth.students;
  }

  // Step 3: Build final data (past + current + future)
  const lineData = allMonths.map((month, index) => {
    return {
      month,
      students:
        index <= currentMonthIndex
          ? existingData[month] ?? 0  // past months with 0 if no data
          : null                     // future months unknown = null
    };
  });

  const marketingData =
    charts?.marketChannelPerformance?.map((m) => ({
      name: m.name,
      percentage: m.percentage?.toFixed(1) ?? 0,
      percentText: `${m.percentage?.toFixed(1) ?? 0}%`,
      value: m.count ?? 0,
    })) || [];

  const topAgents =
    charts?.topAgents?.map((a) => ({
      name: `${a.creator.firstName} ${a.creator.lastName}`,
      value: a.leadCount,
      avatar: a.creator.firstName[0],
    })) || [];

  const pieData = charts?.packageBreakdown || [];
  const renewalData = charts?.renewalBreakdown || [];
  const revenueByPackage = charts?.revenueByPackage || [];

  const COLORS = ["#7C3AED", "#FBBF24", "#60A5FA", "#10B981"];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "10px",
      borderColor: "#ddd",
    }),
  };

  /** =====================
   * ✅ Data Export
   * ===================== */
  const goldData = revenueByPackage.find(pkg => pkg.name === "Gold");
  const silverData = revenueByPackage.find(pkg => pkg.name === "Silver");

  const statCards = [
    {
      icon: PiUsersThreeBold,
      iconStyle: "text-[#3DAFDB]",
      title: "Total Leads",
      value: summary?.totalLeads?.thisMonth ?? 0,
      sub: `Last month: ${summary?.totalLeads?.previousMonth ?? 0}`,
    },
    {
      icon: Database,
      iconStyle: "text-[#6F65F1]",
      title: "Number of Sales",
      value: summary?.numberOfSales?.thisMonth ?? 0,
      sub: `Last month: ${summary?.numberOfSales?.previousMonth ?? 0}`,
    },
    {
      icon: CirclePercent,
      iconStyle: "text-[#34AE56]",
      title: "Conversion Rate",
      value: summary?.conversionRate?.thisMonth ?? "0%",
      sub: `Last month: ${summary?.conversionRate?.previousMonth ?? "0%"}`,
    },
    {
      icon: CirclePoundSterling,
      iconStyle: "text-[#E769BD]",
      title: "Revenue Generated",
      value: summary?.revenueGenerated?.thisMonth ?? "£0",
      sub: `Last month: ${summary?.revenueGenerated?.previousMonth ?? "£0"}`,
    },
    {
      icon: PackageOpen,
      iconStyle: "text-[#099699]",
      title: "Revenue Gold Package",
      value: `£${goldData?.currentRevenue?.toLocaleString() ?? 0}`,
      sub: `vs. previous £${goldData?.lastRevenue?.toLocaleString() ?? 0}`,
    },
    {
      icon: Box,
      iconStyle: "text-[#F38B4D]",
      title: "Revenue Silver Package",
      value: `£${silverData?.currentRevenue?.toLocaleString() ?? 0}`,
      sub: `vs. previous £${silverData?.lastRevenue?.toLocaleString() ?? 0}`,
    },
  ];
  const handleExportData = (type = "excel") => {
    try {
      const exportRows = [
        { Metric: "Total Leads", Value: summary?.totalLeads?.thisMonth ?? 0 },
        { Metric: "Number of Sales", Value: summary?.numberOfSales?.thisMonth ?? 0 },
        { Metric: "Conversion Rate", Value: summary?.conversionRate?.thisMonth ?? 0 },
        { Metric: "Renewal Rate", Value: summary?.renewalRate?.thisMonth ?? 0 },
        { Metric: "Revenue", Value: summary?.revenue?.thisMonth ?? 0 },
      ];

      if (["excel", "csv"].includes(type)) {
        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Analytics");

        const fileType = type === "excel" ? "xlsx" : "csv";
        const fileData = XLSX.write(wb, { bookType: fileType, type: "array" });

        const blob = new Blob([fileData], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(blob, `OneToOne_Analytics_${new Date().toISOString().split("T")[0]}.${fileType}`);
      }

      if (type === "pdf") {
        const doc = new jsPDF();
        doc.text("One-to-One Analytics Summary", 14, 20);

        const pdfTable = [
          ["Metric", "Value"],
          ...exportRows.map((r) => [r.Metric, String(r.Value)]),
        ];

        doc.autoTable({
          startY: 30,
          head: [pdfTable[0]],
          body: pdfTable.slice(1),
        });

        doc.save(`OneToOne_Analytics_${new Date().toISOString().split("T")[0]}.pdf`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: error.message || "Something went wrong during export.",
      });
    }
  };

  /** =====================
   * ✅ UI Layout
   * ===================== */
  return (
    <div className="">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Birthday Party</h1>
          <div className="flex items-center space-x-3">
            <Select
              value={selectedFilter}
              onChange={(value) => {
                setSelectedFilter(value);
                fetchReports(); // call API immediately when changed (optional)
              }}
              options={filterOptions}
              styles={customStyles}
              classNamePrefix="react-select"
              isSearchable={false}
              isClearable={true} // ✅ enables remove/clear
              placeholder="Select duration"
            />
            <button
              onClick={() => handleExportData("excel")}
              className="bg-[#237FEA] flex items-center gap-2 text-white px-4 py-2 rounded-lg shadow"
            >
              <Plus size={16} /> Export data
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white flex items-center gap-3 rounded-[20px] p-4 shadow-sm"
              >
                <div
                  className={`p-2 h-[50px] w-[50px] rounded-full flex items-center justify-center ${s.iconStyle} bg-opacity-10`}
                >
                  <Icon size={24} className={s.iconStyle} />
                </div>
                <div>
                  <div className="text-[14px] text-[#717073] font-semibold">{s.title}</div>
                  <div className="text-[20px] text-black font-semibold">{s.value}</div>
                  <div className="text-[12px] text-[#717073] font-semibold">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts + Insights Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column */}
          <div className="space-y-6 md:w-[75%] md:pe-6">
            {/* Students Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-[24px] mb-4">One to One Students</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={lineData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="10%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="90%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      horizontal={true}
                      vertical={false}   // ❗ hide vertical lines
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      scale="band"
                      domain={['dataMin', 'dataMax']}
                      interval={0}
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      padding={{ left: 10, right: 10 }}
                      allowDuplicatedCategory={false}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                      }}
                      labelStyle={{ fontWeight: 600 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="transparent"
                      fill="url(#colorStudents)"
                      fillOpacity={1}
                    />

                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{ r: 0 }}
                      activeDot={{ r: 4 }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>


              </div>
            </div>

            {/* Marketing + Top Agents */}
            <div className="md:grid grid-cols-2 gap-6">
              {/* Marketing */}
              <div>

                <div className="bg-white rounded-2xl p-4 md:max-h-[500px] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-gray-800 font-semibold text-[24px]">
                      Package Background
                    </h2>
                    <EllipsisVertical className="text-gray-500" />
                  </div>

                  {/* Tabs */}
                  <div className="flex border border-[#E2E1E5] rounded-lg p-1 w-full mb-5">
                    <button
                      onClick={() => setPackageActiveTab("revenue")}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${packageActiveTab === "revenue"
                        ? "bg-[#237FEA] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setPackageActiveTab("growth")}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${packageActiveTab === "growth"
                        ? "bg-[#237FEA] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                      Growth
                    </button>
                  </div>

                  {/* Chart Bars */}
                  <div>
                    {packageData.map((item, i) => (
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
                           
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 mt-5 rounded-2xl shadow-sm">
                  <h3 className="font-semibold mb-4">Marketing Channel Performance</h3>
                  <div className="space-y-4">
                    {marketingData.map((m, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="text-slate-600">{m.name}</div>
                          <div className="text-slate-400">{m.percentText}</div>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <div
                            className="h-3 rounded-full bg-blue-500"
                            style={{ width: `${m.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
              <div>
                <div className="bg-white rounded-2xl p-4 md:max-h-[500px] overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-gray-800 font-semibold text-[24px]">
                      Party Booking
                    </h2>
                    <EllipsisVertical className="text-gray-500" />
                  </div>

                  {/* Tabs */}
                  <div className="flex border border-[#E2E1E5] rounded-lg p-1 w-full mb-5">
                    <button
                      onClick={() => setActiveTab("total")}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${activeTab === "total"
                        ? "bg-[#237FEA] text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                      By Total
                    </button>
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
                <div className="bg-white p-5 mt-5 rounded-2xl shadow-sm">
                  <h3 className="font-semibold mb-4">Top Agents</h3>
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
                            <div
                              className="h-2 rounded-full bg-blue-400"
                              style={{ width: `${(a.value / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Top Agents */}
            </div>
          </div>

          {/* Right column */}
          <div className="md:w-[25%] space-y-6">
            {/* Package Breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Package Breakdown</h3>
              <div className="h-60">
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
              <div className="flex justify-between text-sm mt-2">
                {pieData.map((p, idx) => (
                  <div key={idx}>
                    <div className="text-slate-500">{p.name} Package</div>
                    <div className="font-semibold">{p.percentage ?? 0}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Renewal Breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Renewal Breakdown</h3>
              {renewalData.map((r, idx) => (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <div>{r.name}</div>
                    <div>{r.percentage ?? 0}%</div>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-blue-500 rounded-full"
                      style={{ width: `${100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue by Package */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Revenue by Package</h3>
              <div className="space-y-3">
                {revenueByPackage.map((pkg, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-slate-500">{pkg.name}</div>
                        <div className="font-semibold">£{pkg.currentRevenue}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Revenue Growth</div>
                        <div className="font-semibold text-sm">{pkg.revenueGrowth}%</div>
                        <div
                          className={`text-xs ${pkg.revenueGrowth < 0 ? "text-red-500" : "text-green-500"
                            }`}
                        >
                          vs last month £{pkg.lastRevenue}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
