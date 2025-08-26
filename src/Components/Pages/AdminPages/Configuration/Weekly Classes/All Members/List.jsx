import React, { useEffect, useRef, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "react-select";
import { Check, } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useBookFreeTrial } from '../../../contexts/BookAFreeTrialContext';
import Loader from '../../../contexts/Loader';

const trialLists = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 11));
    const [toDate, setToDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [tempSelectedAgents, setTempSelectedAgents] = useState([]);

    // ✅ Define all filters with dynamic API mapping
    const filterOptions = [
        { label: "Pending", key: "pending", apiParam: "status", apiValue: "pending" },
        { label: "Active", key: "active", apiParam: "status", apiValue: "active" },
        { label: "Date Booked", key: "trialDate", apiParam: "trialDate" },
        { label: "6 Months", key: "sixMonths", apiParam: "month", apiValue: "sixMonths" },
        { label: "3 Months", key: "threeMonths", apiParam: "month", apiValue: "threeMonths" },
        { label: "flexi Plan", key: "flexiPlan", apiParam: "month", apiValue: "flexiPlan" },
    ]
    const [checkedStatuses, setCheckedStatuses] = useState(
        filterOptions.reduce((acc, option) => ({ ...acc, [option.key]: false }), {})
    );

    // ✅ Generic checkbox change handler
    const handleCheckboxChange = (key) => {
        setCheckedStatuses((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    const [selectedDates, setSelectedDates] = useState([]);
    const { fetchBookMemberships, bookMembership, setBookMembership, bookedByAdmin, setSearchTerm, searchTerm, status, loading, selectedVenue, setSelectedVenue, statsMembership, myVenues, setMyVenues } = useBookFreeTrial()

    useEffect(() => {
        if (selectedVenue) {
            fetchBookMemberships("", selectedVenue.label); // Using label as venueName
        } else {
            fetchBookMemberships(); // No filter
        }
    }, [selectedVenue, fetchBookMemberships]);
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
    const applyFilter = () => {
        const forAttend = checkedStatuses.pending;
        const forNotAttend = checkedStatuses.active;
        const sixMonths = checkedStatuses.sixMonths;
        const threeMonths = checkedStatuses.threeMonths;
        const flexiPlan = checkedStatuses.flexiPlan;

        let forDateOkBookingTrial = [];
        let forOtherDate = [];

        if (selectedDates.length) {
            selectedDates.forEach((date) => {
                let added = false;

                if (checkedStatuses.trialDate) {
                    forDateOkBookingTrial.push(date);
                    added = true;
                }

                if (!added) {
                    forOtherDate.push(date);
                }
            });
        }
const bookedByParams = savedAgent || []; // savedAgent is already an array of IDs

        // Prepare bookedBy parameter if agents are selected

        fetchBookMemberships(
            "",
            "",
            forAttend,
            forNotAttend,
            forDateOkBookingTrial,
            sixMonths,
            threeMonths,
            flexiPlan,
            forOtherDate,
            bookedByParams // add this at the end
        );
    };



    const modalRef = useRef(null);
    const PRef = useRef(null);
    const stats = [
        {
            title: "Total Students",
            value: statsMembership?.totalStudents?.toString() || "0",
            icon: "/demo/synco/members/allmemberTotalRevenue.png",
            change: "+12%",
            color: "text-green-500",
            bg: "bg-[#F3FAF5]"
        },
        {
            title: "Monthly revenue",
            value: statsMembership?.totalRevenue?.toFixed(2) || "0.00",
            icon: "/demo/synco/members/allmemberMonthlyRevenue.png",
            color: "text-green-500",
            bg: "bg-[#F3FAFD]"
        },
        {
            title: "AV. Monthly Fee",
            value: statsMembership?.avgMonthlyFee?.toFixed(2) || "0.00",
            icon: "/demo/synco/members/allmemberMonthlyFee.png",
            change: "35%",
            color: "text-green-500",
            bg: "bg-[#FEF6FB]"
        },
        {
            title: "AV. Life Cycle",
            value: statsMembership?.avgLifeCycle?.toFixed(2) || "0.00",
            icon: "/demo/synco/members/allmemberLifeCycle.png",
            change: "45%",
            color: "text-green-500",
            bg: "bg-[#F0F9F9]"
        }
    ];


    const [showPopup, setShowPopup] = useState(false);
    const [tempSelectedAgent, setTempSelectedAgent] = useState(null);
    const [savedAgent, setSavedAgent] = useState([]);
    const popupRef = useRef(null);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const toggleAgent = (agentId) => {
        if (selectedAgents.includes(agentId)) {
            // 👉 prevent unselecting (disable once checked)
            return;
        }
        setSelectedAgents((prev) => [...prev, agentId]);
    };
    const agents = bookedByAdmin.map((admin) => ({
        name: `${admin.firstName} ${admin.lastName}`.trim(),
        avatar: admin.profile
            ? `${API_BASE_URL}${admin.profile}`
            : "/demo/synco/members/dummyuser.png", // fallback image
    }));
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
        if (tempSelectedAgents.length > 0) {
            const selectedNames = tempSelectedAgents.map(
                (agent) => `${agent.id}`
            );
            setSavedAgent(selectedNames); // ✅ saves full names as strings
            console.log("selectedNames", tempSelectedAgents);
        } else {
            setSavedAgent([]); // nothing selected → clear
        }
        setShowPopup(false);
    };



    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Fetch data with search value (debounce optional)
        fetchBookMemberships(value);
    };
    // if (loading) return <Loader />;

    console.log('bookMembership', bookMembership)
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
                                    <th className="p-4 text-[#717073]">
                                        <div className="flex gap-2 items-center">

                                            Name
                                        </div>
                                    </th>
                                    <th className="p-4 text-[#717073]">Age  </th>
                                    <th className="p-4 text-[#717073]">Venue</th>
                                    <th className="p-4 text-[#717073]">Date of Booking</th>
                                    <th className="p-4 text-[#717073]">Who Booked?</th>
                                    <th className="p-4 text-[#717073]">Membership Plan</th>
                                    <th className="p-4 text-[#717073]">Life Cycle of membership</th>
                                    <th className="p-4 text-[#717073]">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookMembership.map((item, index) =>
                                    item.students.map((student, studentIndex) => (
                                        <tr onClick={() => navigate('/configuration/weekly-classes/all-members/membership-sales')}
                                            className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                                            <td className="p-4 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <button className="lg:w-5 lg:h-5 me-2 flex items-center justify-center rounded-md border-2 border-gray-300" />
                                                    <span>{`${student.studentFirstName} ${student?.studentLastName}`}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">{student.age}</td>
                                            <td className="p-4">{item.venue?.name || '-'}</td>
                                            <td className="p-4">{new Date(item.trialDate).toLocaleDateString()}</td>
                                            <td className="p-4">Indoor Court</td>
                                            <td className="p-4"> {item?.paymentPlan?.title}</td>
                                            <td className="p-4 text-center">
                                                {item?.paymentPlan?.duration} {item?.paymentPlan?.interval}{item?.paymentPlan?.duration > 1 ? 's' : ''}
                                            </td>
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
                            <div className="relative mt-2 ">
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

                                    {filterOptions.map(({ label, key }) => (
                                        <label key={key} className="flex items-center gap-2">
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
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={savedAgent?.length > 0} // checked if some agents are saved
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    fetchBookMemberships();
                                                    setShowPopup(true); // open popup
                                                } else {
                                                    // Clear everything if unchecked
                                                    setSavedAgent([]);
                                                    setTempSelectedAgents([]);
                                                }
                                            }}
                                            className="peer hidden"
                                        />
                                        <span className="w-5 h-5 inline-flex text-gray-500 items-center justify-center border border-[#717073] rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                                            <Check className="w-4 h-4 transition-all" strokeWidth={3} />
                                        </span>
                                        <span>Agent</span>
                                    </label>




                                </div>
                            </div>
                            {showPopup && (
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                    onClick={() => {
                                        // click outside → reset everything
                                        setShowPopup(false);
                                        setSavedAgent([]);
                                        setTempSelectedAgents([]);
                                    }}
                                >
                                    <div
                                        ref={popupRef}
                                        className="bg-white rounded-2xl p-6 w-[300px] space-y-4 shadow-lg"
                                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                                    >
                                        <h2 className="text-lg font-semibold">Select agent(s)</h2>
                                        <div className="space-y-3 max-h-72 overflow-y-auto">
                                            {bookedByAdmin.map((admin, index) => {
                                                const isSelected = tempSelectedAgents.some(
                                                    (a) => a.id === admin.id
                                                );

                                                return (
                                                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                if (isSelected) {
                                                                    setTempSelectedAgents((prev) =>
                                                                        prev.filter((a) => a.id !== admin.id)
                                                                    );
                                                                } else {
                                                                    setTempSelectedAgents((prev) => [
                                                                        ...prev,
                                                                        { id: admin.id, firstName: admin.firstName, lastName: admin.lastName },
                                                                    ]);
                                                                }
                                                            }}
                                                            className="hidden peer"
                                                        />
                                                        <span className="w-4 h-4 border rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                                                            {isSelected && (
                                                                <svg
                                                                    className="w-3 h-3 text-white"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <img
                                                            src={admin.profile ? `${API_BASE_URL}${admin.profile}` : "/demo/synco/members/dummyuser.png"}
                                                            alt={`${admin.firstName} ${admin.lastName}`}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <span>{`${admin.firstName} ${admin.lastName}`}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium"
                                            onClick={handleNext}
                                            disabled={tempSelectedAgents.length === 0}
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