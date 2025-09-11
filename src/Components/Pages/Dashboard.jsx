import React, { useEffect, useState } from "react";

import { Search, Bell, ChevronUp } from 'lucide-react';
import { CalendarDays, Check, Users, ShoppingCart, LineChart, Star, AlertCircle, BarChart, Smile, Briefcase, Calendar, Plus } from "lucide-react";
import { Circle, MoreHorizontal } from 'lucide-react';
import { Sliders } from 'lucide-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AlertOctagon } from 'lucide-react';
import { useMembers } from './AdminPages/contexts/MemberContext';
import CountUp from "react-countup";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Loader from "./AdminPages/contexts/Loader";



const Dashboard = () => {
  const { fetchDashboard, dashboardData, loading } = useMembers();
  const [hasChanges, setHasChanges] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");
;

  const [adminInfo, setAdminInfo] = useState({ firstName: "", lastName: "", role: "", profile: "" });

  useEffect(() => {
    // ✅ Load adminInfo from localStorage
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdminInfo(parsedAdmin);
      } catch (e) {
        console.error("Invalid adminInfo JSON in localStorage:", e);
      }
    }
  }, []);
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);
  const [reorderMode, setReorderMode] = useState(false);

  console.log('dashboardData', dashboardData)
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    if (dashboardData && dashboardData.length > 0) {
      setOriginalData(dashboardData);
    }
  }, [dashboardData]);
  const metricDefinitions = [
    { key: "totalStudents", icon: <img src="/demo/synco/DashboardIcons/user-group.png" alt="Total Students" className="w-6 h-6" />, title: "Total Students", bg: "bg-gray-100" },
    { key: "trialsBooked", icon: <img src="/demo/synco/DashboardIcons/calendar-03.png" alt="Trials Booked" className="w-6 h-6" />, title: "Trials Booked", bg: "bg-pink-100" },
    { key: "cancellations", icon: <img src="/demo/synco/DashboardIcons/cancel-02.png" alt="Cancellations" className="w-6 h-6" />, title: "Cancellations", bg: "bg-red-100", showIcons: true },
    { key: "Revenue", icon: <img src="/demo/synco/DashboardIcons/dollar-circle.png" alt="Revenue" className="w-6 h-6" />, title: "Revenue", bg: "bg-rose-100" },
    { key: "classCapacity", icon: <img src="/demo/synco/DashboardIcons/chart.png" alt="Capacity" className="w-6 h-6" />, title: "Capacity", bg: "bg-yellow-100" },
    { key: "Growth", icon: <img src="/demo/synco/DashboardIcons/user-add--01.png" alt="Growth" className="w-6 h-6" />, title: "Growth", bg: "bg-orange-100", showIcons: true },
    { key: "customerSatisfaction", icon: <img src="/demo/synco/DashboardIcons/customer-support.png" alt="Customer Satisfaction" className="w-6 h-6" />, title: "Customer Satisfaction", bg: "bg-green-100" },
    { key: "merchandiseSales", icon: <img src="/demo/synco/DashboardIcons/shopping-cart.png" alt="Merchandise Sales" className="w-6 h-6" />, title: "Merchandise Sales", bg: "bg-cyan-100" },
  ];

  const [metricsList, setMetricsList] = useState([]);
  const filterOptions = [
    { label: "This Year", key: "thisyear", apiParam: "period", apiValue: "thisyear" },
    { label: "This Month", key: "thismonth", apiParam: "period", apiValue: "thismonth" },
    { label: "This Week", key: "thisweek", apiParam: "period", apiValue: "thisweek" },
    { label: "Last Year", key: "lastyear", apiParam: "period", apiValue: "lastyear" },
    { label: "Last Month", key: "lastmonth", apiParam: "period", apiValue: "lastmonth" },
    { label: "Last Week", key: "lastweek", apiParam: "period", apiValue: "lastweek" },
  ];

  const [checkedStatuses, setCheckedStatuses] = useState(
    filterOptions.reduce((acc, option) => ({ ...acc, [option.key]: false }), {})
  );
     const handleCheckboxChange = (key) => {
        setCheckedStatuses((prev) => ({ ...prev, [key]: !prev[key] }));
    };
  useEffect(() => {
    if (dashboardData) {
      const updatedMetrics = metricDefinitions
        .filter((metric) => dashboardData.hasOwnProperty(metric.key))
        .map((metric) => ({
          ...metric,
          value: dashboardData[metric.key]?.count ?? 0,
        }));
      setMetricsList(updatedMetrics);
    }
  }, [dashboardData]);

  const handleDragEnd = (result) => {
    if (!result.destination) return; // dropped outside list

    const items = Array.from(metricsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHasChanges(true); // mark that changes exist

    setMetricsList(items);
  };

  const metrics = metricDefinitions.map((metric) => ({
    ...metric,
    value: dashboardData[metric.key]?.count ?? 0, // fallback to 0 if missing
  }));

  console.log("Dynamic Metrics:", metrics);

  const MyRole = localStorage.getItem("role");

  const handleReorder = async () => {
    if (!token) return;

    // Build the payload in the format your API expects
    const payload = metricsList.map((widget, index) => ({
      key: widget.key,
      order: index + 1,
      visible: true, // or handle visibility if you want
    }));

    try {
      await fetch(`${API_BASE_URL}/api/admin/dashboard/widgets`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log("Reordered:", payload);
      setOriginalData(dashboardData); // update original order

      setReorderMode(false); // exit reorder mode after saving
    } catch (err) {
      console.error("Failed to reorder:", err);
    }
  };




  const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const getDaysArray = () => {
    const startDay = new Date(year, month, 1).getDay(); // Sunday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    const offset = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calendarDays = getDaysArray();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setFromDate(null);
    setToDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setFromDate(null);
    setToDate(null);
  };

  const isSameDate = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const isInRange = (date) =>
    fromDate && toDate && date && date >= fromDate && date <= toDate;

  const handleDateClick = (date) => {
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(date);
      setToDate(null);
    } else if (fromDate && !toDate) {
      if (date < fromDate) {
        setFromDate(date);
      } else {
        setToDate(date);
      }
    }
  };
const applyFilter = () => {
  console.log("▶️ applyFilter called");

  // validate custom date range
  const isValidDate = (d) => d instanceof Date && !isNaN(d.valueOf());
  const hasRange = isValidDate(fromDate) && isValidDate(toDate);
  const range = hasRange ? [fromDate, toDate] : [];

  console.log("📅 final range:", range);

  // collect selected filters (can be multiple)
  const selectedFilters = Object.keys(checkedStatuses).filter(
    (key) => checkedStatuses[key]
  );
  console.log("🔎 selectedFilters:", selectedFilters);

  // call fetchDashboard with params
  fetchDashboard({
    studentName: "",
    venueName: "",
    filterTypes: selectedFilters,  // array
    fromDate: hasRange ? fromDate.toISOString().split("T")[0] : null,
    toDate: hasRange ? toDate.toISOString().split("T")[0] : null,
  });
};



  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }
  return (
    <>
      {(MyRole === 'Super Admin' || MyRole === 'franchisee' || MyRole === 'Admin') ? (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 font-sans">
          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            {/* Main Content */}
            <div className="w-full lg:w-8/12">
              {/* Welcome Banner */}
              <div
                className="bg-yellow-300 rounded-3xl p-6 md:py-12 pb-5 flex justify-between items-center text-white relative overflow-hidden 
             md:bg-[url('/demo/synco/images/welcomeToDashboard.png')] bg-none 
             bg-no-repeat bg-left bg-contain"
              >
                <div className="text-center sm:text-end w-full">
                  <h2 className="text-[18px] sm:text-[24px] font-semibold text-black z-10">        {formattedDate}
</h2>
                  <h5 className="text-[22px] sm:text-[28px] font-bold text-black z-10">Welcome to your dashboard, {adminInfo.firstName}</h5>
                </div>
                <div className="absolute inset-0 opacity-80 rounded-xl" />
              </div>

              {/* Scorecard Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-6 gap-3">
                <h2 className="text-[22px] sm:text-[28px] font-semibold">Weekly Classes Scorecards</h2>

                <div className="flex gap-2">
                  {!reorderMode && (
                    <button
                      onClick={() => {
                        setOriginalData(metricsList); // store current order before editing
                        setReorderMode(true);
                      }}
                      className="bg-[#237FEA] text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 font-semibold"
                    >
                      Reorder Your Widgets
                    </button>
                  )}

                  {reorderMode && hasChanges && (
                    <>
                      <button
                        onClick={handleReorder}
                        className="bg-green-600 text-white px-4 py-[10px] rounded-xl hover:bg-green-700 font-semibold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setMetricsList(originalData); // restore original order
                          setReorderMode(false);
                          setHasChanges(false);
                        }}
                        className="bg-red-600 text-white px-4 py-[10px] rounded-xl hover:bg-red-700 font-semibold"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {reorderMode && !hasChanges && (
                    <button
                      onClick={() => {
                        setMetricsList(originalData); // restore original order
                        setReorderMode(false);
                      }}
                      className="bg-red-600 text-white px-4 py-[10px] rounded-xl hover:bg-red-700 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>



              </div>

              {/* Metrics Cards */}
              <div className="">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable
                    droppableId="metrics-droppable" direction="horizontal">
                    {(provided) => (
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {metricsList.map((metric, index) => (
                          <Draggable isDragDisabled={!reorderMode} key={metric.key} draggableId={metric.key} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-xl p-4 shadow-sm ${snapshot.isDragging ? "opacity-70" : ""
                                  }`}
                              >
                                <div className="flex mb-5 justify-between flex-wrap gap-3">
                                  <div className="flex items-center space-x-3">
                                    <div className={`text-3xl p-3 rounded-full ${metric.bg}`}>
                                      {metric.icon}
                                    </div>
                                    <div>
                                      <h3 className="text-[16px] text-gray-700">{metric.title}</h3>
                                      <p className="text-[24px] sm:text-[28px] font-semibold text-gray-900">
                                        {typeof metric.value === "number" ? (
                                          <CountUp
                                            start={0}
                                            end={metric.value}
                                            duration={1.5}
                                            separator=","
                                          />
                                        ) : (
                                          metric.value
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  {(metric.title === "Cancellations" || metric.title === "Growth") && (
                                    <div className="flex justify-end gap-2 items-start">
                                      <img
                                        className="w-6 h-6"
                                        src="/demo/synco/DashboardIcons/Show.png"
                                        alt=""
                                      />
                                      <img
                                        className="w-5 h-5"
                                        src="/demo/synco/DashboardIcons/button.png"
                                        alt=""
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Conversion Section (Last Month / This Week) */}
                                <div className="flex flex-wrap justify-start gap-4 items-end">
                                  <div className="text-xs text-gray-400 mt-2 block">
                                    <span className="font-semibold text-black flex items-center gap-2">
                                      <img
                                        src="/demo/synco/DashboardIcons/orangedot.png"
                                        alt=""
                                      />{" "}
                                      Last Month
                                    </span>
                                    <span
                                      className={`font-semibold p-1 rounded-lg flex justify-center mt-2 ${parseFloat(
                                        dashboardData[metric.key]?.lastMonth?.conversion ?? 0
                                      ) < 0
                                        ? "text-red-500 bg-red-100"
                                        : "text-green-500 bg-green-100"
                                        }`}
                                    >
                                      {dashboardData[metric.key]?.lastMonth?.conversion ?? "0.00%"}{" "}
                                      <img
                                        src={
                                          parseFloat(
                                            dashboardData[metric.key]?.lastMonth?.conversion ?? 0
                                          ) < 0
                                            ? "/demo/synco/images/ArrowFall.png"
                                            : "/demo/synco/images/Arrowtop.png"
                                        }
                                        alt=""
                                      />
                                    </span>
                                  </div>

                                  <div className="text-xs text-gray-400 block">
                                    <span className="font-semibold text-black flex items-center gap-2">
                                      <img
                                        src="/demo/synco/DashboardIcons/greendot.png"
                                        alt=""
                                      />{" "}
                                      This Week
                                    </span>
                                    <span
                                      className={`font-semibold p-1 rounded-lg flex justify-center mt-2 ${parseFloat(
                                        dashboardData[metric.key]?.thisWeek?.conversion ?? 0
                                      ) < 0
                                        ? "text-red-500 bg-red-100"
                                        : "text-green-500 bg-gray-100"
                                        }`}
                                    >
                                      {dashboardData[metric.key]?.thisWeek?.conversion ?? "0.00%"}{" "}
                                      <img
                                        src={
                                          parseFloat(
                                            dashboardData[metric.key]?.thisWeek?.conversion ?? 0
                                          ) < 0
                                            ? "/demo/synco/images/ArrowFall.png"
                                            : "/demo/synco/images/Arrowtop.png"
                                        }
                                        alt=""
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>


              </div>

              <h2 className="text-[28px]  font-bold mt-12 pt-8 border-t  border-gray-200">Other Services Scorecards</h2>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-4/12 space-y-6">
              {/* Filter Panel */}
              <div className="bg-white rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="font-semibold text-[20px] sm:text-[24px]">Filter by date</h3>
                  <button onClick={applyFilter} className="flex gap-2 items-center bg-blue-500 text-white px-3 py-2 rounded-lg text-sm sm:text-[16px]">
                    <img  src='/demo/synco/DashboardIcons/filtericon.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                    Apply fiter
                  </button>
                </div>

                <div className="gap-2 text-sm bg-gray-100 p-4 my-6 rounded">
                  <label className="font-semibold text-[16px] sm:text-[18px] block mb-3">Choose type</label>
                  <div className="flex flex-wrap gap-3">
                   
                    {filterOptions.map(({ label, key }) => (
                      <label key={key} className="flex items-center w-full sm:w-[45%] text-[16px] font-semibold gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="peer hidden"
                          checked={checkedStatuses[key]}
                          onChange={() => handleCheckboxChange(key)}
                        />
                        <span className="w-5 h-5 inline-flex text-gray-500 items-center justify-center border border-[#717073] rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                          <Check className="w-4 h-4 transition-all" strokeWidth={3} />
                        </span>
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="rounded p-4 mt-6 text-center text-base w-full max-w-md mx-auto">
                  {/* Header */}
                  <div className="flex justify-around items-center mb-3">
                    <button
                      onClick={goToPreviousMonth}
                      className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <p className="font-semibold text-[20px]">
                      {currentDate.toLocaleString("default", { month: "long" })} {year}
                    </p>
                    <button
                      onClick={goToNextMonth}
                      className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day Labels */}
                  <div className="grid grid-cols-7 text-xs gap-1 text-[18px] text-gray-500 mb-1">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                      <div key={day} className="font-medium text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Weeks */}
                  <div className="flex flex-col  gap-1">
                    {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                      const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);


                      return (
                        <div
                          key={weekIndex}
                          className="grid grid-cols-7 text-[18px] h-12 py-1  rounded"
                        >
                          {week.map((date, i) => {
                            const isStart = isSameDate(date, fromDate);
                            const isEnd = isSameDate(date, toDate);
                            const isStartOrEnd = isStart || isEnd;
                            const isInBetween = date && isInRange(date);
                            const isExcluded = !date; // replace with your own excluded logic

                            let className =
                              " w-full h-12 aspect-square flex items-center justify-center transition-all duration-200 ";
                            let innerDiv = null;

                            if (!date) {
                              className += "";
                            } else if (isExcluded) {
                              className +=
                                "bg-gray-300 text-white opacity-60 cursor-not-allowed";
                            } else if (isStartOrEnd) {
                              // Outer pill connector background
                              className += ` bg-sky-100 ${isStart ? "rounded-l-full" : ""} ${isEnd ? "rounded-r-full" : ""
                                }`;
                              // Inner circle but with left/right rounding
                              innerDiv = (
                                <div
                                  className={`bg-blue-700 rounded-full text-white w-12 h-12 flex items-center justify-center font-bold
                         
                         `}
                                >
                                  {date.getDate()}
                                </div>
                              );
                            } else if (isInBetween) {
                              // Middle range connector
                              className += "bg-sky-100 text-gray-800";
                            } else {
                              className += "hover:bg-gray-100 text-gray-800";
                            }

                            return (
                              <div
                                key={i}
                                onClick={() => date && !isExcluded && handleDateClick(date)}
                                className={className}
                              >
                                {innerDiv || (date ? date.getDate() : "")}
                              </div>
                            );
                          })}
                        </div>

                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="bg-white rounded-xl p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                  <h3 className="font-semibold text-[20px] sm:text-[24px]">My Tasks</h3>
                  <button className="bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold text-[16px] flex items-center space-x-1">
                    <Plus size={14} />
                    <span>Add New Task</span>
                  </button>
                </div>

                <ul className="text-sm text-gray-600">
                  {[
                    { label: "Meeting", date: "30 Nov 2021", alert: true },
                    { label: "Weekly meeting", date: "24 Nov 2022" },
                    { label: "Add new services", date: "24 Nov 2022" },
                  ].map((task, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[16px] sm:text-[18px] font-semibold border-t py-3 sm:py-4">
                      <div className="block flex-col sm:flex-row items-start sm:items-center gap-2">
                        <p className="flex items-center gap-2">
                          {task.label}
                          {task.alert && (
                            <div className="w-4 h-4 bg-red-500 clip-hexagon flex items-center justify-center text-white font-bold text-xs shrink-0">!</div>
                          )}
                        </p>
                        <p className="text-[14px] text-gray-400">{task.date}</p>
                      </div>
                      <span className="text-[14px] bg-gray-100 mt-2 sm:mt-0 p-2 rounded-lg font-semibold">6:15 PM</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-2 text-[16px] font-semibold text-blue-600 flex items-center">
                  View All <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

      ) : (
        <div className="bg-gray-100 min-h-screen p-6 font-sans">

          <div className="flex flex-col lg:flex-row mt-6 gap-6">
            {/* Main Content */}
            <div className="w-full lg:w-8/12">
              <div
                className="bg-yellow-300 rounded-3xl p-6 md:py-12 pb-5 flex justify-between items-center text-white relative overflow-hidden 
             md:bg-[url('/demo/synco/images/welcomeToDashboard.png')] bg-none 
             bg-no-repeat bg-left bg-contain"
              >

                <div className="md:text-end w-full">
                  <h2 className="md:text-[24px] font-semibold text-black z-10">Monday 3rd June 2025</h2>
                  <h5 className="md:text-[28px] font-bold z-10 text-black">Welcome to your dashboard, USER</h5>
                </div>
                <div className="absolute inset-0 opacity-80 rounded-xl" />
              </div>


              {/* Scorecard Header */}
              <div className="flex justify-between items-center my-6 flex-wrap gap-2">
                <h2 className="text-[28px] font-semibold Gilroy">USER   </h2>
                <button className="text-sm p-2 rounded-lg text-white font-semibold  bg-blue">
                  Reorder Your Widgets
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-4/12 space-y-6">
              {/* Filter Panel */}
              <div className="bg-white rounded-xl p-4 ">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-[24px]">Filter by date</h3>
                  <button onClick={applyFilter} className="flex gap-2 items-center bg-blue-500 text-white p-2 rounded-lg text-[16px]">
                    <img src='/demo/synco/DashboardIcons/filtericon.png' className='w-5 h-5' alt="" />  Apply filter
                  </button>
                </div>


                <div className="gap-2 text-sm bg-gray-100 p-4 my-6 rounded">
                  <label className="font-semibold text-[18px] block mb-3">Choose type</label>
                  <div className="flex flex-wrap gap-3">
                    {["This Year", "This Month", "This Week", "Last Year", "Last Month", "Last Week"].map((label, i) => (
                      <label
                        key={i}
                        className="flex items-center w-[45%] text-[16px] font-semibold gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="peer hidden"
                          id={`checkbox-${i}`}
                        />
                        <span className="w-5 h-5 inline-flex text-gray-500 items-center justify-center border border-gray-400 rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                          <Check
                            className="w-4 h-4   transition-all"
                            strokeWidth={3}
                          />
                        </span>
                        <span className="text-sm text-gray-800">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>


                <div className="rounded p-4 text-center text-sm w-full max-w-md mx-auto">
                  {/* Header */}
                  <div className="flex justify-around items-center mb-3">
                    <button
                      onClick={goToPreviousMonth}
                      className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <p className="font-semibold text-lg">
                      {currentDate.toLocaleString("default", { month: "long" })} {year}
                    </p>
                    <button
                      onClick={goToNextMonth}
                      className="w-8 h-8 rounded-full bg-white text-black hover:bg-black hover:text-white border border-black flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day Labels */}
                  <div className="grid grid-cols-7 text-xs gap-1 text-gray-500 mb-1">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                      <div key={day} className="font-medium text-center">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Weeks */}
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
                      const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);

                      // Check if any date in this week is in range
                      const highlightRow = week.some((date) => isInRange(date));

                      return (
                        <div
                          key={weekIndex}
                          className={`grid grid-cols-7 gap-1 py-1 rounded ${highlightRow ? "bg-sky-100" : ""
                            }`}
                        >
                          {week.map((date, i) => {
                            const isFrom = isSameDate(date, fromDate);
                            const isTo = isSameDate(date, toDate);

                            return (
                              <div
                                key={i}
                                onClick={() => date && handleDateClick(date)}
                                className={`w-8 h-8 flex items-center justify-center mx-auto text-sm rounded-full cursor-pointer
                      ${isFrom || isTo
                                    ? "bg-blue-600 text-white font-bold"
                                    : "text-gray-800"
                                  }
                    `}
                              >
                                {date ? date.getDate() : ""}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>


              </div>


            </div>
          </div>

        </div>

      )}

    </>
  )
}
export default Dashboard