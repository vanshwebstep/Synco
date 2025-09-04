import React, { useEffect, useRef, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Select from "react-select";
import { Check, } from "lucide-react";
import { useBookFreeTrial } from '../../../../contexts/BookAFreeTrialContext';
import { useNavigate } from "react-router-dom";
import Loader from '../../../../contexts/Loader';
import { usePermission } from '../../../../Common/permission';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const WaitingList = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [tempSelectedAgents, setTempSelectedAgents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const toggleSelect = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId) // remove if already selected
                : [...prev, studentId] // add if not selected
        );
    };


const exportWaitingList = () => {
    const dataToExport = [];

    bookFreeTrials?.forEach((item) => {
        if (selectedStudents.length > 0 && !selectedStudents.includes(item.id)) return;

        item.students.forEach((student) => {
            dataToExport.push({
                Name: `${student.studentFirstName} ${student?.studentLastName || ""}`,
                Age: student.age || "-",
                Venue: item.venue?.name || "-",
                "Date Added": new Date(item.createdAt).toLocaleDateString(),
                "Added By": `${item.bookedByAdmin?.firstName || ""} ${
                    item.bookedByAdmin?.lastName && item.bookedByAdmin?.lastName !== "null"
                        ? item.bookedByAdmin.lastName
                        : ""
                }`.trim(),
                "Days Waiting": item.waitingDays || "From Akshay pending",
                "Interest level": item.interest || "-",
                Status: item.status || "-",
            });
        });
    });

    if (!dataToExport.length) return alert("No data to export");

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WaitingList");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "WaitingList.xlsx");
};

    const [checkedStatuses, setCheckedStatuses] = useState({
        interest1Low: false,
        interest2Medium: false,
        interest3High: false,
        dateOfTrial: false,
    });

    const [selectedDates, setSelectedDates] = useState([]);
    const handleCheckboxChange = (label) => {
        setCheckedStatuses((prev) => {
            switch (label) {
                case "Interest 1 (Low)":
                    return { ...prev, interest1Low: !prev.interest1Low };
                case "Interest 2 Medium":
                    return { ...prev, interest2Medium: !prev.interest2Medium };
                case "Interest 3 High":
                    return { ...prev, interest3High: !prev.interest3High };
                case "Date of Trial":
                    return { ...prev, dateOfTrial: !prev.dateOfTrial };
                default:
                    return prev;
            }
        });
    };
    // const [selectedDate, setSelectedDate] = useState(null);
    const { fetchAddtoWaitingList, statsFreeTrial, bookFreeTrials, setSearchTerm, bookedByAdmin, searchTerm, loading, selectedVenue, setStatus, status, setSelectedVenue, myVenues, setMyVenues, sendWaitingListMail } = useBookFreeTrial() || {};



    const navigate = useNavigate();

    console.log('bookedByAdmin', bookedByAdmin)
    useEffect(() => {
        if (selectedVenue) {
            fetchAddtoWaitingList("", selectedVenue.label); // Using label as venueName
        } else if (status) {
            fetchAddtoWaitingList("", "", status); // Using label as venueName
        } else {
            fetchAddtoWaitingList(); // No filter
        }
    }, [selectedVenue, fetchAddtoWaitingList]);

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

    const isInRange = (date) => {
        if (!fromDate || !toDate || !date) return false;
        return date >= fromDate && date <= toDate;
    };

    const isSameDate = (d1, d2) => {
        if (!d1 || !d2) return false;
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

        if (!fromDate) {
            setFromDate(date);
            setToDate(null); // reset second date
        } else if (!toDate) {
            // Ensure order (from <= to)
            if (date < fromDate) {
                setToDate(fromDate);
                setFromDate(date);
            } else {
                setToDate(date);
            }
        } else {
            // If both already selected, reset
            setFromDate(date);
            setToDate(null);
        }
    };

    const modalRef = useRef(null);
    const PRef = useRef(null);
    const stats = [
        {
            title: "Top Referrer",
            value: statsFreeTrial?.totalFreeTrials?.value || "0",
            icon: "/demo/synco/DashboardIcons/🏆.png", // Replace with actual SVG if needed
            change: statsFreeTrial?.totalFreeTrials?.change != null
                ? `${statsFreeTrial.totalFreeTrials.change}%`
                : "0%",
            color: "text-green-500",
            bg: "bg-[#F3FAF5]"
        },
        {
            title: "Total on Waiting List",
            value: statsFreeTrial?.freeTrialAttendanceRate?.value || "0",
            icon: "/demo/synco/DashboardIcons/📋.png",
            change: statsFreeTrial?.freeTrialAttendanceRate?.change != null
                ? `${statsFreeTrial.freeTrialAttendanceRate.change}%`
                : "0%",
            color: "text-green-500",
            bg: "bg-[#FEF6FB]"
        },
        {
            title: "Avg. Interest Level",
            value: statsFreeTrial?.avgInterest,
            subValue: "(456)",
            icon: "/demo/synco/DashboardIcons/📈.png",
            color: "text-green-500",
            bg: "bg-[#F3FAFD]"
        },

        {
            title: "Avg. Days Waiting",
            value: statsFreeTrial?.avgDaysWaiting?.value || "0",
            icon: "/demo/synco/DashboardIcons/⏱️.png",
            change: statsFreeTrial?.trialsToMembers?.change != null
                ? `${statsFreeTrial.trialsToMembers.change}%`
                : "0%",
            color: "text-green-500",
            bg: "bg-[#F0F9F9]"
        },
        {
            title: "Most Requested Venue",
            value: statsFreeTrial?.freeTrialAttendanceRate?.value || "0",
            icon: "/demo/synco/DashboardIcons/📍.png",
            change: statsFreeTrial?.freeTrialAttendanceRate?.change != null
                ? `${statsFreeTrial.freeTrialAttendanceRate.change}%`
                : "0%",
            color: "text-green-500",
            bg: "bg-[#FEF6FB]"
        },
    ];
    const applyFilter = () => {
        const forAttend = checkedStatuses.interest1Low || "";
        const forNotAttend = checkedStatuses.interest2Medium || "";
        const forHigh = checkedStatuses.interest3High || "";

        let forDateOkBookingTrial = "";
        let forDateOfTrial = "";
        let forOtherDate = "";

        const bookedDatesChecked = checkedStatuses.interest3High;
        const trialDatesChecked = checkedStatuses.dateOfTrial;

        if (fromDate && toDate) {
            if (bookedDatesChecked) {
                forDateOkBookingTrial = [fromDate, toDate];
            } else if (trialDatesChecked) {
                forDateOfTrial = [fromDate, toDate];
            } else {
                forOtherDate = [fromDate, toDate];
            }
        }

        const bookedByParams = savedAgent || [];

        fetchAddtoWaitingList(
            "",
            "",
            forAttend,
            forNotAttend,
            forHigh,
            forDateOkBookingTrial,
            forDateOfTrial,
            forOtherDate,
            bookedByParams
        );
    };


    const [showPopup, setShowPopup] = useState(false);
    const [tempSelectedAgent, setTempSelectedAgent] = useState(null);
    const [savedAgent, setSavedAgent] = useState([]);
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
        if (tempSelectedAgents.length > 0) {
            const selectedNames = tempSelectedAgents.map(
                (agent) => `${agent.firstName}`
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
        fetchAddtoWaitingList(value);
    };
    console.log('bookedByAdmin', bookedByAdmin)
    const { checkPermission } = usePermission();

    const canServicehistory =
        checkPermission({ module: 'service-history', action: 'view-listing' })
    if (loading) return <Loader />;
    return (
        <div className="pt-1 bg-gray-50 min-h-screen">

            <div className="md:flex w-full gap-4">
                <div className="flex-1 transition-all duration-300">
                    <div className="grid grid-cols-1 mb-5 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {stats.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-2 w-full max-w-full"
                            >
                                {/* Icon Section */}
                                <div className={`m  rounded-full flex items-center justify-center `}>
                                    <img src={item.icon} className="w-10 h-10 object-contain" alt="icon" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col w-full">
                                    {/* Title */}
                                    <p className="text-[14px] text-gray-500 leading-tight">{item.title}</p>

                                    {/* Main Value */}
                                    <div className="text-lg font-semibold text-gray-900 flex items-center gap-1 flex-wrap">
                                        {item.value}
                                        {item.subValue && (
                                            <span className="text-sm font-normal text-green-500 whitespace-nowrap">
                                                {item.subValue}
                                            </span>

                                        )}
                                        {item.change && (
                                            <span className={`text-xs font-medium mt-1 ${item.color}`}>
                                                {item.change}
                                            </span>
                                        )}
                                    </div>

                                    {/* Change Tag */}

                                </div>
                            </div>

                        ))}
                    </div>
                    <div className="flex justify-end ">
                        <div className="bg-white min-w-[50px] min-h-[50px] p-2 rounded-full flex items-center justify-center ">
                            <img onClick={() => navigate("/configuration/weekly-classes/find-a-class")}
                                src="/demo/synco/DashboardIcons/user-add-02.png" alt="" className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="overflow-auto mt-5 rounded-4xl w-full">
                        <table className="min-w-full rounded-4xl bg-white text-sm border border-[#E2E1E5]">
                            <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                                <tr className="font-semibold">
                                    <th className="p-4 text-[#717073]">Name</th>
                                    <th className="p-4 text-[#717073]">Age</th>
                                    <th className="p-4 text-[#717073]">Venue</th>
                                    <th className="p-4 text-[#717073]">Date Added</th>
                                    <th className="p-4 text-[#717073]">Added By</th>
                                    <th className="p-4 text-[#717073]">Days Waiting</th>
                                    <th className="p-4 text-[#717073]">Interest level</th>
                                    <th className="p-4 text-[#717073]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookFreeTrials && bookFreeTrials.length > 0 ? (
                                    bookFreeTrials.map((item, index) =>
                                        item.students.map((student, studentIndex) => {
                                            const isSelected = selectedStudents.includes(item.id);

                                            return (
                                                <tr
                                                    key={`${item.id}-${studentIndex}`}
                                                    onClick={
                                                        canServicehistory
                                                            ? () =>
                                                                navigate(
                                                                    "/configuration/weekly-classes/add-to-waiting-list/account-info",
                                                                    { state: { itemId: item.id } }
                                                                )
                                                            : undefined
                                                    }
                                                    className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50"
                                                >
                                                    {/* Student cell – no row click here */}
                                                    <td
                                                        className="p-4 cursor-pointer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleSelect(item.id)}
                                                                className={`lg:w-5 lg:h-5 me-2 flex items-center justify-center rounded-md border-2 
                    ${isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 text-transparent"}`}
                                                            >
                                                                {isSelected && <Check size={14} />}
                                                            </button>
                                                            <span>{`${student.studentFirstName} ${student?.studentLastName}`}</span>
                                                        </div>
                                                    </td>

                                                    <td className="p-4">{student.age}</td>
                                                    <td className="p-4">{item.venue?.name || "-"}</td>
                                                    <td className="p-4">
                                                        {new Date(item.createdAt || item.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        {item.bookedByAdmin.firstName} {item?.bookedByAdmin?.lastName && item.bookedByAdmin.lastName !== 'null' ? ` ${item.bookedByAdmin.lastName}` : ''}
                                                    </td>
                                                    <td className="p-4">{item.waitingDays || "From Akshay pending "}</td>
                                                    <td className="p-4 capitalize">{item.interest}</td>
                                                    <td className="p-4">
                                                        <div
                                                            className={`flex text-center justify-center rounded-lg p-1 gap-2 ${item.status.toLowerCase() === 'attend' || item.status.toLowerCase() === 'active'
                                                                ? 'bg-green-100 text-green-600'
                                                                : item.status.toLowerCase() === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-600'
                                                                    : item.status.toLowerCase() === 'frozen'
                                                                        ? 'bg-blue-100 text-blue-600'
                                                                        : item.status.toLowerCase() === 'waiting list'
                                                                            ? 'bg-gray-200 text-gray-700'
                                                                            : 'bg-red-100 text-red-500'
                                                                } capitalize`}
                                                        >
                                                            {item.status}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center p-4 text-gray-500">
                                            Data not found
                                        </td>
                                    </tr>
                                )}
                            </tbody>


                        </table>

                    </div>

                </div>

                <div className="md:min-w-[470px]  md:max-w-[470px] text-base space-y-5">
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

                                    {["Interest 1 (Low)", "Interest 2 Medium", "Interest 3 High"].map((label, i) => (
                                        <label key={i} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="peer hidden"
                                                checked={
                                                    label === "Interest 1 (Low)"
                                                        ? checkedStatuses.interest1Low
                                                        : label === "Interest 2 Medium"
                                                            ? checkedStatuses.interest2Medium
                                                            : label === "Interest 3 High"
                                                                ? checkedStatuses.interest3High
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

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={savedAgent?.length > 0} // checked if some agents are saved
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    fetchAddtoWaitingList();
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
                                        <span>Agent Name</span>
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
                                                            alt={`${admin.firstName} ${admin.lastName && admin.lastName !== 'null' ? ` ${admin.lastName}` : ''}`}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <span>
                                                            {admin?.firstName || admin?.lastName
                                                                ? `${admin?.firstName ?? ""}${admin.lastName && admin.lastName !== 'null' ? ` ${admin.lastName}` : ''}`.trim()
                                                                : "N/A"}
                                                        </span>
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
                    </div>
                    <div className="flex gap-0 justify-between">
                        <button
                            onClick={() => {
                                if (!selectedStudents || selectedStudents.length === 0) {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "No students selected",
                                        text: "Please select at least one student before sending an email.",
                                    });
                                    return;
                                }

                                sendWaitingListMail(selectedStudents);
                            }}
                            className="flex gap-2 items-center justify-center bg-none border border-[#717073] text-[#717073] px-2 py-2 rounded-xl md:min-w-[140px] sm:text-[16px]"
                        >
                            <img
                                src="/demo/synco/icons/mail.png"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                alt="mail"
                            />
                            Send Email
                        </button>


                        <button className="flex gap-2 items-center justify-center bg-none border border-[#717073] text-[#717073] px-2 py-2 rounded-xl md:min-w-[140px] sm:text-[16px]">
                            <img src='/demo/synco/icons/sendText.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Send Text
                        </button>
                        <button onClick={exportWaitingList} className="flex gap-2 items-center justify-center bg-[#237FEA] text-white px-2 py-2 rounded-xl md:min-w-[140px] sm:text-[16px]">
                            <img src='/demo/synco/icons/download.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Export Data
                        </button>
                    </div>
                </div>



            </div>

        </div>
    )
}

export default WaitingList