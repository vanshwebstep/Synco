import React, { useState } from "react";
import { Check } from "lucide-react";
import { TiUserAdd } from "react-icons/ti";
import { Plus } from "lucide-react";
import {
    Search,
    Mail,
    MessageSquare,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const All = () => {

    const summaryCards = [
        { icon: "/reportsIcons/user-group.png", iconStyle: "text-[#3DAFDB] bg-[#E6F7FB]", title: "Total Applications", value: 945, change: "(+28.14%)" },
        { icon: "/reportsIcons/greenuser.png", iconStyle: "text-[#099699] bg-[#E0F7F7]", title: "New Applications", value: 945, change: "(+28.14%)" },
        { icon: "/reportsIcons/login-icon-orange.png", iconStyle: "text-[#F38B4D] bg-[#FFF2E8]", title: "Applications to assessments", value: 945, change: "(+28.14%)" },
        { icon: "/reportsIcons/handshake.png", iconStyle: "text-[#6F65F1] bg-[#E9E8FF]", title: "Applications to recruitment", value: 343 },
    ];
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // Add ID to each coach
    const coaches = [
        {
            id: 1,
            name: "Tom Jones",
            age: 25,
            postcode: "W14 9EB",
            telephone: "12344567",
            email: "tom.john@gmail.com",
            experience: "2 years",
            faLevel1: true,
            dbs: false,
            status: "Pending",
        },
        {
            id: 2,
            name: "Tom Jones",
            age: 25,
            postcode: "W14 9EB",
            telephone: "12344567",
            email: "tom.john@gmail.com",
            experience: "2 years",
            faLevel1: false,
            dbs: false,
            status: "Rejected",
        },
        {
            id: 3,
            name: "Tom Jones",
            age: 25,
            postcode: "W14 9EB",
            telephone: "12344567",
            email: "tom.john@gmail.com",
            experience: "2 years",
            faLevel1: true,
            dbs: true,
            status: "Recruited",
        },
        // ... (rest unchanged)
    ];

    // Checkbox state
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleCheckbox = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };



    // for fiters 
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [studentName, setStudentName] = useState("");
    const [venueName, setVenueName] = useState("");
    const [checkedStatuses, setCheckedStatuses] = useState({
        Pending: false,
        Recruited: false,
        "0-3 Years Exp": false,
        Rejected: false,
        'FA Level 1': false,
        '3+ Years Exp': false,
    });

    const handleInputChange = (e) => {
        setStudentName(e.target.value);
    };

    const handleVenueChange = (e) => {
        setVenueName(e.target.value);
    };

    const handleCheckboxChange = (key) => {
        setCheckedStatuses((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // 🔹 Calendar helpers
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const getDaysArray = () => {
        const startDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        const offset = startDay === 0 ? 6 : startDay - 1;

        for (let i = 0; i < offset; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
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

    };
    return (
        <div className="flex gap-5">
            <div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryCards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-200"
                        >
                            <div className={`p-2 h-[50px] w-[50px] rounded-full ${card.iconStyle} bg-opacity-10 flex items-center justify-center`}>
                                <img src={card.icon} alt="" className="p-1" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{card.title}</p>

                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-semibold">{card.value}</h3>
                                    {card.change && (
                                        <p className="text-green-600 text-xs">{card.change}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coaches Table */}

                <div className="flex justify-between items-center p-4 mt-3">
                    <h2 className="font-semibold text-2xl">Coach Applications</h2>
                    <div className="flex gap-4 items-center">
                        <button className="bg-white border border-[#E2E1E5] rounded-full flex justify-center items-center h-10 w-10"><TiUserAdd className="text-xl" /></button>
                        <button onClick={() => setIsOpen(true)}
                            className="flex items-center gap-2 bg-[#237FEA] text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <Plus size={16} />
                            Add new lead
                        </button>
                        {coaches.length == 0 && (
                            <button onClick={() => {

                            }}
                                className="flex items-center gap-2 bg-[#ccc] text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-500 transition">

                                Reset Filters
                            </button>

                        )}
                    </div>
                </div>
                <div className="mt-3 overflow-auto rounded-3xl bg-white ">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
                            <tr className="font-semibold text-[#717073]">
                                <th className="py-3 px-4 font-semibold">Name</th>
                                <th className="py-3 px-4 font-semibold">Age</th>
                                <th className="py-3 px-4 font-semibold">PostCode</th>
                                <th className="py-3 px-4 font-semibold">Telephone</th>
                                <th className="py-3 px-4 font-semibold">Email</th>
                                <th className="py-3 px-4 font-semibold">Experience</th>
                                <th className="py-3 px-4 font-semibold">FA Level 1</th>
                                <th className="py-3 px-4 font-semibold">DBS</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {coaches.map((coach) => {
                                const isChecked = selectedIds.includes(coach.id);

                                return (
                                    <tr onClick={() => navigate(`/recruitment/lead/coach/profile?id=${coach?.id}`)} key={coach.id} className="border-b cursor-pointer border-gray-200">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleCheckbox(coach.id);
                                                    }}
                                                    className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${isChecked ? "border-gray-500" : "border-gray-300"
                                                        }`}
                                                >
                                                    {isChecked && (
                                                        <Check size={16} strokeWidth={3} className="text-gray-500" />
                                                    )}
                                                </button>

                                                {coach.name}
                                            </div>
                                        </td>

                                        <td className="p-4">{coach.age}</td>
                                        <td className="p-4">{coach.postcode}</td>
                                        <td className="p-4">{coach.telephone}</td>
                                        <td className="p-4">{coach.email}</td>
                                        <td className="p-4">{coach.experience}</td>

                                        <td className="p-4">
                                            {coach.faLevel1 ? (
                                                <span className="text-green-600 font-bold"><img src="/reportsIcons/greenCheck.png" alt="" className="w-6" /></span>
                                            ) : (
                                                <span className="text-red-500 font-bold"><img src="/reportsIcons/cross.png" alt="" className="w-6" /></span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            {coach.dbs ? (
                                                <span className="text-green-600 font-bold"><img src="/reportsIcons/greenCheck.png" className="w-6" alt="" /></span>
                                            ) : (
                                                <span className="text-red-500 font-bold"><img src="/reportsIcons/cross.png" className="w-6" alt="" /></span>
                                            )}
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-md text-xs font-medium
                        ${coach.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : coach.status === "Recruited"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {coach.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>

            <div className="md:w-[30%]  fullwidth20 flex-shrink-0 gap-5 md:ps-3">
                {/* Search */}
                <div className="mb-4 bg-white rounded-2xl p-4">
                    <h3 className="font-semibold text-black text-[24px] mb-4">
                        Search now
                    </h3>

                    <label className="text-[16px] font-semibold text-[#282829]">Search Candidate</label>
                    <div className="relative mt-1">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={studentName}
                            onChange={handleInputChange}
                            placeholder="Search by Candidate name"
                            className="pl-9 pr-3 py-3 w-full border border-[#E2E1E5] rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <label className="text-[16px] font-semibold mt-2 block">Venue(s)</label>
                    <div className="relative mt-1">
                        <select
                            value={venueName}
                            onChange={handleVenueChange}
                            className="p-3 py-3 w-full border border-[#E2E1E5] rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Choose Venue</option>
                            <option value="Venue A">Venue A</option>
                            <option value="Venue B">Venue B</option>
                        </select>
                    </div>
                </div>

                {/* Filter by Date */}
                <div className="bg-white p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-black text-[24px]">
                            Filter by date
                        </h3>
                        <button
                            onClick={applyFilter}
                            className="px-5 mt-4 bg-[#237FEA] hover:bg-blue-700 text-white flex gap-2 items-center text-[16px] py-3 rounded-2xl transition"
                        >
                            <img
                                src="/reportsIcons/filter.png"
                                className="w-4"
                                alt=""
                            />
                            Apply Filter
                        </button>
                    </div>

                    {/* Status Checkboxes */}
                    <div className="p-4 bg-[#FAFAFA] rounded-xl mb-4 mt-4">
                        <p className="text-[17px] font-semibold mb-2 text-black">Choose Type</p>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(checkedStatuses).map((key) => {
                                const label = key; // in case you want to rename display later
                                return (
                                    <label
                                        key={key}
                                        className="flex items-center w-full  text-[16px] font-semibold gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="peer hidden"
                                            checked={checkedStatuses[key]}
                                            onChange={() => handleCheckboxChange(key)}
                                        />
                                        <span className="w-4 h-4 inline-flex text-gray-500 items-center justify-center border border-[#717073] rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                                            <Check className="w-4 h-4 transition-all" strokeWidth={3} />
                                        </span>
                                        <span className="text-[16px]">{key}</span>
                                    </label>
                                );
                            })}
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
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, indx) => (
                                <div key={indx} className="font-medium text-center">
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

                {/* Actions */}
                <div className="grid blockButton md:grid-cols-3 gap-3 mt-4">
                    <button className="flex-1 flex items-center justify-center text-[#717073] gap-1 border border-[#717073] rounded-lg py-3 text-sm hover:bg-gray-50">
                        <Mail size={16} className="text-[#717073]" /> Send Email
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 border text-[#717073] border-[#717073] rounded-lg py-3 text-sm hover:bg-gray-50">
                        <MessageSquare size={16} className="text-[#717073]" /> Send Text
                    </button>
                    <button className="flex items-center justify-center gap-1 bg-[#237FEA] text-white text-sm py-3 rounded-lg hover:bg-blue-700 transition">
                        <Download size={16} /> Export Data
                    </button>
                </div>
            </div>

        </div>
    );
};

export default All;
