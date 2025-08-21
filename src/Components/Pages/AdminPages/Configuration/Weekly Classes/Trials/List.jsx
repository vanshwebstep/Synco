import React, { useEffect, useRef, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "react-select";
import { Check, } from "lucide-react";
import { useBookFreeTrial } from '../../../contexts/BookAFreeTrialContext';
import { useNavigate } from "react-router-dom";
import Loader from '../../../contexts/Loader';

const trialLists = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 11));
    const [toDate, setToDate] = useState(null);
    const [checkedStatuses, setCheckedStatuses] = useState({
        attended: false,
        notAttended: false,
        dateBooked: false,
        dateOfTrial: false,
    });

    const [selectedDates, setSelectedDates] = useState([]);
    const handleCheckboxChange = (label) => {
        setCheckedStatuses((prev) => {
            switch (label) {
                case "Attended":
                    return { ...prev, attended: !prev.attended };
                case "Not Attended":
                    return { ...prev, notAttended: !prev.notAttended };
                case "Date Booked":
                    return { ...prev, dateBooked: !prev.dateBooked };
                case "Date of Trial":
                    return { ...prev, dateOfTrial: !prev.dateOfTrial };
                default:
                    return prev;
            }
        });
    };
    // const [selectedDate, setSelectedDate] = useState(null);
    const { fetchBookFreeTrials, bookFreeTrials, setSearchTerm, searchTerm, loading, selectedVenue, setStatus, status, setSelectedVenue, myVenues, setMyVenues } = useBookFreeTrial()

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const navigate = useNavigate();


    useEffect(() => {
        if (selectedVenue) {
            fetchBookFreeTrials("", selectedVenue.label); // Using label as venueName
        } else if (status) {
            fetchBookFreeTrials("", "", status); // Using label as venueName
        } else {
            fetchBookFreeTrials(); // No filter
        }
    }, [selectedVenue, fetchBookFreeTrials]);

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

    const isSameDate = (d1, d2) => {
        if (!d1 || !d2) return false;

        // Ensure both are Date objects
        const date1 = d1 instanceof Date ? d1 : new Date(d1);
        const date2 = d2 instanceof Date ? d2 : new Date(d2);

        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const handleDateClick = (date) => {
        if (!date) return;
        setSelectedDates((prev) => {
            const exists = prev.find((d) => d.getTime() === date.getTime());
            if (exists) return prev.filter((d) => d.getTime() !== date.getTime());
            return [...prev, date];
        });
    };

    const modalRef = useRef(null);
    const PRef = useRef(null);
    const stats = [
        {
            title: "Total Free Trials",
            value: "1920",
            icon: "/demo/synco/DashboardIcons/totalFreeTrials.png", // Replace with actual SVG if needed
            change: "+12%",
            color: "text-green-500",
            bg: "bg-[#F3FAF5]"
        },
        {
            title: "Top performer",
            value: "Abdul Ali",
            subValue: "(456)",
            icon: "/demo/synco/DashboardIcons/topPerformer.png",
            color: "text-green-500",
            bg: "bg-[#F3FAFD]"
        },
        {
            title: "Free Trial Attendance Rate",
            value: "120",
            icon: "/demo/synco/DashboardIcons/freeTrialAttendanceRate.png",
            change: "35%",
            color: "text-green-500",
            bg: "bg-[#FEF6FB]"
        },
        {
            title: "Trials to Members",
            value: "57",
            icon: "/demo/synco/DashboardIcons/trialsToMembers.png",
            change: "45%",
            color: "text-green-500",
            bg: "bg-[#F0F9F9]"
        }
    ];
    const applyFilter = () => {
        const forAttend = checkedStatuses.attended || "";
        const forNotAttend = checkedStatuses.notAttended || "";

        let forDateOkBookingTrial = "";
        let forDateOfTrial = "";
        let forOtherDate = "";

        if (selectedDates.length) {
            const dateBooked = checkedStatuses.dateBooked;
            const dateOfTrial = checkedStatuses.dateOfTrial;

            const bookedDates = [];
            const trialDates = [];
            const otherDates = [];

            selectedDates.forEach((date) => {
                let added = false;

                if (dateBooked) {
                    bookedDates.push(date);
                    added = true;
                }
                if (dateOfTrial) {
                    trialDates.push(date);
                    added = true;
                }
                if (!added) {
                    otherDates.push(date);
                }
            });

            if (bookedDates.length) forDateOkBookingTrial = bookedDates;
            if (trialDates.length) forDateOfTrial = trialDates;
            if (otherDates.length) forOtherDate = otherDates;
        }

        fetchBookFreeTrials(
            "",
            "",
            forAttend,
            forNotAttend,
            forDateOkBookingTrial,
            forDateOfTrial,
            forOtherDate
        );
    };


    const [showPopup, setShowPopup] = useState(false);
    const [tempSelectedAgent, setTempSelectedAgent] = useState(null);
    const [savedAgent, setSavedAgent] = useState(null);
    const popupRef = useRef(null);

    const agents = Array(6).fill({
        name: "Jaffar",
        avatar: "https://i.ibb.co/ZVPd9vJ/jaffar.png", // Replace with real image or asset
    });

    // Close popup if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
                setTempSelectedAgent(savedAgent); // Reset to saved
            }
        };

        if (showPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup, savedAgent]);

    const handleNext = () => {
        setSavedAgent(tempSelectedAgent);
        setShowPopup(false);
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Fetch data with search value (debounce optional)
        fetchBookFreeTrials(value);
    };


    // if (loading) return <Loader />;
    return (
        <div className="pt-1 bg-gray-50 min-h-screen">

            <div className="md:flex w-full gap-4">
                <div className="flex-1 transition-all duration-300">
                    <div className="grid grid-cols-1 mb-5 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-4 w-full max-w-full"
                            >
                                {/* Icon Section */}
                                <div className={`min-w-[50px] min-h-[50px] p-3 rounded-full flex items-center justify-center ${item.bg}`}>
                                    <img src={item.icon} className="w-6 h-6 object-contain" alt="icon" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col w-full">
                                    {/* Title */}
                                    <p className="text-sm text-gray-500 leading-tight">{item.title}</p>

                                    {/* Main Value */}
                                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-1 flex-wrap">
                                        {item.value}
                                        {item.subValue && (
                                            <span className="text-sm font-normal text-green-500 whitespace-nowrap">
                                                {item.subValue}
                                            </span>
                                        )}
                                    </div>

                                    {/* Change Tag */}
                                    {item.change && (
                                        <span className={`text-xs font-medium mt-1 ${item.color}`}>
                                            {item.change}
                                        </span>
                                    )}
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className="flex justify-end ">
                        <div className="bg-white min-w-[50px] min-h-[50px] p-2 rounded-full flex items-center justify-center ">
                            <img src="/demo/synco/DashboardIcons/user-add-02.png" alt="" />
                        </div>
                    </div>
                    <div className="overflow-auto mt-5 rounded-4xl w-full">
                        <table className="min-w-full rounded-4xl bg-white text-sm border border-[#E2E1E5]">
                            <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                                <tr className="font-semibold">
                                    <th className="p-4 text-[#717073]">Name</th>
                                    <th className="p-4 text-[#717073]">Age</th>
                                    <th className="p-4 text-[#717073]">Venue</th>
                                    <th className="p-4 text-[#717073]">Date of Booking</th>
                                    <th className="p-4 text-[#717073]">Date of Trial</th>
                                    <th className="p-4 text-[#717073]">Source</th>
                                    <th className="p-4 text-[#717073]">Attempts</th>
                                    <th className="p-4 text-[#717073]">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookFreeTrials.map((item, index) =>
                                    item.students.map((student, studentIndex) => (
                                        <tr
                                            onClick={() =>
                                                navigate(
                                                    '/configuration/weekly-classes/find-a-class/book-a-free-trial/account-info/list',
                                                    { state: { itemId: item.id } }
                                                )
                                            } key={`${item.id}-${studentIndex}`}
                                            className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50"
                                        >
                                            <td className="p-4 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <button className="lg:w-5 lg:h-5 me-2 flex items-center justify-center rounded-md border-2 border-gray-300" />
                                                    <span>{`${student.studentFirstName} ${student?.studentLastName}`}</span>
                                                </div>
                                            </td>

                                            <td className="p-4">{student.age}</td>
                                            <td className="p-4">{item.venue?.name || '-'}</td>
                                            <td className="p-4">
                                                {new Date(item.createdAt || item.trialDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                {new Date(item.trialDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                {item.parents?.[0]?.howDidYouHear || '-'}
                                            </td>
                                            <td className="p-4 text-center">{'static '}</td>
                                            <td className="p-4">
                                                <div
                                                    className={`flex text-center justify-center rounded-lg p-1 gap-2 ${item.status.toLowerCase() === 'attend'
                                                        ? 'bg-green-100 text-green-600'
                                                        : item.status.toLowerCase() === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-600'
                                                            : 'bg-red-100 text-red-500'
                                                        } capitalize`}
                                                >
                                                    {item.status}
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>

                </div>

                <div className="md:min-w-[508px]  md:max-w-[508px] text-base space-y-5">
                    <div className="space-y-3 bg-white p-6 rounded-3xl shadow-sm ">
                        <h2 className="text-[24px] font-semibold">Search Now </h2>
                        <div className="">
                            <label htmlFor="" className="text-base font-semibold">Search Student</label>
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by student name"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full border border-gray-300 rounded-xl px-3 text-[16px] py-3 pl-9 focus:outline-none"
                                />
                                <FiSearch className="absolute left-3 top-4 text-[20px]" />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="" className="text-base font-semibold">Venue</label>
                            <div className="relative mt-2 ">
                                <Select
                                    options={myVenues.map((venue) => ({
                                        label: venue?.name, // or `${venue.name} (${venue.area})`
                                        value: venue?.id,
                                    }))}
                                    value={selectedVenue}
                                    onChange={(venue) => setSelectedVenue(venue)}
                                    placeholder="Choose venue"
                                    className="mt-2"
                                    classNamePrefix="react-select"
                                    isClearable={true} // 👈 adds cross button
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
                        </div>
                    </div>

                    <div className="space-y-3 bg-white p-6 rounded-3xl shadow-sm ">
                        <div className="">
                            <div className="flex justify-between items-center mb-5 ">
                                <h2 className="text-[24px] font-semibold">Filter by Date </h2>
                                <button onClick={applyFilter} className="flex gap-2 items-center bg-[#237FEA] text-white px-3 py-2 rounded-lg text-sm sm:text-[16px]">
                                    <img src='/demo/synco/DashboardIcons/filtericon.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                                    Apply filter
                                </button>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg w-full">
                                <div className="font-semibold mb-2 text-[18px]">Choose type</div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-semibold text-[16px]">

                                    {["Attended", "Not Attended", "Date Booked", "Date of Trial"].map((label, i) => (
                                        <label key={i} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="peer hidden"
                                                checked={
                                                    label === "Attended"
                                                        ? checkedStatuses.attended
                                                        : label === "Not Attended"
                                                            ? checkedStatuses.notAttended
                                                            : label === "Date Booked"
                                                                ? checkedStatuses.dateBooked
                                                                : checkedStatuses.dateOfTrial
                                                }
                                                onChange={() => handleCheckboxChange(label)}
                                            />
                                            <span className="w-5 h-5 inline-flex text-gray-500 items-center justify-center border border-[#717073] rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                                                <Check className="w-4 h-4 transition-all" strokeWidth={3} />
                                            </span>
                                            <span>{label}</span>
                                        </label>
                                    ))}

                                    {/* <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!savedAgent}
                                            readOnly
                                            onClick={() => setShowPopup(true)}
                                            className="peer hidden"
                                        />
                                        <span className="w-5 h-5 inline-flex text-gray-500 items-center justify-center border border-[#717073] rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                                            <Check
                                                className="w-4 h-4   transition-all"
                                                strokeWidth={3}
                                            />

                                        </span>
                                        <span>Agent</span>
                                    </label> */}
                                </div>
                            </div>
                            {showPopup && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div
                                        ref={popupRef}
                                        className="bg-white rounded-2xl p-6 w-[300px] space-y-4 shadow-lg"
                                    >
                                        <h2 className="text-lg font-semibold">Select agent</h2>
                                        <div className="space-y-3 max-h-72 overflow-y-auto">
                                            {agents.map((agent, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center gap-3 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="agent"
                                                        checked={tempSelectedAgent === index}
                                                        onChange={() => setTempSelectedAgent(prev => (prev === index ? null : index))}
                                                        className="hidden peer"
                                                    />
                                                    <span className="w-4 h-4 border rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                                                        {tempSelectedAgent === index && (
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full" />
                                                    <span>{agent.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button
                                            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium"
                                            onClick={handleNext}
                                            disabled={tempSelectedAgent === null}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="rounded p-4 mt-6 text-center text-base w-full max-w-md mx-auto">
                                {/* Header */}
                                <div className="flex justify-around items-center mb-3">
                                    <button
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
                                                className={`grid grid-cols-7 text-[18px] gap-1 py-1 rounded `}
                                            >
                                                {week.map((date, i) => {
                                                    const isSelected = isSameDate(date, selectedDates);
                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => date && handleDateClick(date)}
                                                            className={`w-8 h-8 flex text-[18px] items-center justify-center mx-auto text-base rounded-full cursor-pointer
  ${selectedDates.some(d => isSameDate(d, date))
                                                                    ? "bg-blue-600 text-white font-bold"
                                                                    : "text-gray-800"
                                                                }`}
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
                    <div className="flex gap-2 justify-between">
                        <button className="flex gap-2 items-center justify-center  bg-none border border-[#717073] text-[#717073] px-3 py-2 rounded-xl md:min-w-[160px] sm:text-[16px]">
                            <img src='/demo/synco/icons/mail.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Send Email
                        </button>
                        <button className="flex gap-2 items-center justify-center bg-none border border-[#717073] text-[#717073] px-3 py-2 rounded-xl md:min-w-[160px] sm:text-[16px]">
                            <img src='/demo/synco/icons/sendText.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Send Text
                        </button>
                        <button onClick={applyFilter} className="flex gap-2 items-center justify-center bg-[#237FEA] text-white px-3 py-2 rounded-xl md:min-w-[160px] sm:text-[16px]">
                            <img src='/demo/synco/icons/download.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Apply filter
                        </button>
                    </div>
                </div>



            </div>

        </div>
    )
}

export default trialLists