import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import Select from "react-select";
import { FiUsers } from "react-icons/fi";
import {
    User,
    UserRoundPlus
} from "lucide-react";
import {
    Search,
    Plus,
    Mail,
    MessageSquare,
    Download,
    ChevronLeft,
    ChevronRight,
    Check,
    CirclePoundSterling, X, CircleDollarSign
} from "lucide-react";
import { TiUserAdd } from "react-icons/ti";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PiUsersThreeBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Loader from "../contexts/Loader";
const SalesDashboard = () => {
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("adminToken");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mainLoading, setMainLoading] = useState(false);
    const [leadsData, setLeadsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [summary, setSummary] = useState([]);
    const [tempSelectedAgents, setTempSelectedAgents] = useState([]);
    const [showCoachPopup, setShowCoachPopup] = useState(false);
    const [savedCoach, setSavedCoach] = useState([]);
    const [tempSelectedCoaches, setTempSelectedCoaches] = useState([]);
    const popupRef = useRef(null);
    const [myVenues, setMyVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [tempSelectedAgent, setTempSelectedAgent] = useState(null);
    const [savedAgent, setSavedAgent] = useState([]);
    function formatLocalDate(dateString) {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return null;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`; // returns "2025-08-24"
    }
    console.log('summary', summary)
    const fetchLeads = useCallback(
        async (
            studentName = "",
            status1 = false,
            status2 = false,
            status3 = false,
            forOtherDate = [],
            BookedBy = [], // agents
            CoachBy = []   // coaches
        ) => {
            const token = localStorage.getItem("adminToken");
            if (!token) return;

            try {
                const queryParams = new URLSearchParams();

                // ✅ Student filter
                if (studentName) queryParams.append("studentName", studentName);

                // ✅ Filter types
                if (status1) queryParams.append("type", "package");
                if (status2) queryParams.append("type", "dateOfParty");
                if (status3) queryParams.append("type", "source");

                // ✅ Date range
                if (Array.isArray(forOtherDate) && forOtherDate.length === 2) {
                    const [from, to] = forOtherDate;
                    if (from && to) {
                        queryParams.append("fromDate", formatLocalDate(from));
                        queryParams.append("toDate", formatLocalDate(to));
                    }
                }

                // ✅ AGENT FILTER (BookedBy)
                console.log('BookedBy',BookedBy)
                if (Array.isArray(BookedBy) && BookedBy.length > 0) {
                    BookedBy.forEach((agent) => {
                        if (agent.id) queryParams.append("agent", agent.id);
                    });
                }

                // ✅ COACH FILTER
                if (Array.isArray(CoachBy) && CoachBy.length > 0) {
                    CoachBy.forEach((coach) => {
                        if (coach.id) queryParams.append("coach", coach.id);
                    });
                }

                // ✅ Build final URL
                const queryString = queryParams.toString();
                const url = `${API_BASE_URL}/api/admin/one-to-one/sales/list${queryString ? `?${queryString}` : ""
                    }`;

                console.log("🔍 Final Fetch URL:", url); // ✅ debug line

                const response = await fetch(url, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const resultRaw = await response.json();
                const result = resultRaw.data || [];
                setLeadsData(result);
                setSummary(resultRaw.summary);
            } catch (error) {
                console.error("Failed to fetch bookFreeTrials:", error);
            }
        },
        []
    );



    useEffect(() => {
        const loadLeads = async () => {
            try {
                setMainLoading(true);
                await fetchLeads();
            } finally {
                setMainLoading(false);
            }
        };

        loadLeads();
    }, [fetchLeads]);


    console.log('summary', summary)
    const sources = summary?.sourceOfBookings;

    // Determine finalSource based on conditions
    let finalSource = "Online"; // default if not exist or invalid

    if (Array.isArray(sources) && sources.length > 0) {
        // find the max count
        const maxCount = Math.max(...sources.map((s) => s.count));

        // filter all sources that share the max count
        const topSources = sources.filter((s) => s.count === maxCount);

        // if tie → pick first one, else → only one with max count
        finalSource = topSources[0]?.source || "Online";
    }

    // then your summaryCards
    const summaryCards = [
        { icon: CircleDollarSign, iconStyle: "text-[#3DAFDB] bg-[#E6F7FB]", title: "Total Revenue", value: "£30.300", change: "+28.14%" },
        { icon: CirclePoundSterling, iconStyle: "text-[#099699] bg-[#E0F7F7]", title: "Revenue Gold Package", value: '£20.000', change: "+12.47%" },
        { icon: PiUsersThreeBold, iconStyle: "text-[#F38B4D] bg-[#FFF2E8]", title: "Revenue Silver Package", value: '£20.000', change: "+9.31%" },
        { icon: FiUsers, iconStyle: "text-[#6F65F1] bg-[#E9E8FF]", title: "Top Sales Agent", value: "Ben Marcus" },
    ]
    const [formData, setFormData] = useState({
        parentName: "",
        childName: "",
        age: "",
        postCode: "",
        packageInterest: "",
        availability: "",
        source: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formData', formData)
        // 🔍 Validate required fields (example)
        if (
            !formData.parentName ||
            !formData.availability ||
            !formData.age ||
            !formData.childName ||
            !formData.packageInterest ||
            !formData.postCode ||
            !formData.source
        ) {
            const missingFields = [];

            if (!formData.parentName) missingFields.push("Parent Name");
            if (!formData.childName) missingFields.push("Child Name");
            if (!formData.age) missingFields.push("Age");
            if (!formData.postCode) missingFields.push("Post Code");
            if (!formData.packageInterest) missingFields.push("Package Interest");
            if (!formData.availability) missingFields.push("Availability");
            if (!formData.source) missingFields.push("Source");

            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                html: `
      <div style="text-align:left;">
        <p>Please fill out the following required field(s):</p>
        <ul style="margin-top:8px;">
          ${missingFields.map(f => `<li>• ${f}</li>`).join("")}
        </ul>
      </div>
    `,
            });
            return;
        }


        console.log("Submitting lead:", formData);

        setLoading(true); // 🌀 optional loader state

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/one-to-one/leads/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData), // ✅ remove unnecessary wrapping {formData}
            });

            const result = await response.json();

            if (!response.ok) {
                // ❌ Handle API error response
                throw new Error(result.message || "Failed to create lead.");
            }

            // ✅ Success alert
            Swal.fire({
                icon: "success",
                title: "Lead Created",
                text: "The lead has been successfully added.",
                timer: 2000,
                showConfirmButton: false,
            });

            await fetchLeads(); // refresh roles or data
            setIsOpen(false);   // close modal or form
            setFormData({});    // reset form if needed

        } catch (error) {
            console.error("Create lead error:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong while creating the lead.",
            });
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Fetch data with search value (debounce optional)
        fetchLeads(value);
    };
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const leadsDatas = Array(10).fill({
        id: 1,
        parent: "Tom Jones",
        child: "Steve Jones",
        age: 10,
        postCode: "W14 9EB",
        package: "Gold",
        availability: "Weekends",
        source: "Referral",
        status: "Package",
    });
    console.log('leadsData', leadsData)
    const toggleCheckbox = (userId) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    // ==== Calendar Logic ====
    const getDaysInMonth = (month, year) =>
        new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (month, year) =>
        new Date(year, month, 1).getDay(); // 0=Sun

    const daysInMonth = getDaysInMonth(
        currentDate.getMonth(),
        currentDate.getFullYear()
    );
    const firstDay = getFirstDayOfMonth(
        currentDate.getMonth(),
        currentDate.getFullYear()
    );
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("default", { month: "long" });


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
    const exportToExcel = () => {
        if (!leadsData || !leadsData.length) {
            alert("No leads data available to export.");
            return;
        }

        // Prepare data
        const dataToExport = leadsData
            .filter((lead) => selectedUserIds.length === 0 || selectedUserIds.includes(lead.id))
            .map((lead) => ({
                "Parent Name": lead.parentName || "-",
                "Child Name": lead.childName || "-",
                Age: lead.age || "-",
                Postcode: lead.postCode || "-",
                "Package Interest": lead.packageInterest || "-",
                Availability: lead.availability || "-",
                Source: lead.source || "-",
                Status: lead.status || "-",
            }));

        if (!dataToExport.length) {
            alert("No data selected to export.");
            return;
        }

        // Convert to worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "LeadsData");

        // Export to file
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "LeadsData.xlsx");
    };
    // Normalize to array
    const leadsArray = Array.isArray(leadsData) ? leadsData : [];
    // Extract unique creators
    console.log('leadsArray', leadsData)
    // Extract unique creators (booked by admins)
    const bookedByAdmin = Array.from(
        new Map(
            leadsArray
                .filter(item => item.creator) // only include if creator exists
                .map(item => [item.creator.id, item.creator]) // use creator.id as unique key
        ).values()
    );
    const bookedByCoach = Array.from(
        new Map(
            leadsArray
                .filter(item => item.creator) // only include if creator exists
                .map(item => [item.creator.id, item.creator]) // use creator.id as unique key
        ).values()
    );

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
    const applyFilter = () => {
        const bookedByParams = Array.isArray(savedAgent) ? savedAgent : [];
        const coachByParams = Array.isArray(savedCoach) ? savedCoach : [];
console.log('bookedByParams',bookedByParams)
console.log('coachByParams',coachByParams)
        const isValidDate = (d) => d instanceof Date && !isNaN(d.valueOf());
        const hasRange = isValidDate(fromDate) && isValidDate(toDate);
        const range = hasRange ? [fromDate, toDate] : [];

        const dateRangeMembership = checkedStatuses.trialDate ? range : [];
        const otherDateRange = checkedStatuses.trialDate ? [] : range;

        fetchLeads(
            "",
            checkedStatuses.package,
            checkedStatuses.dateOfParty,
            checkedStatuses.source,
            otherDateRange,
            bookedByParams, // ✅ Agent
            coachByParams    // ✅ Coach
        );
    };
    const prevMonth = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    }; const handleCheckboxChange = (key) => {
        setCheckedStatuses((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const nextMonth = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };
    // ✅ Define all filters with dynamic API mapping
    const filterOptions = [
        { label: "Package", key: "package", apiParam: "type", apiValue: "package" },
        { label: "Date Of Party ", key: "dateOfParty", apiParam: "type", apiValue: "dateOfParty" },
        { label: "Source", key: "source", apiParam: "type", apiValue: "source" },
    ]
    const [checkedStatuses, setCheckedStatuses] = useState(
        filterOptions.reduce((acc, option) => ({ ...acc, [option.key]: false }), {})
    );

    console.log('bookedByAdmin', bookedByAdmin)
    // Prepare calendar cells
    const daysArray = [];
    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

    if (mainLoading) {
        return (
            <>
                <Loader />
            </>
        )
    }
    return (
        <>

            <div className="min-h-screen overflow-hidden bg-gray-50 py-6 flex flex-col lg:flex-row ">
                {/* Left Section */}
                <div className="md:w-[73%] gap-6 md:pe-3 mb-4 md:mb-0">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {summaryCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-4 border border-gray-100 flex  items-center gap-4 hover:shadow-md transition-all duration-200"
                                >
                                    <div>
                                        <div
                                            className={`p-2 h-[50px] w-[50px] rounded-full ${card.iconStyle} bg-opacity-10 flex items-center justify-center`}
                                        >
                                            <Icon size={24} className={card.iconStyle} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500">{card.title}</p>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold mt-1">{card.value}</h3>
                                            {card.change && (
                                                <p className="text-green-600 text-xs mt-1">({card.change})</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Leads Table */}
                    <div className="mt-5 ">


                        {/* Table */}
                        <div className="overflow-auto rounded-2xl bg-white shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#F5F5F5] text-left border border-[#EFEEF2]">
                                    <tr className="font-semibold text-[#717073]">
                                        <th className="py-3 px-4 whitespace-nowrap">Parent Name</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Child Age</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Location</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Date Of Class</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Package</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Price Paid</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Source</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Coach</th>
                                        <th className="py-3 px-4 whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leadsData.map((lead, i) => {
                                        const isChecked = selectedUserIds.includes(lead.id);
                                        return (
                                            <tr
                                                key={i}
                                              onClick={() => navigate("/one-to-one/sales/account-information")}
                                                className="border-b border-[#EFEEF2] hover:bg-gray-50 transition cursor-pointer"
                                            >
                                                <td className="py-3 px-4 whitespace-nowrap font-semibold">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // ⛔ prevent row click
                                                                toggleCheckbox(lead.id);
                                                            }}
                                                            className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${isChecked ? "border-gray-500" : "border-gray-300"
                                                                }`}
                                                        >
                                                            {isChecked && (
                                                                <Check
                                                                    size={16}
                                                                    strokeWidth={3}
                                                                    className="text-gray-500"
                                                                />
                                                            )}
                                                        </button>
                                                        {lead.parentName}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.age}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.booking?.location || "N/A"}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.booking?.date || "N/A"}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.packageInterest || "N/A"}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.booking?.paymentPlan?.price || "N/A"}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.source}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">{lead.booking?.coachId || "N/A"}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <span className="bg-green-50 text-green-400 semibold capitalize px-7 py-2 rounded-xl text-xs font-medium">
                                                        {lead.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="md:w-4/12  flex-shrink-0   gap-5 md:ps-3">
                    <div className="space-y-3 bg-white p-6 mb-5  rounded-3xl shadow-sm ">
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
                                <button onClick={applyFilter} className="flex gap-2 items-center bg-[#237FEA] text-white px-3 py-2 rounded-lg text-sm text-[16px]">
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
                                                    fetchLeads();
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
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={savedCoach?.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    fetchLeads();
                                                    setShowCoachPopup(true);
                                                } else {
                                                    setSavedCoach([]);
                                                    setTempSelectedCoaches([]);
                                                }
                                            }}
                                            className="peer hidden"
                                        />
                                        <span className="w-5 h-5 inline-flex text-gray-500 items-center justify-center border border-[#717073] rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                                            <Check className="w-4 h-4 transition-all" strokeWidth={3} />
                                        </span>
                                        <span>Coach</span>
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
                                                            alt={
                                                                admin?.firstName || admin?.lastName
                                                                    ? `${admin?.firstName ?? ""} ${admin.lastName && admin.lastName !== 'null' ? ` ${admin.lastName}` : ''}`.trim()
                                                                    : "Unknown Admin"
                                                            }

                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <span>
                                                            {admin?.firstName || admin?.lastName
                                                                ? `${admin?.firstName ?? ""} ${admin.lastName && admin.lastName !== 'null' ? ` ${admin.lastName}` : ''}`.trim()
                                                                : "N/A"}
                                                        </span>

                                                    </label>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium"
                                        
                                               onClick={() => {
                                                setSavedAgent(tempSelectedAgents);
                                                setShowPopup(false);
                                            }}
                                            disabled={tempSelectedAgents.length === 0}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {showCoachPopup && (
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                    onClick={() => {
                                        setShowCoachPopup(false);
                                        setSavedCoach([]);
                                        setTempSelectedCoaches([]);
                                    }}
                                >
                                    <div
                                        ref={popupRef}
                                        className="bg-white rounded-2xl p-6 w-[300px] space-y-4 shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h2 className="text-lg font-semibold">Select coach(es)</h2>
                                        <div className="space-y-3 max-h-72 overflow-y-auto">
                                            {bookedByCoach.map((coach, index) => {
                                                const isSelected = tempSelectedCoaches.some((c) => c.id === coach.id);
                                                return (
                                                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                if (isSelected) {
                                                                    setTempSelectedCoaches((prev) => prev.filter((c) => c.id !== coach.id));
                                                                } else {
                                                                    setTempSelectedCoaches((prev) => [
                                                                        ...prev,
                                                                        { id: coach.id, firstName: coach.firstName, lastName: coach.lastName },
                                                                    ]);
                                                                }
                                                            }}
                                                            className="hidden peer"
                                                        />
                                                        <span className="w-4 h-4 border rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <img
                                                            src={coach.profile ? `${API_BASE_URL}${coach.profile}` : "/demo/synco/members/dummyuser.png"}
                                                            alt={`${coach.firstName ?? ""} ${coach.lastName ?? ""}`.trim() || "Unknown Coach"}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <span>{`${coach.firstName ?? ""} ${coach.lastName ?? ""}`.trim() || "N/A"}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium"
                                            onClick={() => {
                                                setSavedCoach(tempSelectedCoaches);
                                                setShowCoachPopup(false);
                                            }}
                                            disabled={tempSelectedCoaches.length === 0}
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
                    <div className="grid grid-cols-3 gap-2 justify-between">
                        <button
                            onClick={() => {
                                if (selectedStudents && selectedStudents.length > 0) {
                                    sendBookMembershipMail(selectedStudents);
                                } else {
                                    Swal.fire({
                                        icon: "warning",
                                        title: "No Students Selected",
                                        text: "Please select at least one student before sending an email.",
                                        confirmButtonText: "OK",
                                    });
                                }
                            }}
                            className="flex gap-1 items-center justify-center bg-none border border-[#717073] text-[#717073] px-2 py-2 rounded-xl  text-[16px]"
                        >
                            <img
                                src="/demo/synco/icons/mail.png"
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                alt=""
                            />
                            Send Email
                        </button>
                        <button className="flex gap-1 items-center justify-center bg-none border border-[#717073] text-[#717073] px-2 py-2 rounded-xl  text-[16px]">
                            <img src='/demo/synco/icons/sendText.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Send Text
                        </button>
                        <button onClick={exportToExcel} className="flex gap-2 items-center justify-center bg-[#237FEA] text-white px-3 py-2 rounded-xl  text-[16px]">
                            <img src='/demo/synco/icons/download.png' className='w-4 h-4 sm:w-5 sm:h-5' alt="" />
                            Export Data
                        </button>
                    </div>
                </div>


            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-5">
                    {/* Modal box */}
                    <div className="bg-white rounded-2xl max-h-[90vh] overflow-auto w-full max-w-md p-6 relative shadow-xl">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={22} />
                        </button>

                        <h2 className="text-lg font-semibold text-center mb-6">
                            Add a new lead
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Parent Name
                                </label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Child Name
                                </label>
                                <input
                                    type="text"
                                    name="childName"
                                    value={formData.childName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    postCode
                                </label>
                                <input
                                    type="text"
                                    name="postCode"
                                    value={formData.postCode}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Package Interest
                                </label>
                                <input
                                    type="text"
                                    name="packageInterest"
                                    value={formData.packageInterest}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Availability
                                </label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                >
                                    <option value="">Select</option>
                                    <option value="Weekdays">Weekdays</option>
                                    <option value="Weekends">Weekends</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Source
                                </label>
                                <select
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
                                >
                                    <option value="">Select</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Online">Online</option>
                                    <option value="Flyer">Flyer</option>
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-auto px-7 py-2.5 rounded-lg font-medium transition 
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#237FEA] hover:bg-blue-700 text-white"}`}
                                >
                                    {loading ? "Adding..." : "Add Student"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SalesDashboard;
